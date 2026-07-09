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
const images = new Set();

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

console.log(`light catalog: ${list.length} products, ${categories.length} categories`);
console.log(`per-product detail files: data/products/*.json`);
console.log(`unique images to host: ${images.size}`);
