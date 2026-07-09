// Self-hosted catalog. Serves products/categories from files generated on the
// VPS from the live WordPress API (data/catalog.json + data/products/<slug>.json).
// The storefront no longer needs WordPress or a database at runtime.
import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import type {
  StoreProduct,
  StoreCategory,
  ProductQuery,
  WpTerm,
} from "./store-types";

interface LightProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  prices: StoreProduct["prices"];
  on_sale: boolean;
  average_rating: string;
  review_count: number;
  has_options: boolean;
  is_in_stock: boolean;
  categories: { id: number; name: string; slug: string }[];
  tags: { slug: string }[];
  images: StoreProduct["images"];
}

interface LightCatalog {
  products: LightProduct[];
  categories: StoreCategory[];
}

const DATA = path.join(process.cwd(), "data");
let cache: LightCatalog | null = null;

function load(): LightCatalog {
  if (!cache) {
    try {
      cache = JSON.parse(readFileSync(path.join(DATA, "catalog.json"), "utf8")) as LightCatalog;
    } catch {
      cache = { products: [], categories: [] };
    }
  }
  return cache;
}

export function catalogHasData(): boolean {
  return load().products.length > 0;
}

export function catalogQuery(q: ProductQuery = {}) {
  let items = load().products.slice();

  if (q.category) items = items.filter((p) => p.categories.some((c) => c.slug === q.category));
  if (q.tag) items = items.filter((p) => p.tags.some((t) => t.slug === q.tag));
  if (q.search) {
    // Word-based search: every search word must appear somewhere in the
    // product's name / categories / tags, in any order. So "baby boss" and
    // "boss baby" both match a "Boss Baby …" product.
    const tokens = q.search.toLowerCase().split(/[\s,]+/).filter(Boolean);
    if (tokens.length) {
      const hay = (p: (typeof items)[number]) =>
        `${p.name} ${p.categories.map((c) => c.name).join(" ")} ${p.tags
          .map((t) => t.slug)
          .join(" ")}`
          .toLowerCase()
          .replace(/-/g, " ");
      // matches ALL words; if that finds nothing, fall back to ANY word
      const all = items.filter((p) => { const h = hay(p); return tokens.every((t) => h.includes(t)); });
      items = all.length ? all : items.filter((p) => { const h = hay(p); return tokens.some((t) => h.includes(t)); });
    }
  }
  if (q.onSale) items = items.filter((p) => p.on_sale);

  const dir = q.order === "asc" ? 1 : -1;
  switch (q.orderby) {
    case "price":
      items.sort((a, b) => (Number(a.prices.price) - Number(b.prices.price)) * dir);
      break;
    case "title":
      items.sort((a, b) => a.name.localeCompare(b.name) * dir);
      break;
    case "rating":
      items.sort((a, b) => (Number(a.average_rating) - Number(b.average_rating)) * dir);
      break;
    default:
      // date / popularity — catalog is in WooCommerce menu order; flip for desc
      if (dir < 0) items.reverse();
  }

  const perPage = q.perPage ?? 24;
  const page = q.page ?? 1;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { items: items.slice(start, start + perPage) as unknown as StoreProduct[], total, totalPages };
}

/** Full product (description, all images) from the per-product detail file. */
export function catalogProductBySlug(slug: string): StoreProduct | null {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null; // guard path traversal
  try {
    return JSON.parse(readFileSync(path.join(DATA, "products", `${slug}.json`), "utf8")) as StoreProduct;
  } catch {
    return null;
  }
}

export function catalogCategories(opts?: {
  perPage?: number;
  parent?: number;
  orderby?: string;
  order?: string;
}): StoreCategory[] {
  let cats = load().categories.slice();
  if (opts?.parent !== undefined) cats = cats.filter((c) => c.parent === opts.parent);
  if (opts?.orderby === "count") {
    cats.sort((a, b) => (b.count - a.count) * (opts.order === "asc" ? -1 : 1));
  } else if (opts?.orderby === "name") {
    cats.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (opts?.perPage) cats = cats.slice(0, opts.perPage);
  return cats;
}

export function catalogAllCategories(): StoreCategory[] {
  return load().categories;
}

export function catalogTerm(slug: string): WpTerm | null {
  const c = load().categories.find((x) => x.slug === slug);
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c.count,
    description: c.description || "",
  } as unknown as WpTerm;
}
