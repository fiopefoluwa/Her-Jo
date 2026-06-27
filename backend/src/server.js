import "dotenv/config";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import circlesRouter from "./routes/circles.js";
import contributionsRouter from "./routes/contributions.js";
import invitesRouter from "./routes/invites.js";
import paymentsRouter, { webhookHandler } from "./routes/payments.js";
import { startPayoutScheduler } from "./jobs/payoutScheduler.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // explicit prod URL set on Render
].filter(Boolean));

app.use(cors({
  origin(origin, callback) {
    // Allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    // Allow any Vercel preview/production deployment
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    // Allow explicit allowlist
    if (ALLOWED_ORIGINS.has(origin)) return callback(null, true);
    callback(new Error(`CORS: origin not allowed — ${origin}`));
  },
  credentials: true,
}));

// ── Paystack webhook — raw body BEFORE express.json() ────────────────────────
// Paystack signature verification requires the raw request body.
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

app.use(express.json());

// ── Public routes (no auth required) ─────────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/api/invites", invitesRouter); // GET /:token is public; POST /:token/accept has its own guard

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    name: "HerJo API",
    version: "3.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Protected routes (JWT required) ──────────────────────────────────────────

app.use("/api", authMiddleware);
app.use("/api/users", usersRouter);
app.use("/api/circles", circlesRouter);
app.use("/api/contributions", contributionsRouter);
app.use("/api/payments", paymentsRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────

app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  🏺 HerJo API Server v3.0`);
  console.log(`  ─────────────────────────`);
  console.log(`  Local:      http://localhost:${PORT}`);
  console.log(`  Health:     http://localhost:${PORT}/api/health`);
  console.log(`  Webhook:    POST http://localhost:${PORT}/api/payments/webhook`);
  console.log(`  Docs:       See README for full endpoint list\n`);
  startPayoutScheduler();
});
