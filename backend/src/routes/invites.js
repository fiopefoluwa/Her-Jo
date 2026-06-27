import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// ─── GET /api/invites/:token ──────────────────────────────────────────────────
// Public — anyone with the token can look up the invite details

router.get("/:token", async (req, res) => {
  try {
    const invite = await prisma.invite.findUnique({
      where: { token: req.params.token },
      include: {
        circle: { select: { id: true, name: true, description: true, monthlyContribution: true } },
        invitedBy: { select: { name: true, avatar: true } },
      },
    });

    if (!invite) return res.status(404).json({ error: "Invite not found." });
    if (invite.status !== "pending") {
      return res.status(410).json({ error: "This invite has already been used or expired." });
    }
    if (new Date(invite.expiresAt) < new Date()) {
      await prisma.invite.update({ where: { id: invite.id }, data: { status: "expired" } });
      return res.status(410).json({ error: "This invite has expired." });
    }

    return res.json({
      token: invite.token,
      email: invite.email,
      circle: {
        id: invite.circle.id,
        name: invite.circle.name,
        description: invite.circle.description,
        monthlyContributionFormatted: `₦${invite.circle.monthlyContribution.toLocaleString()}`,
      },
      invitedBy: invite.invitedBy,
      expiresAt: invite.expiresAt,
    });
  } catch (err) {
    console.error("GET /invites/:token error:", err);
    return res.status(500).json({ error: "Failed to fetch invite." });
  }
});

// ─── POST /api/invites/:token/accept ─────────────────────────────────────────
// Protected — must be logged in to accept

router.post("/:token/accept", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const invite = await prisma.invite.findUnique({
      where: { token: req.params.token },
      include: { circle: { include: { members: true } } },
    });

    if (!invite) return res.status(404).json({ error: "Invite not found." });
    if (invite.status !== "pending") {
      return res.status(410).json({ error: "This invite has already been used or expired." });
    }
    if (new Date(invite.expiresAt) < new Date()) {
      return res.status(410).json({ error: "This invite has expired." });
    }

    const circle = invite.circle;

    // Check user isn't already a member
    const alreadyMember = circle.members.find((m) => m.userId === userId);
    if (alreadyMember) {
      return res.status(409).json({ error: "You are already a member of this circle." });
    }

    // Assign next available position
    const nextPosition = circle.members.length + 1;
    const payoutDate = new Date(circle.startDate);
    payoutDate.setMonth(payoutDate.getMonth() + nextPosition);
    payoutDate.setDate(15);

    await prisma.circleMember.create({
      data: {
        userId,
        circleId: circle.id,
        position: nextPosition,
        memberStatus: "pending",
        scheduledPayoutDate: payoutDate,
      },
    });

    // Update total cycles on the circle to reflect new member count
    await prisma.circle.update({
      where: { id: circle.id },
      data: { totalCycles: nextPosition },
    });

    // Mark invite as accepted
    await prisma.invite.update({
      where: { id: invite.id },
      data: { status: "accepted" },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        circleId: circle.id,
        action: "Member joined",
        metadata: JSON.stringify({ circleName: circle.name }),
      },
    });

    return res.json({
      message: `You have joined ${circle.name}!`,
      circleId: circle.id,
      position: nextPosition,
    });
  } catch (err) {
    console.error("POST /invites/:token/accept error:", err);
    return res.status(500).json({ error: "Failed to accept invite." });
  }
});

export default router;
