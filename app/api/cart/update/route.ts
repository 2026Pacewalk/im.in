import { updateItem } from "@/lib/cart";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { key, quantity } = await req.json();
    if (!key) return Response.json({ error: "Missing key" }, { status: 400 });
    const cart = await updateItem(String(key), Number(quantity));
    return Response.json(cart);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Update failed" },
      { status: 400 }
    );
  }
}
