import Link from "next/link";

export default function AiPromo() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-800 to-ink px-6 py-10 text-white md:px-12 md:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 20%, rgba(231,207,159,.6), transparent 45%)",
          }}
        />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
              ✦ New · Powered by AI
            </p>
            <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl">
              Create a free invitation in seconds
            </h2>
            <p className="mt-2 max-w-xl text-white/80">
              Tell our AI the occasion and your details — it writes the wording and
              designs the card for you. Free to download and share.
            </p>
          </div>
          <Link
            href="/ai-invitation-maker"
            className="shrink-0 rounded-full bg-white px-8 py-3.5 font-semibold text-brand-700 transition hover:bg-cream"
          >
            Try the AI Maker →
          </Link>
        </div>
      </div>
    </section>
  );
}
