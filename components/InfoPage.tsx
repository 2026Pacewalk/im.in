import Link from "next/link";

export default function InfoPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-cream pb-16">
      <section className="bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <nav className="flex items-center justify-center gap-1 text-sm text-white/60">
            <Link href="/" className="hover:text-gold-soft">Home</Link>
            <span>/</span>
            <span className="text-white/80">{eyebrow || title}</span>
          </nav>
          <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">{title}</h1>
          <div className="gold-rule mx-auto mt-5 w-24 opacity-70" />
        </div>
      </section>

      <article className="mx-auto -mt-8 max-w-3xl px-4">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-10">
          {children}
        </div>
      </article>
    </div>
  );
}
