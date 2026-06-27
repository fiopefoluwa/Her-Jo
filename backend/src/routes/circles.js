import { Router } from "express";
import { randomUUID } from "crypto";
import prisma from "../lib/prisma.js";
import { createTransferRecipient, initiateTransfer } from "../lib/paystack.js";
import { applyCycleCompletionBonus } from "../lib/trustScore.js";

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCircle(circle, currentUserId, members) {
  const totalPool = circle.monthlyContribution * circle.totalCycles;
  const sortedMembers = [...members].sort((a, b) => a.position - b.position);

  const activeSlot = sortedMembers.find((m) => !m.payoutReceived);
  const nextPayoutName = activeSlot
    ? activeSlot.userId === currentUserId
      ? "You"
      : activeSlot.user.name
    : "Completed";

  const daysUntilPayout = activeSlot
    ? Math.max(0, Math.ceil((new Date(activeSlot.scheduledPayoutDate) - Date.now()) / 86400000))
    : 0;

  const currentCycle = sortedMembers.filter((m) => m.payoutReceived).length + 1;

  return {
    id: circle.id,
    name: circle.name,
    description: circle.description,
    leaderId: circle.leaderId,
    isLeader: circle.leaderId === currentUserId,
    frequency: circle.frequency,
    members: members.length,
    monthlyContribution: circle.monthlyContribution,
    monthlyContributionFormatted: `₦${circle.monthlyContribution.toLocaleString()}`,
    totalPool,
    totalPoolFormatted: `₦${totalPool.toLocaleString()}`,
    nextPayout: nextPayoutName,
    daysUntilPayout,
    status: circle.status,
    currentCycle,
    totalCycles: circle.totalCycles,
    startDate: new Date(circle.startDate).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    endDate: new Date(circle.endDate).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    escrowBalance: circle.escrow?.balance ?? 0,
    escrowBalanceFormatted: `₦${(circle.escrow?.balance ?? 0).toLocaleString()}`,
    membersList: sortedMembers.map((m) => ({
      id: m.id,
      userId: m.userId,
      name: m.user.name,
      trustScore: m.user.trustScore,
      avatar: m.user.avatar,
      status: m.payoutReceived ? "paid" : m.memberStatus,
      isYou: m.userId === currentUserId,
      position: m.position,
    })),
    rotationSchedule: sortedMembers.map((m) => ({
      position: m.position,
      name: m.userId === currentUserId ? "You" : m.user.name,
      status: m.payoutReceived
        ? "completed"
        : m === activeSlot
        ? "active"
        : "upcoming",
      date: new Date(m.scheduledPayoutDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    })),
  };
}

const memberInclude = {
  include: {
    user: { select: { id: true, name: true, avatar: true, trustScore: true } },
  },
};

// ─── GET /api/circles ─────────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const memberships = await prisma.circleMember.findMany({
      where: { userId },
      include: {
        circle: {
          include: { members: memberInclude, escrow: true },
        },
      },
    });

    const circles = memberships.map((m) =>
      formatCircle(m.circle, userId, m.circle.members)
    );

    return res.json(
      circles.map(({ membersList, rotationSchedule, ...c }) => c)
    );
  } catch (err) {
    console.error("GET /circles error:", err);
    return res.status(500).json({ error: "Failed to fetch circles." });
  }
});

// ─── GET /api/circles/:id ─────────────────────────────────────────────────────

router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const circle = await prisma.circle.findUnique({
      where: { id: req.params.id },
      include: { members: memberInclude, escrow: true },
    });

    if (!circle) return res.status(404).json({ error: "Circle not found" });

    return res.json(formatCircle(circle, userId, circle.members));
  } catch (err) {
    console.error("GET /circles/:id error:", err);
    return res.status(500).json({ error: "Failed to fetch circle." });
  }
});

// ─── GET /api/circles/:id/rotation ────────────────────────────────────────────

router.get("/:id/rotation", async (req, res) => {
  try {
    const userId = req.user.id;
    const circle = await prisma.circle.findUnique({
      where: { id: req.params.id },
      include: {
        members: {
          orderBy: { position: "asc" },
          include: {
            user: { select: { id: true, name: true, avatar: true, trustScore: true } },
          },
        },
        escrow: true,
      },
    });

    if (!circle) return res.status(404).json({ error: "Circle not found" });

    const membership = await prisma.circleMember.findUnique({
      where: { userId_circleId: { userId, circleId: circle.id } },
    });
    if (!membership) {
      return res.status(403).json({ error: "You are not a member of this circle." });
    }

    const activeSlot = circle.members.find((m) => !m.payoutReceived);
    const completedCount = circle.members.filter((m) => m.payoutReceived).length;

    return res.json({
      circleId: circle.id,
      circleName: circle.name,
      frequency: circle.frequency,
      currentCycle: completedCount + 1,
      totalCycles: circle.totalCycles,
      escrowBalance: circle.escrow?.balance ?? 0,
      escrowBalanceFormatted: `₦${(circle.escrow?.balance ?? 0).toLocaleString()}`,
      rotation: circle.members.map((m) => ({
        position: m.position,
        userId: m.userId,
        name: m.userId === userId ? "You" : m.user.name,
        avatar: m.user.avatar,
        trustScore: m.user.trustScore,
        scheduledPayoutDate: m.scheduledPayoutDate,
        scheduledPayoutDateFormatted: new Date(m.scheduledPayoutDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        payoutReceived: m.payoutReceived,
        payoutReceivedAt: m.payoutReceivedAt,
        contributionStatus: m.payoutReceived
          ? "completed"
          : m === activeSlot
          ? "active"
          : "upcoming",
        isYou: m.userId === userId,
      })),
    });
  } catch (err) {
    console.error("GET /circles/:id/rotation error:", err);
    return res.status(500).json({ error: "Failed to fetch rotation." });
  }
});

// ─── POST /api/circles ────────────────────────────────────────────────────────

router.post("/", async (req, res) => {
  const { name, description, monthlyContribution, members: membersCount, frequency } = req.body;
  const userId = req.user.id;

  if (!name || !monthlyContribution) {
    return res.status(400).json({ error: "Name and monthly contribution are required." });
  }

  const contributionNum = Number(monthlyContribution);
  const membersNum = Number(membersCount) || 6;

  if (isNaN(contributionNum) || contributionNum <= 0) {
    return res.status(400).json({ error: "Monthly contribution must be a positive number." });
  }

  const freq = frequency || "monthly";
  if (!["monthly", "weekly", "biweekly"].includes(freq)) {
    return res.status(400).json({ error: "frequency must be monthly, weekly, or biweekly." });
  }

  try {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + membersNum);

    const circle = await prisma.circle.create({
      data: {
        name: name.trim(),
        description: description?.trim() || "A culturally grounded savings circle.",
        leaderId: userId,
        monthlyContribution: contributionNum,
        frequency: freq,
        totalCycles: membersNum,
        startDate,
        endDate,
        status: "active",
        members: {
          create: {
            userId,
            position: 1,
            memberStatus: "pending",
            scheduledPayoutDate: new Date(
              startDate.getFullYear(),
              startDate.getMonth() + 1,
              15
            ),
          },
        },
        escrow: {
          create: { balance: 0, locked: true },
        },
      },
      include: { members: memberInclude, escrow: true },
    });

    await prisma.activity.create({
      data: {
        userId,
        circleId: circle.id,
        action: "Circle started",
        metadata: JSON.stringify({ circleName: circle.name }),
      },
    });

    return res.status(201).json(formatCircle(circle, userId, circle.members));
  } catch (err) {
    console.error("POST /circles error:", err);
    return res.status(500).json({ error: "Failed to create circle." });
  }
});

// ─── POST /api/circles/:id/invite ────────────────────────────────────────────

router.post("/:id/invite", async (req, res) => {
  const { email } = req.body;
  const userId = req.user.id;
  const circleId = req.params.id;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const circle = await prisma.circle.findUnique({ where: { id: circleId } });
    if (!circle) return res.status(404).json({ error: "Circle not found" });

    const senderMember = await prisma.circleMember.findUnique({
      where: { userId_circleId: { userId, circleId } },
    });
    if (!senderMember) {
      return res.status(403).json({ error: "You are not a member of this circle." });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await prisma.invite.create({
      data: {
        circleId,
        invitedById: userId,
        email: email.toLowerCase().trim(),
        expiresAt,
      },
    });

    return res.status(201).json({
      inviteToken: invite.token,
      inviteUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/invite/${invite.token}`,
      email: invite.email,
      expiresAt: invite.expiresAt,
    });
  } catch (err) {
    console.error("POST /circles/:id/invite error:", err);
    return res.status(500).json({ error: "Failed to create invite." });
  }
});

// ─── POST /api/circles/:id/payout ────────────────────────────────────────────
// Only the circle leader can trigger this.
// For digital funds: sends an actual Paystack transfer to the recipient's bank.
// For cash circles (escrow balance = 0): logs the payout and marks it complete.

router.post("/:id/payout", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const circle = await prisma.circle.findUnique({
      where: { id },
      include: {
        members: {
          orderBy: { position: "asc" },
          ...memberInclude,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                trustScore: true,
                bankAccount: true,
                paystackRecipientCode: true,
              },
            },
          },
        },
        escrow: true,
      },
    });

    if (!circle) return res.status(404).json({ error: "Circle not found" });

    // Only the leader can trigger payout
    if (circle.leaderId !== userId) {
      return res.status(403).json({ error: "Only the circle leader can trigger payouts." });
    }

    const activeSlot = circle.members.find((m) => !m.payoutReceived);
    if (!activeSlot) {
      return res.status(400).json({ error: "All payouts have already been completed." });
    }

    const payoutAmount = circle.monthlyContribution * circle.members.length;
    const recipient = activeSlot.user;

    let transferRef = null;

    // If there are digital funds in escrow, send a Paystack transfer
    if (circle.escrow && circle.escrow.balance > 0) {
      if (!recipient.bankAccount) {
        return res.status(400).json({
          error: `${recipient.name} has not added their bank account yet. Ask them to update their profile before triggering payout.`,
        });
      }

      const bankAccount = JSON.parse(recipient.bankAccount);
      let recipientCode = recipient.paystackRecipientCode;

      // Create Paystack recipient if not already stored
      if (!recipientCode) {
        try {
          const paystackRecipient = await createTransferRecipient({
            name: bankAccount.accountName,
            accountNumber: bankAccount.accountNumber,
            bankCode: bankAccount.bankCode,
          });
          recipientCode = paystackRecipient.recipient_code;

          await prisma.user.update({
            where: { id: recipient.id },
            data: { paystackRecipientCode: recipientCode },
          });
        } catch (err) {
          console.error("Failed to create Paystack recipient:", err.message);
          return res.status(502).json({
            error: "Could not register recipient with Paystack. Check bank account details.",
          });
        }
      }

      // Initiate transfer
      try {
        transferRef = `herjo-payout-${randomUUID()}`;
        await initiateTransfer({
          amountNaira: payoutAmount,
          recipientCode,
          reason: `HerJo payout — ${circle.name} cycle ${circle.currentCycle}`,
          reference: transferRef,
        });
      } catch (err) {
        console.error("Paystack transfer failed:", err.message);
        return res.status(502).json({
          error: "Transfer failed. Please try again or contact support.",
        });
      }

      // Deduct from escrow
      await prisma.escrow.update({
        where: { circleId: id },
        data: { balance: { decrement: payoutAmount } },
      });
    }

    // Mark slot as paid
    await prisma.circleMember.update({
      where: { id: activeSlot.id },
      data: { payoutReceived: true, payoutReceivedAt: new Date() },
    });

    // Give cycle completion trust score bonus to recipient
    const newTrustScore = await applyCycleCompletionBonus(activeSlot.userId);

    // Log activity
    await prisma.activity.create({
      data: {
        userId: activeSlot.userId,
        circleId: circle.id,
        action: transferRef ? "Payout initiated" : "Payout completed",
        amount: payoutAmount,
        metadata: JSON.stringify({
          recipient: recipient.name,
          circleName: circle.name,
          transferRef,
          manual: !transferRef,
        }),
      },
    });

    // Check if circle is fully complete
    const remaining = circle.members.filter(
      (m) => !m.payoutReceived && m.id !== activeSlot.id
    );
    if (remaining.length === 0) {
      await prisma.circle.update({ where: { id }, data: { status: "completed" } });
    }

    const updatedCircle = await prisma.circle.findUnique({
      where: { id },
      include: { members: memberInclude, escrow: true },
    });

    return res.json({
      message: transferRef
        ? `₦${payoutAmount.toLocaleString()} transfer initiated to ${recipient.name}.`
        : `Payout of ₦${payoutAmount.toLocaleString()} recorded for ${recipient.name}.`,
      transferRef,
      recipient: {
        id: recipient.id,
        name: recipient.name,
        newTrustScore,
      },
      circle: formatCircle(updatedCircle, userId, updatedCircle.members),
    });
  } catch (err) {
    console.error("POST /circles/:id/payout error:", err);
    return res.status(500).json({ error: "Failed to process payout." });
  }
});

export default router;
