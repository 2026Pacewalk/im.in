import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, rsvpCounts } from "@/lib/rsvp-store";
import EventShare from "@/components/rsvp/EventShare";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guest Dashboard | InviteMart RSVP",
  robots: { index: false, follow: false },
};

const BADGE: Record<string, string> = {
  yes: "bg-green-100 text-green-700",
  maybe: "bg-amber-100 text-amber-700",
  no: "bg-gray-200 text-gray-600",
};

export default async function GuestDashboard(
  props: PageProps<"/rsvp/[id]/guests">
) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const ev = await getEvent(id);
  if (!ev) notFound();
  const c = rsvpCounts(ev);
  const justCreated = sp.created === "1";

  const STATS = [
    { label: "Attending", value: c.yes, cls: "text-green-600" },
    { label: "Maybe", value: c.maybe, cls: "text-amber-600" },
    { label: "Can't make it", value: c.no, cls: "text-gray-500" },
    { label: "Total headcount", value: c.headcount, cls: "text-brand-600" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {justCreated && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          🎉 Your RSVP page is live! Share the link below to start collecting responses.
        </div>
      )}

      <p className="text-sm text-gray-500">{ev.eventType} · Host dashboard</p>
      <h1 className="font-display text-3xl font-bold text-ink">{ev.title}</h1>
      <p className="mt-1 text-gray-500">
        {[ev.date, ev.time, ev.venue].filter(Boolean).join(" · ")}
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm">
            <div className={`font-display text-3xl font-extrabold ${s.cls}`}>{s.value}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Share + reminders */}
      <div className="mt-6">
        <EventShare id={ev.id} title={ev.title} date={ev.date} />
      </div>

      {/* Guest list */}
      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">
            Guest responses ({ev.rsvps.length})
          </h3>
          <Link href={`/rsvp/${ev.id}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View guest page →
          </Link>
        </div>
        {ev.rsvps.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No responses yet — share your link to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Response</th>
                  <th className="py-2 pr-4">Guests</th>
                  <th className="py-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {[...ev.rsvps].reverse().map((r, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2.5 pr-4 font-medium text-ink">{r.name}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[r.status]}`}>
                        {r.status === "yes" ? "Attending" : r.status === "maybe" ? "Maybe" : "Declined"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600">{r.status === "no" ? "—" : r.guests}</td>
                    <td className="py-2.5 text-gray-500">{r.message || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Bookmark this page — it&apos;s your private dashboard for this event.
      </p>
    </div>
  );
}
