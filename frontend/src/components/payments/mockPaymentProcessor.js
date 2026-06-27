export const SIMULATE_PAYMENT_FAILURE = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateTransactionReference() {
  // Example: HJ-2026-847392
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `HJ-${year}-${random}`;
}

/**
 * Mock payment processor.
 * The only part that should later change for a real gateway integration is this file.
 */
export async function processMockPayment({ method, amount, circleId, userId }) {
  // mimic a realistic processing time (2–3 seconds)
  const ms = 2000 + Math.floor(Math.random() * 1000);
  await delay(ms);

  if (SIMULATE_PAYMENT_FAILURE) {
    return {
      ok: false,
      error: "Payment failed. Please try again.",
      method,
      amount,
      circleId,
      userId,
      transactionReference: generateTransactionReference(),
      processedAt: new Date().toISOString(),
    };
  }

  return {
    ok: true,
    method,
    amount,
    circleId,
    userId,
    transactionReference: generateTransactionReference(),
    processedAt: new Date().toISOString(),
  };
}

