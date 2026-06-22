import type { Metadata } from "next";
import { getProducts } from "@/lib/wp";
import ProductGrid from "@/components/ProductGrid";
import SortBar from "@/components/SortBar";

export const revalidate = 3600;

export async function generateMetadata(
  props: PageProps<"/shop">
): Promise<Metadata> {
  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q : "";
  return {
    title: query
      ? `Search: ${query} | InviteMart`
      : "Shop All Invitations | InviteMart",
    description:
      "Browse 1,800+ digital invitation cards, e-cards, PDF invites and invitation videos for weddings, birthdays and every celebration.",
  };
}

export default async function ShopPage(props: PageProps<"/shop">) {
  const sp = await props.searchParams;
  const query = typeof sp.q === "string" ? sp.q : undefined;
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;
  const orderby =
    typeof sp.orderby === "string"
      ? (sp.orderby as "date" | "price" | "popularity" | "rating" | "title")
      : "popularity";

  const onSale = sp.on_sale === "1";

  const { items, total, totalPages } = await getProducts({
    search: query,
    page,
    perPage: 24,
    orderby,
    order: orderby === "price" || orderby === "title" ? "asc" : "desc",
    onSale,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        {query ? `Results for “${query}”` : "Shop all invitations"}
      </h1>

      <div className="mt-6">
        <SortBar total={total} />
        <ProductGrid
          products={items}
          page={page}
          totalPages={totalPages}
          basePath="/shop"
          query={{
            q: query,
            orderby,
            on_sale: onSale ? "1" : undefined,
          }}
        />
      </div>
    </div>
  );
}
