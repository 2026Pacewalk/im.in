// Client-safe formatting helpers. Imported by client components, so this module
// must never pull in server-only code (fs, the catalog, etc.). Types come from
// store-types (pure types), never from wp.ts.
import type { CurrencyInfo, StorePrices } from "./store-types";

/** Decode the HTML entities WP returns in titles (e.g. &#060; &amp; &#8217;). */
export function decode(input?: string): string {
  if (!input) return "";
  return input
    .replace(/&#0*(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
      String.fromCodePoint(parseInt(n, 16))
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/** Format a Store API minor-unit amount (e.g. "199900" -> "₹1,999"). */
export function money(amount: string | number, c: CurrencyInfo): string {
  const unit = c.currency_minor_unit ?? 2;
  const value = Number(amount) / Math.pow(10, unit);
  const formatted = value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${c.currency_prefix || c.currency_symbol || "₹"}${formatted}${
    c.currency_suffix || ""
  }`;
}

export function formatPrice(p?: StorePrices, amount?: string): string {
  if (!p) return "";
  return money(amount ?? p.price, p);
}
