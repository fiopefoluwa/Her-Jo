import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format a circle from the DB into the shape the frontend expects */
function formatCircle(circle, currentUserId, members) {
  const totalPool = circle.monthlyContribution * circle.totalCycles;
  const sortedMembers = [...members].sort((a, b) => a.position - b.position);

  // Active slot = first member whose payout hasn't been received yet
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
    startDate: new Date(circle.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    endDate: new Date(circle.endDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
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
        month: "short", day: "numeric", year: "numeric",
      }),
    })),
  };
}

const memberInclude = {
  include: { user: { select: { id: true, name: true, avatar: true, trustScore: true } } },
};

// ─── GET /api/circles ─────────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    // Only return circles this user belongs to
    const memberships = await prisma.circleMember.findMany({
      where: { userId },
      include: {
        circle: {
          include: { members: memberInclude },
        },
      },
    });

    const circles = memberships.map((m) =>
      formatCircle(m.circle, userId, m.circle.members)
    );

    // Remove membersList and rotationSchedule from list view
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
      include: { members: memberInclude },
    });

    if (!circle) return res.status(404).json({ error: "Circle not found" });

    return res.json(formatCircle(circle, userId, circle.members));
  } catch (err) {
    console.error("GET /circles/:id error:", err);
    return res.status(500).json({ error: "Failed to fetch circle." });
  }
});

// ─── POST /api/circles ────────────────────────────────────────────────────────

router.post("/", async (req, res) => {
  const { name, description, monthlyContribution, members: membersCount } = req.body;
  const userId = req.user.id;

  if (!name || !monthlyContribution) {
    return res.status(400).json({ error: "Name and monthly contribution are required." });
  }

  const contributionNum = Number(monthlyContribution);
  const membersNum = Number(membersCount) || 6;

  if (isNaN(contributionNum) || contributionNum <= 0) {
    return res.status(400).json({ error: "Monthly contribution must be a positive number." });
  }

  try {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + membersNum);

    const circle = await prisma.circle.create({
      data: {
        name: name.trim(),
        description: description?.trim() || "A culturally grounded savings circle.",
        monthlyContribution: contributionNum,
        totalCycles: membersNum,
        startDate,
        endDate,
        status: "active",
        // Create the creator as the first (position 1) member
        members: {
          create: {
            userId,
            position: 1,
            memberStatus: "pending",
            scheduledPayoutDate: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 15),
          },
        },
      },
      include: { members: memberInclude },
    });

    // Log activity
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

    // Check sender is a member
    const senderMember = await prisma.circleMember.findUnique({
      where: { userId_circleId: { userId, circleId } },
    });
    if (!senderMember) {
      return res.status(403).json({ error: "You are not a member of this circle." });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7-day invite

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
      inviteUrl: `http://localhost:5173/invite/${invite.token}`,
      email: invite.email,
      expiresAt: invite.expiresAt,
    });
  } catch (err) {
    console.error("POST /circles/:id/invite error:", err);
    return res.status(500).json({ error: "Failed to create invite." });
  }
});

// ─── POST /api/circles/:id/payout ────────────────────────────────────────────

router.post("/:id/payout", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const circle = await prisma.circle.findUnique({
      where: { id },
      include: { members: { orderBy: { position: "asc" }, ...memberInclude } },
    });

    if (!circle) return res.status(404).json({ error: "Circle not found" });

    // Find the active (next unpaid) member
    const activeSlot = circle.members.find((m) => !m.payoutReceived);
    if (!activeSlot) {
      return res.status(400).json({ error: "All payouts have already been completed." });
    }

    // Mark them as paid
    await prisma.circleMember.update({
      where: { id: activeSlot.id },
      data: { payoutReceived: true, payoutReceivedAt: new Date() },
    });

    // Log payout activity
    const amount = circle.monthlyContribution * circle.members.length;
    await prisma.activity.create({
      data: {
        userId: activeSlot.userId,
        circleId: circle.id,
        action: "Payout completed",
        amount,
        metadata: JSON.stringify({ recipient: activeSlot.user.name }),
      },
    });

    // Check if circle is fully complete
    const remainingSlots = circle.members.filter(
      (m) => !m.payoutReceived && m.id !== activeSlot.id
    );
    if (remainingSlots.length === 0) {
      await prisma.circle.update({ where: { id }, data: { status: "completed" } });
    }

    // Re-fetch updated circle
    const updatedCircle = await prisma.circle.findUnique({
      where: { id },
      include: { members: { orderBy: { position: "asc" }, ...memberInclude } },
    });

    return res.json({
      message: `Payout completed for ${activeSlot.user.name}`,
      circle: formatCircle(updatedCircle, userId, updatedCircle.members),
    });
  } catch (err) {
    console.error("POST /circles/:id/payout error:", err);
    return res.status(500).json({ error: "Failed to process payout." });
  }
});

export default router;
