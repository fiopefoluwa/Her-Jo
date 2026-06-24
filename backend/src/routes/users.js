import { Router } from "express";
import { users } from "../data/mockData.js";

const router = Router();

// GET /api/users/:id — Get user profile
router.get("/:id", (req, res) => {
  const user = users[req.params.id];
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// GET /api/users/:id/trust-score — Get user's trust score
router.get("/:id/trust-score", (req, res) => {
  const user = users[req.params.id];
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({
    userId: user.id,
    name: user.name,
    trustScore: user.trustScore,
    level: user.trustScore >= 90 ? "Master" : user.trustScore >= 75 ? "Excellent" : user.trustScore >= 50 ? "Good" : "Building",
  });
});

export default router;
