import { fetchCart } from "@/lib/cart";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { cart } = await fetchCart();
    return Response.json(cart);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Cart error" },
      { status: 500 }
    );
  }
}
