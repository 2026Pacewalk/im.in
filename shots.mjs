import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "F:/Website Made By Shekhar/Invitemart.in/invitemart-next/shots";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";

const browser = await chromium.launch();

async function shot(name, path, width, full = true, action) {
  const ctx = await browser.newContext({
    viewport: { width, height: width < 500 ? 800 : 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);
  if (action) await action(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  console.log("shot:", name);
  await ctx.close();
}

await shot("home-desktop", "/", 1280);
await shot("home-mobile", "/", 390);
await shot("shop-desktop", "/shop", 1280);
await shot("product-desktop", "/product/traditional-mata-ki-chowki-invitation-video", 1280);
await shot("product-mobile", "/product/traditional-mata-ki-chowki-invitation-video", 390, false);
await shot("category-desktop", "/product-category/digital-wedding-invitation", 1280);
// product + open cart drawer
await shot(
  "drawer-desktop",
  "/product/traditional-mata-ki-chowki-invitation-video",
  1280,
  false,
  async (page) => {
    const btn = page.locator('button:has-text("Add to Cart")').first();
    await btn.click();
    await page.waitForTimeout(2500);
  }
);

await browser.close();
console.log("done");
