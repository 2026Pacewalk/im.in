"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "popularity", label: "Most popular" },
  { value: "date", label: "Newest" },
  { value: "price", label: "Price: low to high" },
  { value: "rating", label: "Top rated" },
  { value: "title", label: "Name: A–Z" },
];

export default function SortBar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const current = params.get("orderby") || "popularity";
  const onSale = params.get("on_sale") === "1";

  function update(changes: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === "") sp.delete(k);
      else sp.set(k, v);
    }
    sp.delete("page"); // reset to first page on any filter change
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-gray-100 py-3">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">{total}</span> products
      </p>

      <div className="flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => update({ on_sale: e.target.checked ? "1" : null })}
            className="h-4 w-4 rounded border-gray-300 text-brand-600"
          />
          On sale
        </label>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Sort:</span>
          <select
            value={current}
            onChange={(e) => update({ orderby: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-400"
          >
            {OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
