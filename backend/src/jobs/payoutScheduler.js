import cron from "node-cron";
import prisma from "../lib/prisma.js";

/**
 * Daily payout scheduler.
 *
 * Runs at midnight every day (server time).
 * Finds all CircleMember records whose scheduledPayoutDate is today or earlier,
 * haven't been paid yet, and whose circle is still active.
 * Logs an activity entry for each — the actual payout disbursement would be
 * handled by a payment provider in production.
 */
export function startPayoutScheduler() {
  // Run at 00:01 every day
  cron.schedule("1 0 * * *", async () => {
    console.log("\n⏰ [Payout Scheduler] Running daily check...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Find all due slots that haven't been paid
      const dueSlots = await prisma.circleMember.findMany({
        where: {
          payoutReceived: false,
          scheduledPayoutDate: { lte: today },
          circle: { status: "active" },
        },
        include: {
          user: { select: { id: true, name: true } },
          circle: {
            select: {
              id: true,
              name: true,
              monthlyContribution: true,
              members: { select: { id: true } },
            },
          },
        },
      });

      if (dueSlots.length === 0) {
        console.log("  ✓ No payouts due today.");
        return;
      }

      for (const slot of dueSlots) {
        const amount = slot.circle.monthlyContribution * slot.circle.members.length;

        // Mark payout as received
        await prisma.circleMember.update({
          where: { id: slot.id },
          data: { payoutReceived: true, payoutReceivedAt: new Date() },
        });

        // Log activity
        await prisma.activity.create({
          data: {
            userId: slot.userId,
            circleId: slot.circleId,
            action: "Payout completed",
            amount,
            metadata: JSON.stringify({
              recipient: slot.user.name,
              circleName: slot.circle.name,
              automated: true,
            }),
          },
        });

        // Check if this was the last slot — if so, close the circle
        const remaining = await prisma.circleMember.count({
          where: { circleId: slot.circleId, payoutReceived: false },
        });

        if (remaining === 0) {
          await prisma.circle.update({
            where: { id: slot.circleId },
            data: { status: "completed" },
          });
          console.log(`  ✓ Circle "${slot.circle.name}" completed.`);
        }

        console.log(`  💰 Payout triggered: ₦${amount.toLocaleString()} → ${slot.user.name} (${slot.circle.name})`);
      }
    } catch (err) {
      console.error("  ✗ Payout scheduler error:", err);
    }
  });

  console.log("  📅 Payout scheduler started (runs daily at 00:01)");
}
