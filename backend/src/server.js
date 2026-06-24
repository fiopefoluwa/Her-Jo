import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import circlesRouter from "./routes/circles.js";
import contributionsRouter from "./routes/contributions.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

// Apply auth middleware to all API routes
app.use("/api", authMiddleware);

// Routes
app.use("/api/users", usersRouter);
app.use("/api/circles", circlesRouter);
app.use("/api/contributions", contributionsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    name: "HerJo API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`\n  🏺 HerJo API Server`);
  console.log(`  ──────────────────`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/api/health`);
  console.log(`  Circles: http://localhost:${PORT}/api/circles`);
  console.log(`  Users:   http://localhost:${PORT}/api/users/user-1\n`);
});
