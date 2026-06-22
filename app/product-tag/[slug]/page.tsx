import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getTermBySlug, getYoast, decode } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 3600;

export async function generateMetadata(
  props: PageProps<"/product-tag/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const [yoast, term] = await Promise.all([
    getYoast("product_tag", slug),
    getTermBySlug("product_tag", slug),
  ]);
  return yoastToMetadata(yoast, {
    title: term ? `${decode(term.name)} | InviteMart` : "Tag | InviteMart",
  });
}

export default async function TagPage(props: PageProps<"/product-tag/[slug]">) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;

  const term = await getTermBySlug("product_tag", slug);
  if (!term) notFound();

  const { items, total, totalPages } = await getProducts({
    tag: slug,
    page,
    perPage: 24,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <p className="text-sm text-gray-500">Tag</p>
      <h1 className="font-display text-3xl font-bold md:text-4xl">{decode(term.name)}</h1>
      <p className="mt-1 text-sm text-gray-500">{total} products</p>

      <div className="mt-6">
        <ProductGrid
          products={items}
          page={page}
          totalPages={totalPages}
          basePath={`/product-tag/${slug}`}
        />
      </div>
    </div>
  );
}
