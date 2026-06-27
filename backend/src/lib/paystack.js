import crypto from "crypto";

const BASE = "https://api.paystack.co";

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!data.status) {
    throw new Error(data.message || "Paystack request failed");
  }

  return data.data;
}

/** Verify the x-paystack-signature header against the raw request body */
export function verifyWebhookSignature(rawBody, signature) {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}

/** Initialize a payment transaction. Returns { authorization_url, access_code, reference } */
export function initializeTransaction({ email, amountNaira, reference, metadata, callbackUrl }) {
  return request("POST", "/transaction/initialize", {
    email,
    amount: Math.round(amountNaira * 100), // Paystack uses kobo
    reference,
    metadata,
    callback_url: callbackUrl || `${process.env.FRONTEND_URL}/payment/verify`,
  });
}

/** Verify a transaction by reference. Returns the full transaction object */
export function verifyTransaction(reference) {
  return request("GET", `/transaction/verify/${encodeURIComponent(reference)}`);
}

/**
 * Create a Paystack transfer recipient for a Nigerian bank account.
 * Returns { recipient_code, ... }
 */
export function createTransferRecipient({ name, accountNumber, bankCode }) {
  return request("POST", "/transferrecipient", {
    type: "nuban",
    name,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: "NGN",
  });
}

/**
 * Initiate a transfer to a recipient.
 * Returns { transfer_code, status, ... }
 */
export function initiateTransfer({ amountNaira, recipientCode, reason, reference }) {
  return request("POST", "/transfer", {
    source: "balance",
    amount: Math.round(amountNaira * 100),
    recipient: recipientCode,
    reason,
    reference,
  });
}

/** List Nigerian banks */
export function listBanks() {
  return request("GET", "/bank?country=nigeria&perPage=200&use_cursor=false");
}

/** Resolve a bank account number (verify it's valid and get account name) */
export function resolveAccount({ accountNumber, bankCode }) {
  return request(
    "GET",
    `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
  );
}
