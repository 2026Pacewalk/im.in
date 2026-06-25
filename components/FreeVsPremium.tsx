import Link from "next/link";

const FREE = [
  "AI-written wording (English & Hindi)",
  "Instant — ready in seconds",
  "Download PNG / PDF",
  "Share on WhatsApp",
  "Elegant ready-made themes",
  "No signup, no credit card",
];

const PREMIUM = [
  "Fully personalised by our designers",
  "Animated video & clickable PDF invites",
  "Your photos, names, music & caricatures",
  "1,800+ premium designs",
  "Multiple languages & custom themes",
  "Delivered in 4–6 working hours",
];

function Check({ on }: { on: boolean }) {
  return (
    <span className={on ? "text-green-600" : "text-gray-300"}>
      {on ? "✓" : "—"}
    </span>
  );
}

export default function FreeVsPremium() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            Free vs Premium
          </h2>
          <p className="mt-2 text-gray-500">
            Start free with our AI maker, or let our designers craft something
            unforgettable.
          </p>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
            <span className="inline-block w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              FREE
            </span>
            <h3 className="font-display mt-3 text-2xl font-bold text-ink">
              AI Invitation Maker
            </h3>
            <p className="mt-1 text-sm text-gray-500">Perfect for quick, beautiful invites.</p>
            <ul className="mt-5 flex-1 space-y-2.5 text-sm text-gray-700">
              {FREE.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check on /> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/ai-invitation-maker"
              className="mt-6 rounded-xl border border-brand-200 bg-brand-50 px-6 py-3 text-center font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              Create free →
            </Link>
          </div>

          {/* Premium */}
          <div className="relative flex flex-col rounded-3xl border-2 border-brand-600 bg-white p-7 shadow-md">
            <span className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
              MOST LOVED
            </span>
            <span className="inline-block w-fit rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold">
              PREMIUM
            </span>
            <h3 className="font-display mt-3 text-2xl font-bold text-ink">
              Designer Invitations
            </h3>
            <p className="mt-1 text-sm text-gray-500">For weddings & once-in-a-lifetime events.</p>
            <ul className="mt-5 flex-1 space-y-2.5 text-sm text-gray-700">
              {PREMIUM.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check on /> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/shop"
              className="mt-6 rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-brand-700"
            >
              Explore premium designs →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
