// Reads the WCPA (Acowebs Custom Product Add-ons) personalisation form for a
// product. WCPA exposes no REST API for per-product fields, so we fetch the
// live product page and parse the rendered form into structured fields.
import "server-only";
import { parse } from "node-html-parser";
import { SITE } from "./wp";
import type { WcpaOption, WcpaFieldType, WcpaField } from "./wcpa-types";

export type { WcpaOption, WcpaFieldType, WcpaField } from "./wcpa-types";

/** Pull a "(₹ 99.00)" style price out of an option label. */
function priceFromLabel(label: string): { price: number; clean: string } {
  const m = label.match(/\(\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d+)?)\s*\)/i);
  if (!m) return { price: 0, clean: label.trim() };
  const price = Number(m[1].replace(/,/g, "")) || 0;
  const clean = label.replace(m[0], "").replace(/\s+/g, " ").trim();
  return { price, clean };
}

export async function getProductOptions(slug: string): Promise<WcpaField[]> {
  try {
    const res = await fetch(`${SITE}/product/${slug}/`, {
      next: { revalidate: 3600 },
      headers: { Accept: "text/html" },
    });
    if (!res.ok) return [];
    const root = parse(await res.text());
    const outer = root.querySelector(".wcpa_form_outer");
    if (!outer) return [];

    const fields: WcpaField[] = [];
    for (const item of outer.querySelectorAll(".wcpa_form_item")) {
      const cls = item.getAttribute("class") || "";
      const dataType = (item.getAttribute("data-type") || "").toLowerCase();
      const id = item.getAttribute("id") || `wcpa-${fields.length}`;

      let type: WcpaFieldType | null = null;
      if (dataType.includes("checkbox")) type = "checkbox-group";
      else if (dataType.includes("radio")) type = "radio-group";
      else if (dataType.includes("select")) type = "select";
      else if (dataType.includes("textarea")) type = "textarea";
      else if (dataType.includes("text")) type = "text";
      else if (/separator/.test(dataType) || /wcpa_type_separator/.test(cls))
        type = "separator";
      if (!type) continue;

      const help = item.querySelector(".wcpa_helptext")?.text?.trim() || undefined;

      // Group title = the <label> that targets the group (not an option input,
      // whose id ends like _1_0). Fall back to the first label.
      const labels = item.querySelectorAll("label");
      const groupLabel = labels.find((l) => {
        const f = l.getAttribute("for") || "";
        return f && !/_\d+_\d+$/.test(f);
      });
      const title = (groupLabel?.text || labels[0]?.text || "")
        .replace(/\s+/g, " ")
        .trim();

      if (type === "separator") {
        if (title) fields.push({ id, type, title, options: [] });
        continue;
      }

      const options: WcpaOption[] = [];
      if (type === "checkbox-group" || type === "radio-group") {
        for (const inp of item.querySelectorAll(
          'input[type="radio"], input[type="checkbox"]'
        )) {
          const inpId = inp.getAttribute("id");
          const lbl = inpId
            ? item.querySelector(`label[for="${inpId}"]`)
            : null;
          const raw = (lbl?.text || inp.getAttribute("value") || "")
            .replace(/\s+/g, " ")
            .trim();
          const { price, clean } = priceFromLabel(raw);
          options.push({
            label: clean || "Option",
            price,
            value: inp.getAttribute("value") || clean,
          });
        }
      } else if (type === "select") {
        for (const o of item.querySelectorAll("option")) {
          const v = o.getAttribute("value");
          if (!v) continue;
          const { price, clean } = priceFromLabel(o.text);
          options.push({ label: clean, price, value: v });
        }
      }

      // Skip groups that ended up empty (other than text inputs).
      if (
        (type === "checkbox-group" ||
          type === "radio-group" ||
          type === "select") &&
        options.length === 0
      )
        continue;

      fields.push({ id, type, title: title || "Option", helptext: help, options });
    }
    return fields;
  } catch {
    return [];
  }
}
