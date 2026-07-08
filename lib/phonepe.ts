// PhonePe Payment Gateway — "Standard Checkout" (X-VERIFY / Salt Key flow).
//
// Credentials are read ONLY from the environment (never hard-coded, never
// committed). If they are absent we fall back to PhonePe's PUBLIC UAT sandbox
// test merchant so the flow can be exercised locally with no real money and no
// access to your live keys.
//
// Required env vars for production (put these in .env.local, which is
// git-ignored — see .env.example):
//   PHONEPE_MERCHANT_ID   your live Merchant ID
//   PHONEPE_SALT_KEY      your live Salt Key (SECRET — never share/commit)
//   PHONEPE_SALT_INDEX    your live Salt Index (usually "1")
//   PHONEPE_HOST          https://api.phonepe.com/apis/hermes
//   APP_BASE_URL          https://invitemart.in  (public origin for redirects/callbacks)
import "server-only";
import crypto from "node:crypto";

// PhonePe public UAT sandbox defaults (documented test merchant — safe, no real money).
const UAT_HOST = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const UAT_MERCHANT = "PGTESTPAYUAT86";
const UAT_SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const UAT_SALT_INDEX = "1";

const HOST = process.env.PHONEPE_HOST || UAT_HOST;
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || UAT_MERCHANT;
const SALT_KEY = process.env.PHONEPE_SALT_KEY || UAT_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || UAT_SALT_INDEX;

/** True when running against real production keys (not the sandbox fallback). */
export const isLiveMode = Boolean(
  process.env.PHONEPE_SALT_KEY && process.env.PHONEPE_MERCHANT_ID
);

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

/** X-VERIFY = sha256(base64Payload + endpointPath + saltKey) + "###" + saltIndex */
function sign(base64Payload: string, endpointPath: string): string {
  return `${sha256(base64Payload + endpointPath + SALT_KEY)}###${SALT_INDEX}`;
}

export interface InitiateResult {
  success: boolean;
  redirectUrl?: string; // PhonePe-hosted payment page
  code?: string;
  message?: string;
}

/**
 * Start a payment. `amount` is in minor units (paise). Returns the PhonePe
 * hosted-checkout URL to redirect the customer to.
 */
export async function initiatePayment(params: {
  merchantTransactionId: string;
  amount: number;
  userId: string;
  mobile?: string;
  redirectUrl: string;
  callbackUrl: string;
}): Promise<InitiateResult> {
  const endpoint = "/pg/v1/pay";
  const payload: Record<string, unknown> = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: params.merchantTransactionId,
    merchantUserId: params.userId,
    amount: params.amount,
    redirectUrl: params.redirectUrl,
    redirectMode: "REDIRECT",
    callbackUrl: params.callbackUrl,
    paymentInstrument: { type: "PAY_PAGE" },
  };
  if (params.mobile) payload.mobileNumber = params.mobile;

  const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  const xVerify = sign(base64, endpoint);

  const res = await fetch(`${HOST}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-VERIFY": xVerify,
    },
    body: JSON.stringify({ request: base64 }),
    cache: "no-store",
  });

  const data = (await res.json().catch(() => null)) as {
    success?: boolean;
    code?: string;
    message?: string;
    data?: { instrumentResponse?: { redirectInfo?: { url?: string } } };
  } | null;

  const url = data?.data?.instrumentResponse?.redirectInfo?.url;
  if (res.ok && data?.success && url) {
    return { success: true, redirectUrl: url, code: data.code };
  }
  return {
    success: false,
    code: data?.code,
    message: data?.message || `PhonePe initiate failed (${res.status})`,
  };
}

export type PaymentState = "PAID" | "FAILED" | "PENDING";

export interface StatusResult {
  state: PaymentState;
  code?: string;
  phonepeTransactionId?: string;
}

/** Server-side authoritative status check for a transaction. */
export async function checkStatus(
  merchantTransactionId: string
): Promise<StatusResult> {
  const endpoint = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
  const xVerify = `${sha256(endpoint + SALT_KEY)}###${SALT_INDEX}`;

  const res = await fetch(`${HOST}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-VERIFY": xVerify,
      "X-MERCHANT-ID": MERCHANT_ID,
    },
    cache: "no-store",
  });

  const data = (await res.json().catch(() => null)) as {
    success?: boolean;
    code?: string;
    data?: { transactionId?: string };
  } | null;

  const code = data?.code;
  const phonepeTransactionId = data?.data?.transactionId;
  let state: PaymentState = "PENDING";
  if (code === "PAYMENT_SUCCESS") state = "PAID";
  else if (code && code !== "PAYMENT_PENDING") state = "FAILED";
  return { state, code, phonepeTransactionId };
}

/**
 * Verify a server-to-server callback. PhonePe sends the base64 response body and
 * an X-VERIFY header of sha256(base64Response + saltKey) + "###" + saltIndex.
 */
export function verifyCallback(base64Response: string, xVerify: string): boolean {
  const expected = `${sha256(base64Response + SALT_KEY)}###${SALT_INDEX}`;
  // constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(xVerify || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function decodeCallback(base64Response: string): {
  merchantTransactionId?: string;
  code?: string;
  transactionId?: string;
} {
  try {
    const json = JSON.parse(
      Buffer.from(base64Response, "base64").toString("utf8")
    ) as {
      code?: string;
      data?: { merchantTransactionId?: string; transactionId?: string };
    };
    return {
      merchantTransactionId: json.data?.merchantTransactionId,
      code: json.code,
      transactionId: json.data?.transactionId,
    };
  } catch {
    return {};
  }
}
