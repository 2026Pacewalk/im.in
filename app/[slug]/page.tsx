import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPageBySlug,
  getPostBySlug,
  decode,
  internalizeLinks,
  type WpContentNode,
} from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";

export const revalidate = 3600;

// Pages and blog posts both live at the site root (/{slug}/).
// Resolve a page first, then fall back to a post.
async function resolve(
  slug: string
): Promise<{ node: WpContentNode; kind: "page" | "post" } | null> {
  const page = await getPageBySlug(slug);
  if (page) return { node: page, kind: "page" };
  const post = await getPostBySlug(slug);
  if (post) return { node: post, kind: "post" };
  return null;
}

export async function generateMetadata(
  props: PageProps<"/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const resolved = await resolve(slug);
  return yoastToMetadata(resolved?.node.yoast_head_json, {
    title: resolved
      ? `${decode(resolved.node.title.rendered)} | InviteMart`
      : "InviteMart",
  });
}

export default async function ContentPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const resolved = await resolve(slug);
  if (!resolved) notFound();

  const { node, kind } = resolved;
  const featured = node._embedded?.["wp:featuredmedia"]?.[0];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      {kind === "post" && node.date && (
        <p className="mb-2 text-sm text-gray-500">
          {new Date(node.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      <h1 className="text-3xl font-extrabold leading-tight">
        {decode(node.title.rendered)}
      </h1>

      {featured?.source_url && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={featured.source_url}
            alt={featured.alt_text ? decode(featured.alt_text) : decode(node.title.rendered)}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div
        className="wp-content mt-8"
        dangerouslySetInnerHTML={{ __html: internalizeLinks(node.content.rendered) }}
      />
    </article>
  );
}
