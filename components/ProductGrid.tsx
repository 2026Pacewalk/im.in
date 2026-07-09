import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { StoreProduct } from "@/lib/store-types";

export default function ProductGrid({
  products,
  page,
  totalPages,
  basePath,
  query,
}: {
  products: StoreProduct[];
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}) {
  if (!products.length) {
    return (
      <p className="py-16 text-center text-gray-500">
        No products found here yet.
      </p>
    );
  }

  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(query || {}).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <Link
              href={buildHref(page - 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:border-brand-400 hover:text-brand-600"
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
              className="rounded-lg border border-gray-200 px-4 py-2 hover:border-brand-400 hover:text-brand-600"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
