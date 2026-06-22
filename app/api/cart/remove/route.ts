import { removeItem } from "@/lib/cart";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();
    if (!key) return Response.json({ error: "Missing key" }, { status: 400 });
    const cart = await removeItem(String(key));
    return Response.json(cart);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Remove failed" },
      { status: 400 }
    );
  }
}
