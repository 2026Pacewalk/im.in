import Image from "next/image";
import Link from "next/link";
import { decode, type WpContentNode } from "@/lib/wp";

export default function PostCard({ post }: { post: WpContentNode }) {
  const featured = post._embedded?.["wp:featuredmedia"]?.[0];
  const title = decode(post.title.rendered);
  const excerpt = decode(post.excerpt?.rendered || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 130);
  const dateLabel = post.date
    ? new Date(post.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-50 to-cream">
        {featured?.source_url ? (
          <Image
            src={featured.source_url}
            alt={featured.alt_text ? decode(featured.alt_text) : title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm font-medium text-brand-400">
            {title}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700 backdrop-blur">
          Tips &amp; Ideas
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {dateLabel && (
          <p className="text-xs font-medium text-gray-400">{dateLabel}</p>
        )}
        <h3 className="mt-1.5 line-clamp-2 font-display text-lg font-semibold leading-snug text-ink transition group-hover:text-brand-600">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{excerpt}…</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
          Read more
          <span className="transition group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
