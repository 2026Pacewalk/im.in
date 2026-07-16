// Build the self-hosted catalog from the live-API harvest in .data/live/.
// Splits into:
//   data/catalog.json        -> LIGHT listing data (held in memory: shop/home/
//                               category/search). No descriptions.
//   data/products/<slug>.json -> FULL product (description, all images) read on
//                               demand by the product page.
//   data/catalog-images.json  -> every image URL, for the local-hosting pass.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";

const FULL_FIELDS = [
  "id", "name", "slug", "permalink", "type", "short_description", "description",
  "on_sale", "prices", "price_html", "average_rating", "review_count", "images",
  "categories", "tags", "has_options", "is_in_stock", "sku",
];

mkdirSync("data/products", { recursive: true });
try { rmSync("data/products", { recursive: true, force: true }); } catch {}
mkdirSync("data/products", { recursive: true });

const list = [];
const feed = [];
const images = new Set();

// decode the HTML entities WordPress returns in names/categories
const decodeEnt = (s) =>
  String(s || "")
    .replace(/&#0*(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'");

// HTML -> single-line plain text (for the Merchant Center description)
const plain = (html) =>
  decodeEnt(
    String(html || "")
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

for (let p = 1; p <= 19; p++) {
  const arr = JSON.parse(readFileSync(`.data/live/products-${p}.json`, "utf8"));
  for (const prod of arr) {
    const permalink = `/product/${prod.slug}`;

    // full record -> per-product file
    const full = {};
    for (const f of FULL_FIELDS) full[f] = prod[f];
    full.permalink = permalink;
    writeFileSync(`data/products/${prod.slug}.json`, JSON.stringify(full, null, 0));

    // light record -> listing catalog (first image only, no descriptions)
    const img = (prod.images || [])[0];
    list.push({
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      permalink,
      prices: prod.prices,
      on_sale: prod.on_sale,
      average_rating: prod.average_rating,
      review_count: prod.review_count,
      has_options: prod.has_options,
      is_in_stock: prod.is_in_stock,
      categories: (prod.categories || []).map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      tags: (prod.tags || []).map((t) => ({ slug: t.slug })),
      images: img ? [{ id: img.id, src: img.src, thumbnail: img.thumbnail, alt: img.alt || prod.name }] : [],
    });

    // Google Merchant Center feed record. Google requires an image + description,
    // so products with no image are skipped.
    if (img) {
      const desc =
        plain(prod.short_description).slice(0, 4500) ||
        plain(prod.description).slice(0, 4500) ||
        `${prod.name} — personalised digital invitation from InviteMart.`;
      feed.push({
        id: prod.sku || `im-${prod.id}`,
        title: decodeEnt(prod.name).slice(0, 150),
        desc,
        slug: prod.slug,
        image: img.src,
        extra: (prod.images || []).slice(1, 11).map((i) => i.src).filter(Boolean),
        regular: prod.prices?.regular_price ?? prod.prices?.price,
        sale: prod.on_sale ? prod.prices?.sale_price : null,
        minor: prod.prices?.currency_minor_unit ?? 2,
        // primary category only — product_type is a single path, not a list of
        // unrelated categories
        type: decodeEnt((prod.categories || [])[0]?.name || ""),
      });
    }

    for (const im of prod.images || []) { if (im.src) images.add(im.src); if (im.thumbnail) images.add(im.thumbnail); }
  }
}

let categories = [];
for (const p of [1, 2]) {
  try { categories = categories.concat(JSON.parse(readFileSync(`.data/live/cats-${p}.json`, "utf8"))); } catch {}
}
for (const c of categories) if (c.image?.src) images.add(c.image.src);

writeFileSync("data/catalog.json", JSON.stringify({ products: list, categories }, null, 0));
writeFileSync("data/catalog-images.json", JSON.stringify([...images], null, 0));
writeFileSync("data/feed.json", JSON.stringify(feed, null, 0));

console.log(`light catalog: ${list.length} products, ${categories.length} categories`);
console.log(`merchant feed: ${feed.length} items (${list.length - feed.length} skipped — no image)`);
console.log(`per-product detail files: data/products/*.json`);
console.log(`unique images to host: ${images.size}`);
