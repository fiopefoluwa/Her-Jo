import { randomUUID } from "crypto";
import cron from "node-cron";
import prisma from "../lib/prisma.js";
import { createTransferRecipient, initiateTransfer } from "../lib/paystack.js";
import { applyCycleCompletionBonus, applyTrustDelta } from "../lib/trustScore.js";

/**
 * Daily jobs — runs at 00:01 every day.
 *
 * Job 1 — Missed contribution penalty:
 *   Find members who haven't paid and whose cycle due date has passed.
 *   Apply -15 trust score penalty and log "Missed contribution".
 *
 * Job 2 — Scheduled payouts:
 *   Find CircleMember slots whose scheduledPayoutDate is today or earlier,
 *   haven't been paid, and whose circle is still active.
 *   If digital funds exist in escrow → Paystack transfer.
 *   Otherwise → log manual payout.
 */
export function startPayoutScheduler() {
  cron.schedule("1 0 * * *", async () => {
    console.log("\n⏰ [Scheduler] Running daily jobs...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await runMissedContributionPenalties(today);
    await runScheduledPayouts(today);
  });

  console.log("  📅 Payout scheduler started (runs daily at 00:01)");
}

async function runMissedContributionPenalties(today) {
  try {
    // Members who are still "pending" (didn't pay) and whose active payout slot is overdue
    const overdueMembers = await prisma.circleMember.findMany({
      where: {
        memberStatus: "pending",
        payoutReceived: false,
        circle: { status: "active" },
        scheduledPayoutDate: { lt: today },
      },
      include: {
        user: { select: { id: true, name: true, trustScore: true } },
        circle: { select: { id: true, name: true } },
      },
    });

    for (const member of overdueMembers) {
      // Apply missed contribution penalty
      const { newScore } = await applyTrustDelta(member.userId, member.scheduledPayoutDate, "missed");

      // Log missed activity
      await prisma.activity.create({
        data: {
          userId: member.userId,
          circleId: member.circleId,
          action: "Missed contribution",
          metadata: JSON.stringify({
            circleName: member.circle.name,
            penalty: -15,
            newTrustScore: newScore,
          }),
        },
      });

      console.log(
        `  ⚠️  Missed contribution penalty: ${member.user.name} in "${member.circle.name}" (score: ${member.user.trustScore} → ${newScore})`
      );
    }
  } catch (err) {
    console.error("  ✗ Missed contribution job error:", err);
  }
}

async function runScheduledPayouts(today) {
  try {
    const dueSlots = await prisma.circleMember.findMany({
      where: {
        payoutReceived: false,
        scheduledPayoutDate: { lte: today },
        circle: { status: "active" },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            bankAccount: true,
            paystackRecipientCode: true,
          },
        },
        circle: {
          include: {
            members: { select: { id: true } },
            escrow: true,
          },
        },
      },
    });

    if (dueSlots.length === 0) {
      console.log("  ✓ No payouts due today.");
      return;
    }

    for (const slot of dueSlots) {
      const circle = slot.circle;
      const recipient = slot.user;
      const amount = circle.monthlyContribution * circle.members.length;

      let transferRef = null;
      let transferFailed = false;

      // Attempt Paystack transfer if there's escrow balance
      if (circle.escrow && circle.escrow.balance >= amount && recipient.bankAccount) {
        const bankAccount = JSON.parse(recipient.bankAccount);
        let recipientCode = recipient.paystackRecipientCode;

        try {
          if (!recipientCode) {
            const pr = await createTransferRecipient({
              name: bankAccount.accountName,
              accountNumber: bankAccount.accountNumber,
              bankCode: bankAccount.bankCode,
            });
            recipientCode = pr.recipient_code;
            await prisma.user.update({
              where: { id: recipient.id },
              data: { paystackRecipientCode: recipientCode },
            });
          }

          transferRef = `herjo-auto-${randomUUID()}`;
          await initiateTransfer({
            amountNaira: amount,
            recipientCode,
            reason: `HerJo auto-payout — ${circle.name}`,
            reference: transferRef,
          });

          await prisma.escrow.update({
            where: { circleId: circle.id },
            data: { balance: { decrement: amount } },
          });
        } catch (err) {
          console.error(`  ✗ Auto-transfer failed for ${recipient.name}:`, err.message);
          transferFailed = true;
        }
      }

      if (!transferFailed) {
        // Mark payout received
        await prisma.circleMember.update({
          where: { id: slot.id },
          data: { payoutReceived: true, payoutReceivedAt: new Date() },
        });

        // Trust score bonus
        await applyCycleCompletionBonus(slot.userId);

        // Log activity
        await prisma.activity.create({
          data: {
            userId: slot.userId,
            circleId: slot.circleId,
            action: transferRef ? "Payout initiated" : "Payout completed",
            amount,
            metadata: JSON.stringify({
              recipient: recipient.name,
              circleName: circle.name,
              automated: true,
              transferRef,
            }),
          },
        });

        // Check if circle is done
        const remaining = await prisma.circleMember.count({
          where: { circleId: slot.circleId, payoutReceived: false },
        });
        if (remaining === 0) {
          await prisma.circle.update({
            where: { id: slot.circleId },
            data: { status: "completed" },
          });
          console.log(`  ✓ Circle "${circle.name}" completed.`);
        }

        const via = transferRef ? `via Paystack (${transferRef})` : "(cash — logged only)";
        console.log(
          `  💰 Payout: ₦${amount.toLocaleString()} → ${recipient.name} in "${circle.name}" ${via}`
        );
      }
    }
  } catch (err) {
    console.error("  ✗ Payout scheduler error:", err);
  }
}
