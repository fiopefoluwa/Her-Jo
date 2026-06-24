import { Router } from "express";
import { recentActivity, circles, users } from "../data/mockData.js";

const router = Router();

// GET /api/contributions — Get recent activity/contributions
router.get("/", (req, res) => {
  res.json(recentActivity);
});

// POST /api/contributions — Record a new contribution
router.post("/", (req, res) => {
  const { circleId, userId, amount } = req.body;

  if (!circleId || !userId || !amount) {
    return res.status(400).json({ error: "circleId, userId, and amount are required" });
  }

  const amountNum = Number(amount);
  const user = users[userId];
  const circle = circles.find((c) => c.id === circleId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!circle) {
    return res.status(404).json({ error: "Circle not found" });
  }

  // 1. Update user profile stats
  user.totalSaved += amountNum;
  user.totalSavedFormatted = `₦${user.totalSaved.toLocaleString()}`;
  // Increment trust score (cap at 99)
  if (user.trustScore < 99) {
    user.trustScore += 1;
  }

  // 2. Update circle status
  // Mark the user as paid in this circle's members list
  const member = circle.membersList.find((m) => m.isYou || m.name === user.name);
  if (member) {
    member.status = "paid";
    // Also update their trust score in the circle member list
    member.trustScore = user.trustScore;
  }

  // 3. Create the contribution activity record
  const newContribution = {
    id: `act-${Date.now()}`,
    action: "Contribution received",
    circle: circle.name,
    circleId: circle.id,
    amount: amountNum,
    amountFormatted: `₦${amountNum.toLocaleString()}`,
    date: "Just now",
    timestamp: new Date().toISOString(),
    userId,
  };

  recentActivity.unshift(newContribution);
  res.status(201).json({
    message: "Contribution recorded successfully",
    contribution: newContribution,
    user: {
      totalSaved: user.totalSaved,
      totalSavedFormatted: user.totalSavedFormatted,
      trustScore: user.trustScore
    },
    circleMemberStatus: member ? member.status : null
  });
});

export default router;
