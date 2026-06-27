import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// ─── Helper ──────────────────────────────────────────────────────────────────

/** Derive initials avatar from a name (e.g. "Amina Okafor" → "AO") */
function makeAvatar(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !password || (!email && !phone)) {
    return res.status(400).json({ error: "Name, password, and email or phone are required." });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  // Use email or generate a placeholder from phone
  const userEmail = email?.toLowerCase().trim() || `${phone.replace(/\s+/g, "")}@herjo.local`;

  try {
    const existing = await prisma.user.findUnique({ where: { email: userEmail } });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: userEmail,
        phone: phone?.replace(/\s+/g, "") ?? null,
        passwordHash,
        avatar: makeAvatar(name),
        trustScore: 50,
      },
    });

    const token = signToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        trustScore: user.trustScore,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post("/login", async (req, res) => {
  const { email, phone, password } = req.body;

  if (!password || (!email && !phone)) {
    return res.status(400).json({ error: "Email/phone and password are required." });
  }

  const userEmail = email?.toLowerCase().trim() || `${phone.replace(/\s+/g, "")}@herjo.local`;

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = signToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        trustScore: user.trustScore,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
// Inline auth — this router is mounted before the global authMiddleware

router.get("/me", authMiddleware, async (req, res) => {
  // req.user is attached by authMiddleware
  const user = req.user;

  try {
    // Count active and completed cycles
    const members = await prisma.circleMember.findMany({
      where: { userId: user.id },
      include: { circle: { select: { status: true } } },
    });

    const activeCycles = members.filter((m) => m.circle.status === "active").length;
    const completedCycles = members.filter((m) => m.circle.status === "completed").length;

    // Sum all contributions
    const contributions = await prisma.contribution.aggregate({
      where: { userId: user.id },
      _sum: { amount: true },
    });

    const totalSaved = contributions._sum.amount ?? 0;

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      trustScore: user.trustScore,
      totalSaved,
      totalSavedFormatted: `₦${totalSaved.toLocaleString()}`,
      activeCycles,
      completedCycles,
      joinedDate: user.joinedDate,
    });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ error: "Failed to load profile." });
  }
});

export default router;
