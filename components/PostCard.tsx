import Image from "next/image";
import Link from "next/link";
import { decode, type WpContentNode } from "@/lib/wp";

export default function PostCard({ post }: { post: WpContentNode }) {
  const featured = post._embedded?.["wp:featuredmedia"]?.[0];
  const title = decode(post.title.rendered);
  const excerpt = decode(post.excerpt?.rendered || "")
    .replace(/<[^>]+>/g, "")
    .slice(0, 130);

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-brand-50">
        {featured?.source_url && (
          <Image
            src={featured.source_url}
            alt={featured.alt_text ? decode(featured.alt_text) : title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-brand-600">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{excerpt}…</p>
      </div>
    </Link>
  );
}
