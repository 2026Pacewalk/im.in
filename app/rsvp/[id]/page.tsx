import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/rsvp-store";
import RsvpForm from "@/components/rsvp/RsvpForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/rsvp/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const ev = await getEvent(id);
  return {
    title: ev ? `You're invited — ${ev.title} | InviteMart` : "RSVP | InviteMart",
    robots: { index: false, follow: false },
  };
}

export default async function GuestRsvpPage(props: PageProps<"/rsvp/[id]">) {
  const { id } = await props.params;
  const ev = await getEvent(id);
  if (!ev) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Invitation card */}
      <div className="overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-cream to-white text-center shadow-sm">
        <div className="bg-gradient-to-br from-ink via-brand-900 to-brand-700 px-6 py-10 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-soft">
            {ev.eventType} · You&apos;re invited
          </p>
          <h1 className="font-display mt-3 text-3xl font-bold md:text-4xl">{ev.title}</h1>
          <p className="mt-2 text-white/80">Hosted by {ev.hostName}</p>
        </div>
        <div className="px-6 py-8">
          {(ev.date || ev.time || ev.venue) && (
            <div className="flex flex-col items-center gap-1 text-ink">
              {ev.date && <span className="font-display text-lg font-semibold">{ev.date}</span>}
              {ev.time && <span className="text-gray-600">{ev.time}</span>}
              {ev.venue && <span className="mt-1 text-gray-600">📍 {ev.venue}</span>}
            </div>
          )}
          {ev.message && <p className="mx-auto mt-5 max-w-md text-sm italic text-gray-600">“{ev.message}”</p>}
        </div>
      </div>

      <div className="mt-8">
        <RsvpForm eventId={ev.id} />
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        Free RSVP by{" "}
        <Link href="/" className="font-semibold text-brand-600">InviteMart</Link> ·{" "}
        <Link href="/rsvp" className="hover:text-brand-600">Create your own →</Link>
      </p>
    </div>
  );
}
