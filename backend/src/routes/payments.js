import { Router } from "express";
import { randomUUID } from "crypto";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  verifyWebhookSignature,
  initializeTransaction,
  verifyTransaction,
  listBanks,
  resolveAccount,
} from "../lib/paystack.js";
import { applyTrustDelta } from "../lib/trustScore.js";

const router = Router();

// ─── POST /api/payments/initialize ───────────────────────────────────────────
// Authenticated. Starts a Paystack payment for a digital contribution.

router.post("/initialize", authMiddleware, async (req, res) => {
  const { circleId } = req.body;
  const userId = req.user.id;

  if (!circleId) {
    return res.status(400).json({ error: "circleId is required." });
  }

  try {
    const circle = await prisma.circle.findUnique({
      where: { id: circleId },
      include: {
        members: { orderBy: { position: "asc" } },
        escrow: true,
      },
    });

    if (!circle) return res.status(404).json({ error: "Circle not found." });
    if (circle.status !== "active") {
      return res.status(400).json({ error: "This circle is not active." });
    }

    const membership = await prisma.circleMember.findUnique({
      where: { userId_circleId: { userId, circleId } },
    });
    if (!membership) {
      return res.status(403).json({ error: "You are not a member of this circle." });
    }
    if (membership.memberStatus === "paid") {
      return res.status(409).json({ error: "You have already contributed this cycle." });
    }

    // Determine due date: scheduledPayoutDate of the current active slot
    const activeSlot = circle.members.find((m) => !m.payoutReceived);
    const dueDate = activeSlot ? activeSlot.scheduledPayoutDate : null;

    const reference = `herjo-${randomUUID()}`;
    const amount = circle.monthlyContribution;

    // Store a pending contribution so we can match it on webhook
    await prisma.contribution.create({
      data: {
        userId,
        circleId,
        amount,
        paymentType: "digital",
        status: "pending_verification",
        paystackRef: reference,
        dueDate,
      },
    });

    const txn = await initializeTransaction({
      email: req.user.email,
      amountNaira: amount,
      reference,
      metadata: {
        userId,
        circleId,
        circleName: circle.name,
      },
    });

    return res.json({
      authorization_url: txn.authorization_url,
      reference,
      amount,
      amountFormatted: `₦${amount.toLocaleString()}`,
    });
  } catch (err) {
    console.error("POST /payments/initialize error:", err);
    return res.status(500).json({ error: "Failed to initialize payment." });
  }
});

// ─── POST /api/payments/webhook ──────────────────────────────────────────────
// Public. Called by Paystack after a successful payment.
// Raw body is required for signature verification — mounted in server.js with
// express.raw() BEFORE express.json().

export async function webhookHandler(req, res) {
  const signature = req.headers["x-paystack-signature"];

  if (!signature || !verifyWebhookSignature(req.body, signature)) {
    return res.status(400).json({ error: "Invalid webhook signature." });
  }

  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).json({ error: "Invalid JSON payload." });
  }

  // Acknowledge quickly so Paystack doesn't retry
  res.sendStatus(200);

  if (event.event === "charge.success") {
    await handleChargeSuccess(event.data).catch((err) =>
      console.error("[Webhook] charge.success error:", err)
    );
  }

  if (event.event === "transfer.success") {
    await handleTransferSuccess(event.data).catch((err) =>
      console.error("[Webhook] transfer.success error:", err)
    );
  }

  if (event.event === "transfer.failed") {
    console.error("[Webhook] Transfer failed:", event.data);
  }
}

async function handleChargeSuccess(data) {
  const reference = data.reference;

  const contribution = await prisma.contribution.findFirst({
    where: { paystackRef: reference, status: "pending_verification" },
    include: { circle: true, user: true },
  });

  if (!contribution) {
    // Already processed or unknown reference
    return;
  }

  // Mark contribution verified
  await prisma.contribution.update({
    where: { id: contribution.id },
    data: { status: "verified" },
  });

  // Mark member as paid in this cycle
  await prisma.circleMember.update({
    where: {
      userId_circleId: { userId: contribution.userId, circleId: contribution.circleId },
    },
    data: { memberStatus: "paid" },
  });

  // Credit escrow
  const escrow = await prisma.escrow.upsert({
    where: { circleId: contribution.circleId },
    update: { balance: { increment: contribution.amount } },
    create: { circleId: contribution.circleId, balance: contribution.amount, locked: true },
  });

  // Update trust score
  await applyTrustDelta(contribution.userId, contribution.dueDate, "paid");

  // Log activity
  await prisma.activity.create({
    data: {
      userId: contribution.userId,
      circleId: contribution.circleId,
      action: "Contribution received",
      amount: contribution.amount,
      metadata: JSON.stringify({
        circleName: contribution.circle.name,
        paymentType: "digital",
        reference,
      }),
    },
  });

  console.log(
    `[Webhook] ✓ Digital contribution verified: ₦${contribution.amount.toLocaleString()} by ${contribution.user.name}`
  );
}

async function handleTransferSuccess(data) {
  const reference = data.reference;

  // Find the activity log for this payout transfer
  await prisma.activity.updateMany({
    where: {
      metadata: { contains: reference },
      action: "Payout initiated",
    },
    data: {
      action: "Payout completed",
    },
  });

  console.log(`[Webhook] ✓ Transfer succeeded: ref ${reference}`);
}

// ─── GET /api/payments/banks ──────────────────────────────────────────────────
// List all Nigerian banks (for bank account setup form)

router.get("/banks", authMiddleware, async (req, res) => {
  try {
    const banks = await listBanks();
    // Return only the fields the frontend needs
    return res.json(
      banks.map((b) => ({ name: b.name, code: b.code, slug: b.slug }))
    );
  } catch (err) {
    console.error("GET /payments/banks error:", err);
    return res.status(500).json({ error: "Failed to fetch bank list." });
  }
});

// ─── POST /api/payments/resolve-account ───────────────────────────────────────
// Verify a bank account number and return the account name

router.post("/resolve-account", authMiddleware, async (req, res) => {
  const { accountNumber, bankCode } = req.body;

  if (!accountNumber || !bankCode) {
    return res.status(400).json({ error: "accountNumber and bankCode are required." });
  }

  try {
    const result = await resolveAccount({ accountNumber, bankCode });
    return res.json({
      accountName: result.account_name,
      accountNumber: result.account_number,
    });
  } catch (err) {
    console.error("POST /payments/resolve-account error:", err);
    return res.status(400).json({ error: "Could not verify account. Please check the details." });
  }
});

export default router;
