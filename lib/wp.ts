// Data layer for the headless WordPress / WooCommerce backend (invitemart.in).
// All content, images, prices and SEO are pulled live from the existing site,
// so every one of the existing slugs/URLs is preserved 1:1.

export const SITE = "https://invitemart.in";
const WP = `${SITE}/wp-json/wp/v2`;
const STORE = `${SITE}/wp-json/wc/store/v1`;

// How long (seconds) Next caches a backend response before revalidating.
const REVALIDATE = 3600;

// Fetch JSON with a retry + content-type guard. The WordPress backend
// occasionally returns a transient 302 -> HTML page (LiteSpeed/security layer);
// without this guard that HTML crashes JSON.parse.
//
// Cache-poisoning guard: Next caches ANY 200 response by URL when `next.revalidate`
// is set — including a transient HTML redirect page. Once poisoned, every request
// for the next `revalidate` seconds re-reads that cached HTML and the page stays
// broken even after the backend recovers. So the first attempt uses the shared
// cache, but every retry uses `cache: "no-store"` to bypass the (possibly poisoned)
// entry and pull a fresh response straight from the network. A healthy backend then
// recovers the page on the very next request instead of waiting out the full hour.
async function fetchJson(url: string, revalidate: number): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const init: RequestInit & { next?: { revalidate: number } } =
        attempt === 0
          ? { next: { revalidate }, headers: { Accept: "application/json" } }
          : { cache: "no-store", headers: { Accept: "application/json" } };
      const res = await fetch(url, init);
      if (!res.ok) throw new Error(`Backend ${res.status} for ${url}`);
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("json"))
        throw new Error(`Non-JSON response (${ct || "unknown"}) for ${url}`);
      return res;
    } catch (e) {
      lastErr = e;
      if (attempt < 2) await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(`Fetch failed for ${url}`);
}

async function api<T>(url: string, revalidate = REVALIDATE): Promise<T> {
  const res = await fetchJson(url, revalidate);
  return res.json() as Promise<T>;
}

/** Returns the data plus the X-WP-Total / X-WP-TotalPages pagination headers. */
async function apiList<T>(
  url: string,
  revalidate = REVALIDATE
): Promise<{ items: T[]; total: number; totalPages: number }> {
  const res = await fetchJson(url, revalidate);
  const items = (await res.json()) as T[];
  return {
    items,
    total: Number(res.headers.get("X-WP-Total") || items.length),
    totalPages: Number(res.headers.get("X-WP-TotalPages") || 1),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Client-safe helpers (decode/money/formatPrice) live in ./format so client
// components can import them without pulling this server module (fs/catalog)
// into the browser bundle. Re-exported for the many server callers of "@/lib/wp".
export { decode, money, formatPrice } from "./format";

/**
 * Clean WordPress/WooCommerce HTML for display: strip scripts/styles/iframes,
 * leftover shortcodes, empty paragraphs and stacked <br> that create huge gaps.
 */
export function cleanHtml(input?: string): string {
  if (!input) return "";
  let h = input;
  h = h.replace(/<script[\s\S]*?<\/script>/gi, "");
  h = h.replace(/<style[\s\S]*?<\/style>/gi, "");
  h = h.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  // Cut the merchant-baked "Related Products" widget and everything after it
  // (figure cards, wishlist links, .com URLs, placeholder images).
  h = h.replace(/<h[1-6][^>]*>\s*related products[\s\S]*$/i, "");
  // Remove any leftover product-card figures / wishlist / placeholder images.
  h = h.replace(/<figure[\s\S]*?<\/figure>/gi, "");
  h = h.replace(/<img[^>]*woocommerce-placeholder[^>]*>/gi, "");
  h = h.replace(/<a[^>]*add_to_wishlist[^>]*>[\s\S]*?<\/a>/gi, "");
  h = h.replace(/<!--[\s\S]*?-->/g, "");
  h = h.replace(/\[[^\]\n]{0,80}\]/g, ""); // leftover [shortcodes]
  // Strip inline style attributes (merchant-baked highlight backgrounds,
  // justified text, hard-coded colours) so content inherits our clean styling.
  h = h.replace(/\s+style=(["'])[\s\S]*?\1/gi, "");
  // Drop hashtag-spam paragraphs (e.g. "#grihapravesh #ecards ...").
  h = h.replace(/<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*(?:#[^\s<#]+(?:\s|&nbsp;|<br\s*\/?>)*){2,}<\/p>/gi, "");
  // drop empty paragraphs / headings (only whitespace, &nbsp; or <br>)
  h = h.replace(/<(p|h[1-6])[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, "");
  h = h.replace(/(<br\s*\/?>\s*){2,}/gi, "<br>"); // collapse br stacks
  h = h.replace(/(&nbsp;\s*){2,}/gi, " ");
  return internalizeLinks(h).trim();
}

/**
 * Extract just the genuine intro copy from a WooCommerce product description.
 * Merchant descriptions bolt on boilerplate after the real text — a "How To
 * Make…" step list, a "Reasons to get…" benefits list, hashtag spam and
 * promotional links ("CLICK HERE", "Order On WhatsApp"). We render our own
 * designed sections for those, so here we keep only the lead paragraphs.
 */
export function productIntro(input: string | undefined, productName: string): string {
  if (!input) return "";
  let h = input;
  // Cut everything from the first boilerplate heading/marker onward.
  const cutMarkers = [
    /<h[1-6][^>]*>\s*how to (make|order|create)[\s\S]*$/i,
    /<h[1-6][^>]*>\s*reasons to (get|buy|choose)[\s\S]*$/i,
    /<h[1-6][^>]*>\s*want to make something different[\s\S]*$/i,
    /<h[1-6][^>]*>\s*for custom design[\s\S]*$/i,
    /<h[1-6][^>]*>[^<]*\bsteps?\b[\s\S]*$/i,
  ];
  for (const re of cutMarkers) h = h.replace(re, "");
  // Remove a leading duplicate title heading (often "<Name> | IM-1234").
  const firstName = productName.split(/[|–-]/)[0].trim().slice(0, 24).toLowerCase();
  h = h.replace(/^\s*<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i, (m, inner: string) => {
    const t = inner.replace(/<[^>]+>/g, "").toLowerCase();
    return t.includes("|") || (firstName && t.includes(firstName)) ? "" : m;
  });
  return cleanHtml(h);
}

/**
 * Clean a blog/article body for display. Lighter than cleanHtml: it strips
 * scripts, inline styles, comments, hashtag spam and empty blocks, but KEEPS
 * images and figures (which are real article content, not product-card junk).
 */
export function cleanArticleHtml(input?: string): string {
  if (!input) return "";
  let h = input;
  h = h.replace(/<script[\s\S]*?<\/script>/gi, "");
  h = h.replace(/<style[\s\S]*?<\/style>/gi, "");
  h = h.replace(/<!--[\s\S]*?-->/g, "");
  // Strip merchant-baked WooCommerce product grids + wishlist widgets (we render
  // our own "Shop related designs" showcase instead). Keep genuine article images.
  h = h.replace(/<ul[^>]*class="[^"]*\bproducts\b[^"]*"[\s\S]*?<\/ul>/gi, "");
  // Remove individual WooCommerce product cards from a related grid — each is an
  // <li class="… product-type-…"> containing placeholder/thumbnail images that
  // break in our app (we show our own "Shop related designs" section instead).
  h = h.replace(/<li[^>]*class="[^"]*product-type-[\s\S]*?<\/li>/gi, "");
  h = h.replace(/<a[^>]*class="[^"]*\bproduct-image\b[^"]*"[\s\S]*?<\/a>/gi, "");
  h = h.replace(/<img[^>]*woocommerce-placeholder[^>]*>/gi, "");
  h = h.replace(/<span[^>]*class="[^"]*\bonsale\b[^"]*"[\s\S]*?<\/span>/gi, "");
  h = h.replace(/<div[^>]*class="[^"]*yith-wcwl[^"]*"[\s\S]*?<\/div>/gi, "");
  h = h.replace(/<a[^>]*add_to_wishlist[^>]*>[\s\S]*?<\/a>/gi, "");
  h = h.replace(/<a[^>]*class="[^"]*add_to_cart_button[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "");
  h = h.replace(/<a[^>]*>\s*(?:select options|view more|add to wishlist)\s*<\/a>/gi, "");
  // Strip WooCommerce price markup + leftover product-title links (with SKU).
  h = h.replace(/<(del|ins|bdi)[^>]*>[\s\S]*?<\/\1>/gi, "");
  h = h.replace(/<span[^>]*class="[^"]*(?:woocommerce-Price|price|amount)[^"]*"[\s\S]*?<\/span>/gi, "");
  h = h.replace(/Current price is:|Original price was:/gi, "");
  h = h.replace(/<a[^>]*>[^<|]*\|\s*[A-Za-z]{1,3}-\d[^<]*<\/a>/gi, "");
  // Product thumbnail links + standalone leftover price text.
  h = h.replace(/<a[^>]*href="[^"]*\/product\/[^"]*"[^>]*>\s*(?:<img[^>]*>)?\s*<\/a>/gi, "");
  // Bare leftover price amounts (merchant promo) — articles don't need them.
  // Handle the literal ₹ and its HTML entity forms (&#8377; / &#x20b9;).
  h = h.replace(/(?:Rs\.?|INR|₹|&#8377;|&#x20b9;)\s*[\d,]+(?:\.\d{1,2})?/gi, "");
  h = h.replace(/\s+style=(["'])[\s\S]*?\1/gi, ""); // strip inline styles
  // Drop hashtag-spam paragraphs.
  h = h.replace(/<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*(?:#[^\s<#]+(?:\s|&nbsp;|<br\s*\/?>)*){2,}<\/p>/gi, "");
  h = h.replace(/<(p|h[1-6])[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, "");
  h = h.replace(/(<br\s*\/?>\s*){2,}/gi, "<br>");
  h = h.replace(/(&nbsp;\s*){2,}/gi, " ");
  return internalizeLinks(h).trim();
}

/** Estimate reading time (minutes) from HTML body text. */
export function readingTime(html?: string): number {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Rewrite absolute invitemart.in anchor links inside WP/Elementor HTML to
 * relative paths, so clicking in-content links keeps the visitor on this app
 * instead of bouncing them to the live site.
 *
 * Left absolute on purpose (these must still load from the live origin):
 *   - images / downloads / any /wp-content, /wp-admin, /wp-json, /wp-includes
 *   - links to actual files (…/something.pdf, .jpg, .zip, …)
 * Only the `href` attribute is touched — `src` (images, media) is untouched.
 */
export function internalizeLinks(input?: string): string {
  if (!input) return "";
  // Legacy domain: invitemart.com no longer serves assets (404), but the same
  // paths exist on invitemart.in. Rewrite .com -> .in for BOTH images (src) and
  // links (href) so inline content images stop breaking.
  const normalized = input.replace(
    /https?:\/\/(?:www\.)?invitemart\.com/gi,
    "https://invitemart.in"
  );
  return normalized.replace(
    /href=(["'])https?:\/\/(?:www\.)?invitemart\.in(\/[^"']*)?\1/gi,
    (match, quote: string, path?: string) => {
      const p = path || "/";
      const lastSegment = p.split(/[?#]/)[0].split("/").pop() || "";
      const isAsset = /^\/wp-(content|admin|json|includes|login)/i.test(p);
      const isFile = /\.[a-z0-9]{2,5}$/i.test(lastSegment);
      if (isAsset || isFile) return match; // keep on the live origin
      return `href=${quote}${p}${quote}`;
    }
  );
}

// ---------------------------------------------------------------------------
// Types (kept pragmatic — only the fields we use)
// ---------------------------------------------------------------------------

export interface StorePrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
}

export interface StoreImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  alt: string;
  name: string;
}

export interface StoreTermRef {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  sku?: string | null;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: StorePrices;
  price_html: string;
  average_rating: string;
  review_count: number;
  images: StoreImage[];
  categories: StoreTermRef[];
  tags: StoreTermRef[];
  has_options: boolean;
  is_in_stock: boolean;
}

export interface StoreCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description: string;
  image: StoreImage | null;
}

export interface YoastHead {
  title?: string;
  description?: string;
  robots?: Record<string, string>;
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string; width?: number; height?: number }[];
  og_type?: string;
  twitter_card?: string;
  schema?: unknown;
}

export interface WpContentNode {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  date?: string;
  yoast_head_json?: YoastHead;
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url: string;
      alt_text: string;
      media_details?: { width: number; height: number };
    }[];
  };
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  link: string;
  yoast_head_json?: YoastHead;
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

export interface CurrencyInfo {
  currency_minor_unit?: number;
  currency_prefix?: string;
  currency_symbol?: string;
  currency_suffix?: string;
}

// money() / formatPrice() are defined in ./format and re-exported at the top.

// ---------------------------------------------------------------------------
// Products (WooCommerce Store API)
// ---------------------------------------------------------------------------

export interface ProductQuery {
  page?: number;
  perPage?: number;
  category?: string; // slug
  tag?: string; // slug
  search?: string;
  orderby?: "date" | "price" | "popularity" | "rating" | "title";
  order?: "asc" | "desc";
  onSale?: boolean;
}

// Storefront is served from the self-hosted catalog (data/catalog.json +
// data/products/<slug>.json), generated from the live WP API. No WordPress or
// database is needed at runtime.
export async function getProducts(q: ProductQuery = {}) {
  const { catalogQuery } = await import("./catalog");
  return catalogQuery(q);
}

export async function getProductBySlug(
  slug: string
): Promise<StoreProduct | null> {
  const { catalogProductBySlug } = await import("./catalog");
  return catalogProductBySlug(slug);
}

export async function getStoreCategories(opts?: {
  perPage?: number;
  parent?: number;
  orderby?: string;
  order?: string;
}) {
  const { catalogCategories } = await import("./catalog");
  return catalogCategories(opts);
}

/** Every product category from the self-hosted catalog. */
export async function getAllStoreCategories(): Promise<StoreCategory[]> {
  const { catalogAllCategories } = await import("./catalog");
  return catalogAllCategories();
}

export interface CategoryNode extends StoreCategory {
  children: StoreCategory[];
}

/** Top-level categories (with their direct children) for the mega-menu. */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  const all = await getAllStoreCategories();
  const byParent = new Map<number, StoreCategory[]>();
  for (const c of all) {
    if (!byParent.has(c.parent)) byParent.set(c.parent, []);
    byParent.get(c.parent)!.push(c);
  }
  const sortByCount = (a: StoreCategory, b: StoreCategory) => b.count - a.count;
  return (byParent.get(0) || [])
    .filter((c) => c.count > 0)
    .sort(sortByCount)
    .map((top) => ({
      ...top,
      children: (byParent.get(top.id) || [])
        .filter((c) => c.count > 0)
        .sort(sortByCount),
    }));
}

// ---------------------------------------------------------------------------
// Pages & Posts (WP REST, with SEO + featured image embedded)
// ---------------------------------------------------------------------------

export async function getPageBySlug(
  slug: string
): Promise<WpContentNode | null> {
  try {
    const data = await api<WpContentNode[]>(
      `${WP}/pages?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`
    );
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPostBySlug(
  slug: string
): Promise<WpContentNode | null> {
  try {
    const data = await api<WpContentNode[]>(
      `${WP}/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`
    );
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPosts(opts: {
  page?: number;
  perPage?: number;
  categoryId?: number;
} = {}) {
  const sp = new URLSearchParams();
  sp.set("per_page", String(opts.perPage ?? 12));
  sp.set("page", String(opts.page ?? 1));
  if (opts.categoryId) sp.set("categories", String(opts.categoryId));
  sp.set("_embed", "wp:featuredmedia");
  try {
    return await apiList<WpContentNode>(`${WP}/posts?${sp.toString()}`);
  } catch {
    return { items: [] as WpContentNode[], total: 0, totalPages: 1 };
  }
}

export async function getRecentPosts(perPage = 6) {
  const { items } = await getPosts({ perPage });
  return items;
}

// ---------------------------------------------------------------------------
// Taxonomy terms + their SEO (product_cat, product_tag, categories)
// ---------------------------------------------------------------------------

export async function getTermBySlug(
  taxonomy: "product_cat" | "product_tag" | "categories",
  slug: string
): Promise<WpTerm | null> {
  // product categories come from the self-hosted catalog now
  if (taxonomy === "product_cat") {
    const { catalogTerm } = await import("./catalog");
    return catalogTerm(slug);
  }
  try {
    const data = await api<WpTerm[]>(
      `${WP}/${taxonomy}?slug=${encodeURIComponent(slug)}`
    );
    return data[0] ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// SEO: fetch the Yoast head for a single object by slug
// ---------------------------------------------------------------------------

export async function getYoast(
  type: "product" | "pages" | "posts" | "product_cat" | "product_tag" | "categories",
  slug: string
): Promise<YoastHead | undefined> {
  try {
    const data = await api<{ yoast_head_json?: YoastHead }[]>(
      `${WP}/${type}?slug=${encodeURIComponent(
        slug
      )}&_fields=yoast_head_json`
    );
    return data[0]?.yoast_head_json;
  } catch {
    return undefined;
  }
}
