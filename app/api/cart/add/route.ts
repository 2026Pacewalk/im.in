import { addItem } from "@/lib/cart";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { id, quantity } = await req.json();
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    const cart = await addItem(Number(id), Number(quantity) || 1);
    return Response.json(cart);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Add to cart failed" },
      { status: 400 }
    );
  }
}
