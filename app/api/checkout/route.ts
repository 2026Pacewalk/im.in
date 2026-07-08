import { fetchCart } from "@/lib/cart";
import { createOrder, setOrderStatus } from "@/lib/order-store";
import { initiatePayment } from "@/lib/phonepe";
import { decode } from "@/lib/wp";

export const dynamic = "force-dynamic";

function baseUrl(req: Request): string {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL.replace(/\/$/, "");
  const origin = req.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = req.headers.get("host") || "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

interface CheckoutBody {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export async function POST(req: Request) {
  try {
    const b = (await req.json()) as CheckoutBody;

    // --- validate customer ---
    const name = (b.name || "").trim();
    const email = (b.email || "").trim();
    const phone = (b.phone || "").replace(/\D/g, "");
    const address = (b.address || "").trim();
    const city = (b.city || "").trim();
    const state = (b.state || "").trim();
    const pincode = (b.pincode || "").replace(/\D/g, "");

    if (!name || !email || phone.length !== 10 || !address || !city || !state || pincode.length !== 6) {
      return Response.json(
        { error: "Please fill all fields — a valid 10-digit phone and 6-digit pincode are required." },
        { status: 400 }
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // --- authoritative amount from the server-side cart (never trust the client) ---
    const { cart } = await fetchCart();
    const items = cart?.items ?? [];
    if (!cart || items.length === 0) {
      return Response.json({ error: "Your cart is empty." }, { status: 400 });
    }
    const amount = Number(cart.totals.total_price); // minor units (paise)
    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json({ error: "Could not determine order total." }, { status: 400 });
    }

    // --- create our order record (PENDING) ---
    const order = await createOrder({
      amount,
      currency: "INR",
      items: items.map((i) => ({
        name: decode(i.name),
        quantity: i.quantity,
        lineTotal: Number(i.totals.line_total),
      })),
      customer: { name, email, phone, address, city, state, pincode },
    });

    // --- start PhonePe payment ---
    const origin = baseUrl(req);
    const pay = await initiatePayment({
      merchantTransactionId: order.id,
      amount,
      userId: order.id,
      mobile: phone,
      redirectUrl: `${origin}/checkout/status?orderId=${order.id}`,
      callbackUrl: `${origin}/api/phonepe/callback`,
    });

    if (!pay.success || !pay.redirectUrl) {
      await setOrderStatus(order.id, "FAILED", { paymentCode: pay.code });
      return Response.json(
        { error: pay.message || "Could not start payment. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ orderId: order.id, redirectUrl: pay.redirectUrl });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
