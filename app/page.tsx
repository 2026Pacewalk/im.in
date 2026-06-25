import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import AiPromo from "@/components/home/AiPromo";
import CustomCta from "@/components/home/CustomCta";
import HomeFaq from "@/components/home/HomeFaq";
import {
  getProducts,
  getStoreCategories,
  decode,
  type StoreCategory,
} from "@/lib/wp";

export const revalidate = 3600;

const TOP_SEARCHES: [string, string][] = [
  ["Wedding Invitation Video", "/product-category/video-invitation/wedding-invitation-video"],
  ["Engagement", "/product-category/engagement-invitation"],
  ["Birthday", "/product-category/baby-kids/birthday-party-invitation"],
  ["Anniversary", "/product-category/anniversary-party-invitation"],
];

export default async function Home() {
  const [popular, latest, cats] = await Promise.all([
    getProducts({ perPage: 10, orderby: "popularity", order: "desc" }),
    getProducts({ perPage: 10, orderby: "date", order: "desc" }),
    getStoreCategories({ perPage: 12, parent: 0, orderby: "count", order: "desc" }),
  ]);

  const topCats: StoreCategory[] = cats
    .filter((c) => c.count > 0 && !/death/i.test(c.slug))
    .slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(231,207,159,.5), transparent 45%), radial-gradient(circle at 10% 90%, rgba(168,27,78,.6), transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
              ✦ Premium Digital Invitations
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              Invitations as memorable as the moment
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
              Custom wedding cards, invitation videos, e-cards and PDF invites —
              beautifully personalised and ready to share in minutes.
            </p>

            <form
              action="/shop"
              className="mx-auto mt-9 flex max-w-lg overflow-hidden rounded-full bg-white p-1.5 shadow-2xl shadow-black/20"
            >
              <input
                name="q"
                placeholder="Search wedding, birthday, anniversary…"
                className="flex-1 bg-transparent px-5 text-sm text-gray-800 outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-white/60">Popular:</span>
              {TOP_SEARCHES.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full border border-white/20 px-3 py-1 text-white/90 transition hover:border-gold hover:text-gold-soft"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-amber-300">★★★★★</span>
                <span className="font-semibold text-white">4.9</span> rating
              </span>
              <span className="hidden h-4 w-px bg-white/20 sm:block" />
              <span>
                <span className="font-semibold text-white">50,000+</span> invitations created
              </span>
              <span className="hidden h-4 w-px bg-white/20 sm:block" />
              <span>⚡ Instant WhatsApp delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-7 text-center md:grid-cols-4">
          {[
            ["⚡", "Instant digital delivery"],
            ["✏️", "Fully personalised"],
            ["💬", "WhatsApp & social ready"],
            ["🎨", "1,800+ designs"],
          ].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-medium text-ink/80">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            Shop by occasion
          </h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {topCats.map((c) => (
            <Link
              key={c.id}
              href={`/product-category/${c.slug}`}
              className="group relative flex h-36 items-end overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {c.image?.src ? (
                <Image
                  src={c.image.src}
                  alt={c.image.alt ? decode(c.image.alt) : decode(c.name)}
                  fill
                  sizes="280px"
                  className="object-cover transition duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 p-4 text-white">
                <span className="font-display text-base font-semibold leading-tight drop-shadow-sm">
                  {decode(c.name)}
                </span>
                <span className="mt-0.5 block text-xs text-white/85">
                  {c.count} designs
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Popular */}
      <ProductRow title="Trending now" products={popular.items} href="/shop" />

      {/* AI Maker promo */}
      <AiPromo />

      {/* Quote band */}
      <section className="bg-ink py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <p className="font-display text-2xl italic leading-relaxed md:text-3xl">
            “Every celebration deserves an invitation that feels as special as
            the day itself.”
          </p>
          <div className="gold-rule mx-auto mt-6 w-24" />
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Explore all invitations →
          </Link>
        </div>
      </section>

      {/* Latest */}
      <ProductRow title="New arrivals" products={latest.items} href="/shop" />

      {/* Testimonials */}
      <Testimonials />

      {/* Custom design CTA */}
      <CustomCta />

      {/* FAQ */}
      <HomeFaq />
    </div>
  );
}

function ProductRow({
  title,
  products,
  href,
}: {
  title: string;
  products: Awaited<ReturnType<typeof getProducts>>["items"];
  href: string;
}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink">{title}</h2>
          <div className="gold-rule mt-3 w-16" />
        </div>
        <Link
          href={href}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {products.slice(0, 10).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
