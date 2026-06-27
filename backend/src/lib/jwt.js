import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "herjo-fallback-secret";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Sign a JWT token for a given user ID.
 * @param {string} userId
 * @returns {string} JWT token
 */
export function signToken(userId) {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verify a JWT token and return the decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {{ sub: string }}
 */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
