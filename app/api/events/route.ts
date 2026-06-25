import { createEvent } from "@/lib/rsvp-store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b?.title || !b?.hostName) {
      return Response.json({ error: "Event title and host name are required." }, { status: 400 });
    }
    const ev = await createEvent({
      title: String(b.title).slice(0, 120),
      hostName: String(b.hostName).slice(0, 80),
      eventType: String(b.eventType || "Event").slice(0, 60),
      date: b.date ? String(b.date).slice(0, 60) : undefined,
      time: b.time ? String(b.time).slice(0, 40) : undefined,
      venue: b.venue ? String(b.venue).slice(0, 160) : undefined,
      message: b.message ? String(b.message).slice(0, 500) : undefined,
      whatsapp: b.whatsapp ? String(b.whatsapp).slice(0, 20) : undefined,
    });
    return Response.json({ id: ev.id });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Could not create event" },
      { status: 500 }
    );
  }
}
