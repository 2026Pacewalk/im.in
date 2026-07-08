import { verifyCallback, decodeCallback, checkStatus } from "@/lib/phonepe";
import { setOrderStatus } from "@/lib/order-store";

export const dynamic = "force-dynamic";

// PhonePe calls this server-to-server after payment. It posts { response: base64 }
// with an X-VERIFY header. We verify the signature, then confirm the real state
// with a server-side status check (the callback is a trigger, not the source of
// truth) before marking the order PAID/FAILED.
export async function POST(req: Request) {
  try {
    const xVerify = req.headers.get("x-verify") || "";
    const body = (await req.json().catch(() => null)) as { response?: string } | null;
    const base64 = body?.response;
    if (!base64 || !verifyCallback(base64, xVerify)) {
      return Response.json({ ok: false, error: "Invalid signature" }, { status: 400 });
    }

    const { merchantTransactionId } = decodeCallback(base64);
    if (!merchantTransactionId) {
      return Response.json({ ok: false, error: "Missing transaction id" }, { status: 400 });
    }

    const status = await checkStatus(merchantTransactionId);
    if (status.state === "PAID") {
      await setOrderStatus(merchantTransactionId, "PAID", {
        paymentCode: status.code,
        phonepeTransactionId: status.phonepeTransactionId,
      });
    } else if (status.state === "FAILED") {
      await setOrderStatus(merchantTransactionId, "FAILED", { paymentCode: status.code });
    }
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "Callback error" },
      { status: 500 }
    );
  }
}
