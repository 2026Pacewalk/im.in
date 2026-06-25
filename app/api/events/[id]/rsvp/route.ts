import { addRsvp, type RsvpStatus } from "@/lib/rsvp-store";

export const dynamic = "force-dynamic";

const VALID: RsvpStatus[] = ["yes", "no", "maybe"];

export async function POST(req: Request, ctx: RouteContext<"/api/events/[id]/rsvp">) {
  try {
    const { id } = await ctx.params;
    const b = await req.json();
    if (!b?.name || !VALID.includes(b.status)) {
      return Response.json({ error: "Name and a valid response are required." }, { status: 400 });
    }
    const ev = await addRsvp(id, {
      name: String(b.name).slice(0, 80),
      status: b.status as RsvpStatus,
      guests: Math.max(1, Math.min(50, Number(b.guests) || 1)),
      message: b.message ? String(b.message).slice(0, 300) : undefined,
    });
    if (!ev) return Response.json({ error: "Event not found." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Could not submit RSVP" },
      { status: 500 }
    );
  }
}
