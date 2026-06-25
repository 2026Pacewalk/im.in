import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPageBySlug,
  getPostBySlug,
  getRecentPosts,
  getProducts,
  decode,
  cleanArticleHtml,
  type WpContentNode,
} from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import BlogArticle from "@/components/blog/BlogArticle";

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

  // Blog posts get the full premium article treatment.
  if (kind === "post") {
    // Derive a product search term from the title (e.g. "Crafting Mata Ki
    // Chowki Invitation Design Tips and Tricks" -> "Mata Ki Chowki Invitation")
    // so we can showcase relevant designs inside the article.
    const term = decode(node.title.rendered)
      .replace(
        /\b(crafting|craft|design|designs|tips|tricks|ideas?|guide|complete|ultimate|best|top|how|to|make|making|create|creating|a|an|the|and|for|your|with|of|in|on|&|20\d\d)\b/gi,
        ""
      )
      .replace(/[^a-z0-9\s]/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    const [recent, productRes] = await Promise.all([
      getRecentPosts(6).catch(() => []),
      term
        ? getProducts({ search: term, perPage: 5, orderby: "popularity" }).catch(
            () => ({ items: [] as Awaited<ReturnType<typeof getProducts>>["items"] })
          )
        : Promise.resolve({ items: [] as Awaited<ReturnType<typeof getProducts>>["items"] }),
    ]);
    const related = recent.filter((p) => p.id !== node.id);
    return (
      <BlogArticle
        node={node}
        related={related}
        products={productRes.items}
        productTerm={term}
      />
    );
  }

  // Static WordPress pages (privacy, terms, return policy, about, contact…) get
  // a clean "document" layout with a header band and a readable content card.
  const title = decode(node.title.rendered);
  const html = cleanArticleHtml(node.content.rendered);
  const updated = node.date
    ? new Date(node.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="bg-cream pb-16">
      {/* Header band */}
      <section className="bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <nav className="flex items-center justify-center gap-1 text-sm text-white/60">
            <Link href="/" className="hover:text-gold-soft">Home</Link>
            <span>/</span>
            <span className="text-white/80">{title}</span>
          </nav>
          <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            {title}
          </h1>
          {updated && (
            <p className="mt-3 text-sm text-white/60">Last updated: {updated}</p>
          )}
          <div className="gold-rule mx-auto mt-5 w-24 opacity-70" />
        </div>
      </section>

      {/* Content card */}
      <article className="mx-auto -mt-8 max-w-3xl px-4">
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-10">
          <div
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>
    </div>
  );
}
