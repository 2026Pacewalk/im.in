// Pulls page content (Privacy, Terms, Return policy, etc.) from the
// invitemart.com Shopify store so these pages stay in sync. Cached for a day.
import "server-only";
import { parse } from "node-html-parser";

export async function getComPage(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`https://invitemart.com/pages/${slug}`, {
      next: { revalidate: 86400 },
      headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;
    const root = parse(await res.text());
    root.querySelectorAll("script,style,noscript,iframe,form").forEach((e) => e.remove());
    const el =
      root.querySelector(".rte") ||
      root.querySelector(".shopify-policy__body") ||
      root.querySelector(".page-content");
    if (!el) return null;
    let html = el.innerHTML || "";
    html = html
      .replace(/\sstyle="[^"]*"/gi, "")
      .replace(/\sclass="[^"]*"/gi, "")
      .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim();
    return html.length > 40 ? html : null;
  } catch {
    return null;
  }
}
