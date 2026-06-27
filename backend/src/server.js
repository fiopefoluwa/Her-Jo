import "dotenv/config";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import circlesRouter from "./routes/circles.js";
import contributionsRouter from "./routes/contributions.js";
import invitesRouter from "./routes/invites.js";
import { startPayoutScheduler } from "./jobs/payoutScheduler.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

// ── Public routes (no auth required) ─────────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/api/invites", invitesRouter); // GET /:token is public; POST /:token/accept has its own guard

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    name: "HerJo API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Protected routes (JWT required) ──────────────────────────────────────────

app.use("/api", authMiddleware);
app.use("/api/users", usersRouter);
app.use("/api/circles", circlesRouter);
app.use("/api/contributions", contributionsRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────

app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  🏺 HerJo API Server v2.0`);
  console.log(`  ─────────────────────────`);
  console.log(`  Local:      http://localhost:${PORT}`);
  console.log(`  Health:     http://localhost:${PORT}/api/health`);
  console.log(`  Register:   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`  Login:      POST http://localhost:${PORT}/api/auth/login\n`);
  startPayoutScheduler();
});
