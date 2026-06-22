import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPosts, getTermBySlug, getYoast, decode } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import PostCard from "@/components/PostCard";

export const revalidate = 3600;

export async function generateMetadata(
  props: PageProps<"/category/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const [yoast, term] = await Promise.all([
    getYoast("categories", slug),
    getTermBySlug("categories", slug),
  ]);
  return yoastToMetadata(yoast, {
    title: term ? `${decode(term.name)} | InviteMart Blog` : "Blog | InviteMart",
  });
}

export default async function BlogCategoryPage(
  props: PageProps<"/category/[slug]">
) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;

  const term = await getTermBySlug("categories", slug);
  if (!term) notFound();

  const { items } = await getPosts({
    categoryId: term.id,
    page,
    perPage: 12,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-sm text-gray-500">Blog category</p>
      <h1 className="font-display text-3xl font-bold">{decode(term.name)}</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
