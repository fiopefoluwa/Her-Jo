/**
 * Auth middleware placeholder
 * 
 * In a production app, this would:
 * - Validate JWT tokens
 * - Check user session
 * - Attach user to request
 * 
 * For the hackathon demo, it passes through all requests.
 */
export function authMiddleware(req, res, next) {
  // TODO: Implement actual authentication
  // For now, attach a default user
  req.user = {
    id: "user-1",
    name: "Amina Okafor",
  };
  next();
}
