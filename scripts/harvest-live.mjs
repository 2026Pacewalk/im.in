// Harvest the full product catalog from the live WooCommerce API into
// .data/live/. Run on the VPS (where /etc/hosts maps invitemart.in to the real
// WordPress origin) or anywhere invitemart.in resolves to WordPress.
//   node scripts/harvest-live.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = "https://invitemart.in/wp-json/wc/store/v1";
mkdirSync(".data/live", { recursive: true });

async function getJson(url) {
  for (let a = 0; a < 4; a++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const total = Number(res.headers.get("x-wp-totalpages") || 1);
      return { data: await res.json(), totalPages: total };
    } catch (e) {
      if (a === 3) throw e;
      await new Promise((r) => setTimeout(r, 1000 * (a + 1)));
    }
  }
}

// products
const first = await getJson(`${BASE}/products?per_page=100&page=1`);
writeFileSync(".data/live/products-1.json", JSON.stringify(first.data));
const pages = first.totalPages;
console.log(`products: page 1/${pages} (${first.data.length})`);
for (let p = 2; p <= pages; p++) {
  const { data } = await getJson(`${BASE}/products?per_page=100&page=${p}`);
  writeFileSync(`.data/live/products-${p}.json`, JSON.stringify(data));
  process.stdout.write(`\r  page ${p}/${pages}   `);
}
console.log();

// pad remaining product-*.json slots so build-catalog's fixed 1..19 loop is safe
for (let p = pages + 1; p <= 19; p++) writeFileSync(`.data/live/products-${p}.json`, "[]");

// categories
for (const p of [1, 2]) {
  const { data } = await getJson(`${BASE}/products/categories?per_page=100&page=${p}`);
  writeFileSync(`.data/live/cats-${p}.json`, JSON.stringify(data));
}
console.log("harvest complete.");
