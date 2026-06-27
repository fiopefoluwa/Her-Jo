import { verifyToken } from "../lib/jwt.js";
import prisma from "../lib/prisma.js";

/**
 * JWT authentication middleware.
 * Reads `Authorization: Bearer <token>` header, verifies the JWT,
 * loads the user from the database, and attaches them to `req.user`.
 *
 * Routes that should be public must be mounted BEFORE this middleware.
 */
export async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required. Please log in." });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return res.status(401).json({ error: "User not found. Please log in again." });
    }

    req.user = user; // attach the full user object to the request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid token. Please log in." });
  }
}
