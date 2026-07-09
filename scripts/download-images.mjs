// Download every catalog image into data/media/, preserving the URL path
// (/wp-content/uploads/...) so nginx can serve them locally once WordPress is
// gone. Reads data/catalog-images.json. Resumable: skips files already on disk.
//   node scripts/download-images.mjs
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const MEDIA = path.join(process.cwd(), "data", "media");
const list = JSON.parse(readFileSync("data/catalog-images.json", "utf8"));
const CONCURRENCY = Number(process.env.CC) || 6;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let done = 0, ok = 0, skip = 0, fail = 0, cursor = 0;

function destFor(url) {
  let p;
  try { p = new URL(url).pathname; } catch { return null; }
  return path.join(MEDIA, p.replace(/^\/+/, ""));
}

async function grab(url) {
  const dest = destFor(url);
  if (!dest) { fail++; return; }
  if (existsSync(dest)) { skip++; return; }
  for (let a = 0; a < 5; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "img-migrate" } });
      if (res.status === 429 || res.status >= 500) throw new Error("rate");
      if (!res.ok) { fail++; return; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) throw new Error("tiny");
      mkdirSync(path.dirname(dest), { recursive: true });
      writeFileSync(dest, buf);
      ok++;
      return;
    } catch {
      await sleep(800 * (a + 1));
    }
  }
  fail++;
}

async function worker() {
  while (cursor < list.length) {
    await grab(list[cursor++]);
    done++;
    if (done % 100 === 0) console.log(`  ${done}/${list.length}  ok=${ok} skip=${skip} fail=${fail}`);
  }
}

console.log(`Downloading ${list.length} images into data/media/ …`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`\nDONE. downloaded=${ok} skipped=${skip} failed=${fail}`);
const missing = list.filter((u) => { const d = destFor(u); return d && !existsSync(d); });
writeFileSync("data/images-missing.json", JSON.stringify(missing, null, 0));
console.log(`missing: ${missing.length}`);
