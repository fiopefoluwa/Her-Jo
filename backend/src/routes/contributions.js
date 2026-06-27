import { Router } from "express";
import prisma from "../lib/prisma.js";
import { applyTrustDelta } from "../lib/trustScore.js";

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatActivity(activity) {
  const meta = JSON.parse(activity.metadata || "{}");
  return {
    id: activity.id,
    action: activity.action,
    circle: activity.circle?.name ?? meta.circleName ?? "Unknown",
    circleId: activity.circleId,
    amount: activity.amount ?? null,
    amountFormatted: activity.amount ? `₦${activity.amount.toLocaleString()}` : "—",
    date: timeAgo(activity.createdAt),
    timestamp: activity.createdAt,
    userId: activity.userId,
  };
}

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60) return "Just now";
  if (secs < 3600) return `${Math.floor(secs / 60)} minutes ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} hours ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)} days ago`;
  return `${Math.floor(secs / 604800)} weeks ago`;
}

// ─── GET /api/contributions ───────────────────────────────────────────────────
// Returns the current user's activity feed

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { circle: { select: { name: true } } },
    });

    return res.json(activities.map(formatActivity));
  } catch (err) {
    console.error("GET /contributions error:", err);
    return res.status(500).json({ error: "Failed to fetch activity." });
  }
});

// ─── GET /api/contributions/group/:circleId ───────────────────────────────────
// All contributions for a circle (for leader view / group details)

router.get("/group/:circleId", async (req, res) => {
  const { circleId } = req.params;
  const userId = req.user.id;

  try {
    // Must be a member
    const membership = await prisma.circleMember.findUnique({
      where: { userId_circleId: { userId, circleId } },
    });
    if (!membership) {
      return res.status(403).json({ error: "You are not a member of this circle." });
    }

    const contributions = await prisma.contribution.findMany({
      where: { circleId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        verifiedBy: { select: { id: true, name: true } },
      },
    });

    return res.json(
      contributions.map((c) => ({
        id: c.id,
        userId: c.userId,
        memberName: c.user.name,
        memberAvatar: c.user.avatar,
        amount: c.amount,
        amountFormatted: `₦${c.amount.toLocaleString()}`,
        paymentType: c.paymentType,
        status: c.status,
        note: c.note,
        dueDate: c.dueDate,
        verifiedAt: c.verifiedAt,
        verifiedBy: c.verifiedBy?.name ?? null,
        createdAt: c.createdAt,
        date: timeAgo(c.createdAt),
      }))
    );
  } catch (err) {
    console.error("GET /contributions/group/:circleId error:", err);
    return res.status(500).json({ error: "Failed to fetch contributions." });
  }
});

// ─── POST /api/contributions/cash ────────────────────────────────────────────
// Member marks a cash payment. Status starts as pending_verification.
// The leader must then call POST /api/contributions/:id/verify to confirm it.

router.post("/cash", async (req, res) => {
  const { circleId, amount, note } = req.body;
  const userId = req.user.id;

  if (!circleId || !amount) {
    return res.status(400).json({ error: "circleId and amount are required." });
  }

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }

  try {
    const circle = await prisma.circle.findUnique({
      where: { id: circleId },
      include: { members: { orderBy: { position: "asc" } } },
    });

    if (!circle) return res.status(404).json({ error: "Circle not found." });
    if (circle.status !== "active") {
      return res.status(400).json({ error: "This circle is not active." });
    }

    const membership = await prisma.circleMember.findUnique({
      where: { userId_circleId: { userId, circleId } },
    });
    if (!membership) {
      return res.status(403).json({ error: "You are not a member of this circle." });
    }
    if (membership.memberStatus === "paid") {
      return res.status(409).json({ error: "You have already contributed this cycle." });
    }

    // Determine due date from active slot
    const activeSlot = circle.members.find((m) => !m.payoutReceived);
    const dueDate = activeSlot ? activeSlot.scheduledPayoutDate : null;

    const contribution = await prisma.contribution.create({
      data: {
        userId,
        circleId,
        amount: amountNum,
        paymentType: "cash",
        status: "pending_verification",
        note: note?.trim() || "",
        dueDate,
      },
    });

    // Log pending activity (not yet verified)
    await prisma.activity.create({
      data: {
        userId,
        circleId,
        action: "Cash payment pending",
        amount: amountNum,
        metadata: JSON.stringify({ circleName: circle.name, contributionId: contribution.id }),
      },
    });

    return res.status(201).json({
      message: "Cash payment recorded. Awaiting leader verification.",
      contribution: {
        id: contribution.id,
        amount: contribution.amount,
        amountFormatted: `₦${contribution.amount.toLocaleString()}`,
        status: contribution.status,
        paymentType: "cash",
        circleId,
        createdAt: contribution.createdAt,
      },
    });
  } catch (err) {
    console.error("POST /contributions/cash error:", err);
    return res.status(500).json({ error: "Failed to record cash contribution." });
  }
});

// ─── POST /api/contributions/:id/verify ──────────────────────────────────────
// Leader verifies a pending cash contribution.

router.post("/:id/verify", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // must be the circle leader

  try {
    const contribution = await prisma.contribution.findUnique({
      where: { id },
      include: { circle: true, user: true },
    });

    if (!contribution) {
      return res.status(404).json({ error: "Contribution not found." });
    }
    if (contribution.status !== "pending_verification") {
      return res.status(409).json({ error: "This contribution has already been verified." });
    }
    if (contribution.paymentType !== "cash") {
      return res.status(400).json({ error: "Only cash contributions require verification." });
    }

    // Only the circle leader can verify
    if (contribution.circle.leaderId !== userId) {
      return res.status(403).json({ error: "Only the circle leader can verify contributions." });
    }

    // Mark verified
    await prisma.contribution.update({
      where: { id },
      data: {
        status: "verified",
        verifiedAt: new Date(),
        verifiedById: userId,
      },
    });

    // Mark member as paid
    await prisma.circleMember.update({
      where: {
        userId_circleId: {
          userId: contribution.userId,
          circleId: contribution.circleId,
        },
      },
      data: { memberStatus: "paid" },
    });

    // Update trust score based on timing vs due date
    const { delta, newScore } = await applyTrustDelta(
      contribution.userId,
      contribution.dueDate,
      "paid"
    );

    // Log verified activity
    await prisma.activity.create({
      data: {
        userId: contribution.userId,
        circleId: contribution.circleId,
        action: "Contribution received",
        amount: contribution.amount,
        metadata: JSON.stringify({
          circleName: contribution.circle.name,
          paymentType: "cash",
          verifiedBy: userId,
        }),
      },
    });

    return res.json({
      message: `Cash payment of ₦${contribution.amount.toLocaleString()} verified for ${contribution.user.name}.`,
      contribution: {
        id: contribution.id,
        status: "verified",
        verifiedAt: new Date(),
      },
      trustScore: { delta, newScore },
    });
  } catch (err) {
    console.error("POST /contributions/:id/verify error:", err);
    return res.status(500).json({ error: "Failed to verify contribution." });
  }
});

export default router;
