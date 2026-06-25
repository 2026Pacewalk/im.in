import type { Metadata } from "next";
import CreateEventForm from "@/components/rsvp/CreateEventForm";

export const metadata: Metadata = {
  title: "Free Online RSVP — Create an Event & Collect Replies | InviteMart",
  description:
    "Create a free RSVP page for your wedding, party or event in seconds. Share the link, collect guest responses, see your headcount, and send WhatsApp reminders. No signup required.",
  alternates: { canonical: "/rsvp" },
};

const STEPS = [
  ["1", "Create your event", "Add the title, date, venue and your details — takes a minute."],
  ["2", "Share the link", "Send your RSVP link on WhatsApp, in your invite, or anywhere."],
  ["3", "Track replies", "See who's coming, your headcount, and send reminders."],
];

export default function RsvpCreatePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            ✦ Free Online RSVP
          </p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Collect RSVPs for your event — free
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Create a shareable RSVP page, track who&apos;s coming, and send
            reminders. No signup, no credit card.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="mb-6 font-display text-2xl font-bold text-ink">
          Create your RSVP page
        </h2>
        <CreateEventForm />
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-ink">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{n}</span>
                <h3 className="font-display mt-3 font-semibold text-ink">{t}</h3>
                <p className="mt-1 text-sm text-gray-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
