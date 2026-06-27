import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function trustLevel(score) {
  if (score >= 90) return "Master";
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Good";
  return "Building";
}

// ─── GET /api/users/:id ───────────────────────────────────────────────────────

router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const members = await prisma.circleMember.findMany({
      where: { userId: user.id },
      include: { circle: { select: { status: true } } },
    });

    const contributions = await prisma.contribution.aggregate({
      where: { userId: user.id },
      _sum: { amount: true },
    });

    const totalSaved = contributions._sum.amount ?? 0;
    const activeCycles = members.filter((m) => m.circle.status === "active").length;
    const completedCycles = members.filter((m) => m.circle.status === "completed").length;

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      trustScore: user.trustScore,
      totalSaved,
      totalSavedFormatted: `₦${totalSaved.toLocaleString()}`,
      activeCycles,
      completedCycles,
      joinedDate: user.joinedDate,
    });
  } catch (err) {
    console.error("GET /users/:id error:", err);
    return res.status(500).json({ error: "Failed to fetch user." });
  }
});

// ─── GET /api/users/:id/trust-score ──────────────────────────────────────────

router.get("/:id/trust-score", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      userId: user.id,
      name: user.name,
      trustScore: user.trustScore,
      level: trustLevel(user.trustScore),
    });
  } catch (err) {
    console.error("GET /users/:id/trust-score error:", err);
    return res.status(500).json({ error: "Failed to fetch trust score." });
  }
});

export default router;
