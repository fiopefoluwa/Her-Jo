import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format a DB activity/contribution row into the frontend activity shape */
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

// ─── POST /api/contributions ──────────────────────────────────────────────────

router.post("/", async (req, res) => {
  const { circleId, amount } = req.body;
  const userId = req.user.id;

  if (!circleId || !amount) {
    return res.status(400).json({ error: "circleId and amount are required." });
  }

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }

  try {
    const circle = await prisma.circle.findUnique({ where: { id: circleId } });
    if (!circle) return res.status(404).json({ error: "Circle not found." });

    // Verify user is a member
    const membership = await prisma.circleMember.findUnique({
      where: { userId_circleId: { userId, circleId } },
    });
    if (!membership) {
      return res.status(403).json({ error: "You are not a member of this circle." });
    }

    // Record the contribution
    const contribution = await prisma.contribution.create({
      data: { userId, circleId, amount: amountNum },
    });

    // Mark member as paid in current cycle
    await prisma.circleMember.update({
      where: { userId_circleId: { userId, circleId } },
      data: { memberStatus: "paid" },
    });

    // Increment trust score (cap at 99)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const newTrustScore = Math.min(99, user.trustScore + 1);
    await prisma.user.update({
      where: { id: userId },
      data: { trustScore: newTrustScore },
    });

    // Log activity
    const activity = await prisma.activity.create({
      data: {
        userId,
        circleId,
        action: "Contribution received",
        amount: amountNum,
        metadata: JSON.stringify({ circleName: circle.name }),
      },
      include: { circle: { select: { name: true } } },
    });

    return res.status(201).json({
      message: "Contribution recorded successfully.",
      contribution: {
        id: contribution.id,
        amount: contribution.amount,
        amountFormatted: `₦${contribution.amount.toLocaleString()}`,
        circleId,
        createdAt: contribution.createdAt,
      },
      user: {
        trustScore: newTrustScore,
      },
      activity: formatActivity(activity),
    });
  } catch (err) {
    console.error("POST /contributions error:", err);
    return res.status(500).json({ error: "Failed to record contribution." });
  }
});

export default router;
