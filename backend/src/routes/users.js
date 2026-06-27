import { Router } from "express";
import prisma from "../lib/prisma.js";
import { createTransferRecipient } from "../lib/paystack.js";
import { trustLevel } from "../lib/trustScore.js";

const router = Router();

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
      where: { userId: user.id, status: "verified" },
      _sum: { amount: true },
    });

    const totalSaved = contributions._sum.amount ?? 0;
    const activeCycles = members.filter((m) => m.circle.status === "active").length;
    const completedCycles = members.filter((m) => m.circle.status === "completed").length;

    const bankAccount = user.bankAccount ? JSON.parse(user.bankAccount) : null;

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      trustScore: user.trustScore,
      trustLevel: trustLevel(user.trustScore),
      totalSaved,
      totalSavedFormatted: `₦${totalSaved.toLocaleString()}`,
      activeCycles,
      completedCycles,
      joinedDate: user.joinedDate,
      bankAccount,
      hasBankAccount: !!bankAccount,
    });
  } catch (err) {
    console.error("GET /users/:id error:", err);
    return res.status(500).json({ error: "Failed to fetch user." });
  }
});

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
// Update profile fields. Bank account details are validated and a Paystack
// transfer recipient is created (or updated) automatically.

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Users can only update their own profile
  if (id !== userId) {
    return res.status(403).json({ error: "You can only update your own profile." });
  }

  const { name, phone, bankAccount } = req.body;

  try {
    const updates = {};

    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone.replace(/\s+/g, "");

    if (bankAccount) {
      const { accountNumber, bankCode, bankName, accountName } = bankAccount;

      if (!accountNumber || !bankCode || !accountName) {
        return res.status(400).json({
          error: "bankAccount requires accountNumber, bankCode, and accountName.",
        });
      }

      // Store bank account as JSON
      updates.bankAccount = JSON.stringify({
        accountNumber,
        bankCode,
        bankName: bankName || "",
        accountName,
      });

      // Create or update Paystack transfer recipient
      try {
        const recipient = await createTransferRecipient({
          name: accountName,
          accountNumber,
          bankCode,
        });
        updates.paystackRecipientCode = recipient.recipient_code;
      } catch (paystackErr) {
        console.error("Paystack recipient creation failed:", paystackErr.message);
        // Don't block the update — recipient can be created later during payout
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update." });
    }

    const user = await prisma.user.update({ where: { id: userId }, data: updates });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      bankAccount: user.bankAccount ? JSON.parse(user.bankAccount) : null,
      hasBankAccount: !!user.bankAccount,
    });
  } catch (err) {
    console.error("PUT /users/:id error:", err);
    return res.status(500).json({ error: "Failed to update profile." });
  }
});

// ─── GET /api/users/:id/trust-score ──────────────────────────────────────────

router.get("/:id/trust-score", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch recent contributions for history context
    const recentContribs = await prisma.contribution.findMany({
      where: { userId: user.id, status: "verified" },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { amount: true, createdAt: true, paymentType: true, circleId: true },
    });

    return res.json({
      userId: user.id,
      name: user.name,
      trustScore: user.trustScore,
      level: trustLevel(user.trustScore),
      recentContributions: recentContribs.length,
    });
  } catch (err) {
    console.error("GET /users/:id/trust-score error:", err);
    return res.status(500).json({ error: "Failed to fetch trust score." });
  }
});

export default router;
