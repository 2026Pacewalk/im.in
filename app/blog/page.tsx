import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPosts, decode } from "@/lib/wp";
import PostCard from "@/components/PostCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Invitation Ideas, Tips & Inspiration | InviteMart",
  description:
    "Ideas, tips and inspiration for digital invitations, wedding cards, e-cards and celebration design from the InviteMart team.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex(props: PageProps<"/blog">) {
  const sp = await props.searchParams;
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;
  const { items, totalPages } = await getPosts({ page, perPage: 13 });

  const feature = page === 1 ? items[0] : undefined;
  const rest = feature ? items.slice(1) : items;

  const buildHref = (p: number) => (p > 1 ? `/blog?page=${p}` : "/blog");

  return (
    <div>
      {/* Header */}
      <section className="border-b border-black/5 bg-gradient-to-b from-cream to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center md:py-16">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            ✦ The InviteMart Journal
          </p>
          <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">
            Invitation ideas &amp; inspiration
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Tips, trends and how-tos for creating beautiful digital invitations
            for every celebration.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Featured post */}
        {feature && (
          <Link
            href={`/${feature.slug}`}
            className="group mb-12 grid overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:shadow-lg md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-brand-50 md:aspect-auto">
              {feature._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                <Image
                  src={feature._embedded["wp:featuredmedia"][0].source_url}
                  alt={decode(feature.title.rendered)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <span className="inline-flex w-fit rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                Featured
              </span>
              <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-ink transition group-hover:text-brand-600 md:text-3xl">
                {decode(feature.title.rendered)}
              </h2>
              <p className="mt-3 line-clamp-3 text-gray-500">
                {decode(feature.excerpt?.rendered || "")
                  .replace(/<[^>]+>/g, "")
                  .replace(/\s+/g, " ")
                  .trim()
                  .slice(0, 200)}
                …
              </p>
              <span className="mt-5 inline-flex items-center gap-1 font-semibold text-brand-600">
                Read article
                <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          !feature && (
            <p className="py-16 text-center text-gray-500">No articles yet.</p>
          )
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2 text-sm">
            {page > 1 && (
              <Link
                href={buildHref(page - 1)}
                className="rounded-lg border border-gray-200 px-4 py-2 transition hover:border-brand-400 hover:text-brand-600"
              >
                ← Prev
              </Link>
            )}
            <span className="px-2 text-gray-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={buildHref(page + 1)}
                className="rounded-lg border border-gray-200 px-4 py-2 transition hover:border-brand-400 hover:text-brand-600"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
