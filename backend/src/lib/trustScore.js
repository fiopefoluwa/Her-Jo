import prisma from "./prisma.js";

/**
 * Compute the trust score delta for a contribution.
 *
 * On-time = paid on or before dueDate
 * Early   = paid 2+ days before dueDate (+12 instead of +10)
 * Late    = paid after dueDate (-5)
 * Missed  = never paid (-15)
 */
export function computeDelta(dueDate, outcome) {
  if (outcome === "missed") return -15;

  if (!dueDate) return 10; // no due date set → treat as on-time

  const now = Date.now();
  const due = new Date(dueDate).getTime();
  const twoDaysBefore = due - 2 * 24 * 60 * 60 * 1000;

  if (now <= twoDaysBefore) return 12; // early
  if (now <= due) return 10;           // on-time
  return -5;                           // late
}

/**
 * Apply a trust score delta to a user, clamping between 0 and 100.
 * Returns the new trust score.
 */
export async function applyTrustDelta(userId, dueDate, outcome = "paid") {
  const delta = computeDelta(dueDate, outcome);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const newScore = Math.max(0, Math.min(100, user.trustScore + delta));

  await prisma.user.update({
    where: { id: userId },
    data: { trustScore: newScore },
  });

  return { delta, newScore };
}

/** Apply the +30 bonus when a member successfully receives their cycle payout */
export async function applyCycleCompletionBonus(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const newScore = Math.min(100, user.trustScore + 30);

  await prisma.user.update({
    where: { id: userId },
    data: { trustScore: newScore },
  });

  return newScore;
}

export function trustLevel(score) {
  if (score >= 90) return "Master";
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Good";
  return "Building";
}
