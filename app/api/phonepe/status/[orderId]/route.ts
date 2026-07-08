import { checkStatus } from "@/lib/phonepe";
import { getOrder, setOrderStatus, type OrderStatus } from "@/lib/order-store";

export const dynamic = "force-dynamic";

// Called by the /checkout/status page after PhonePe redirects the customer back.
// This is the authoritative confirmation path (works even when the async
// server-to-server callback can't reach us, e.g. on localhost).
export async function GET(_req: Request, ctx: RouteContext<"/api/phonepe/status/[orderId]">) {
  try {
    const { orderId } = await ctx.params;
    const order = await getOrder(orderId);
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Already settled — return as-is.
    if (order.status !== "PENDING") {
      return Response.json({ status: order.status, orderId, amount: order.amount });
    }

    const res = await checkStatus(orderId);
    let status: OrderStatus = order.status;
    if (res.state === "PAID") {
      await setOrderStatus(orderId, "PAID", {
        paymentCode: res.code,
        phonepeTransactionId: res.phonepeTransactionId,
      });
      status = "PAID";
    } else if (res.state === "FAILED") {
      await setOrderStatus(orderId, "FAILED", { paymentCode: res.code });
      status = "FAILED";
    }
    return Response.json({ status, orderId, amount: order.amount });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Status check failed" },
      { status: 500 }
    );
  }
}
