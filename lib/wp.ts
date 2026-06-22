// Data layer for the headless WordPress / WooCommerce backend (invitemart.in).
// All content, images, prices and SEO are pulled live from the existing site,
// so every one of the existing slugs/URLs is preserved 1:1.

export const SITE = "https://invitemart.in";
const WP = `${SITE}/wp-json/wp/v2`;
const STORE = `${SITE}/wp-json/wc/store/v1`;

// How long (seconds) Next caches a backend response before revalidating.
const REVALIDATE = 3600;

async function api<T>(url: string, revalidate = REVALIDATE): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Backend ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

/** Returns the data plus the X-WP-Total / X-WP-TotalPages pagination headers. */
async function apiList<T>(
  url: string,
  revalidate = REVALIDATE
): Promise<{ items: T[]; total: number; totalPages: number }> {
  const res = await fetch(url, {
    next: { revalidate },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Backend ${res.status} for ${url}`);
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
  // drop empty paragraphs / headings (only whitespace, &nbsp; or <br>)
  h = h.replace(/<(p|h[1-6])[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, "");
  h = h.replace(/(<br\s*\/?>\s*){2,}/gi, "<br>"); // collapse br stacks
  h = h.replace(/(&nbsp;\s*){2,}/gi, " ");
  return h.trim();
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

export async function getProducts(q: ProductQuery = {}) {
  const sp = new URLSearchParams();
  sp.set("per_page", String(q.perPage ?? 24));
  sp.set("page", String(q.page ?? 1));
  if (q.category) sp.set("category", q.category);
  if (q.tag) sp.set("tag", q.tag);
  if (q.search) sp.set("search", q.search);
  if (q.orderby) sp.set("orderby", q.orderby);
  if (q.order) sp.set("order", q.order);
  if (q.onSale) sp.set("on_sale", "true");
  return apiList<StoreProduct>(`${STORE}/products?${sp.toString()}`);
}

export async function getProductBySlug(
  slug: string
): Promise<StoreProduct | null> {
  const data = await api<StoreProduct[]>(
    `${STORE}/products?slug=${encodeURIComponent(slug)}`
  );
  return data[0] ?? null;
}

export async function getStoreCategories(opts?: {
  perPage?: number;
  parent?: number;
  orderby?: string;
  order?: string;
}) {
  const sp = new URLSearchParams();
  sp.set("per_page", String(opts?.perPage ?? 50));
  if (opts?.parent !== undefined) sp.set("parent", String(opts.parent));
  if (opts?.orderby) sp.set("orderby", opts.orderby);
  if (opts?.order) sp.set("order", opts.order);
  return api<StoreCategory[]>(`${STORE}/products/categories?${sp.toString()}`);
}

/** Fetch every product category (paginates through all pages). */
export async function getAllStoreCategories(): Promise<StoreCategory[]> {
  const first = await apiList<StoreCategory>(
    `${STORE}/products/categories?per_page=100&page=1`
  );
  let all = first.items;
  for (let p = 2; p <= first.totalPages; p++) {
    const next = await apiList<StoreCategory>(
      `${STORE}/products/categories?per_page=100&page=${p}`
    );
    all = all.concat(next.items);
  }
  return all;
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
  const data = await api<WpContentNode[]>(
    `${WP}/pages?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`
  );
  return data[0] ?? null;
}

export async function getPostBySlug(
  slug: string
): Promise<WpContentNode | null> {
  const data = await api<WpContentNode[]>(
    `${WP}/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`
  );
  return data[0] ?? null;
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
  return apiList<WpContentNode>(`${WP}/posts?${sp.toString()}`);
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
  const data = await api<WpTerm[]>(
    `${WP}/${taxonomy}?slug=${encodeURIComponent(slug)}`
  );
  return data[0] ?? null;
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
