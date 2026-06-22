"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { WHATSAPP_NUMBER, type WcpaField } from "@/lib/wcpa-types";

function inr(n: number) {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function ProductOptions({
  fields,
  basePrice,
  productId,
  productName,
  permalink,
}: {
  fields: WcpaField[];
  basePrice: number;
  productId: number;
  productName: string;
  permalink: string;
}) {
  const { add, busy } = useCart();
  // selection state: field.id -> value(s)
  const [radio, setRadio] = useState<Record<string, number>>({});
  const [checks, setChecks] = useState<Record<string, Set<number>>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});

  const optionsTotal = useMemo(() => {
    let sum = 0;
    for (const f of fields) {
      if (f.type === "radio-group" || f.type === "select") {
        const i = radio[f.id];
        if (i != null && f.options[i]) sum += f.options[i].price;
      } else if (f.type === "checkbox-group") {
        const set = checks[f.id];
        if (set) for (const i of set) sum += f.options[i]?.price || 0;
      }
    }
    return sum;
  }, [fields, radio, checks]);

  const total = basePrice + optionsTotal;

  // Conditional fields: a "Google Map Link" (text) field only applies once its
  // "Add Google Location on PDF Card" checkbox is ticked — otherwise it's hidden.
  function isFieldHidden(f: WcpaField): boolean {
    if (f.type !== "text" && f.type !== "textarea") return false;
    if (!/map\s*link|google\s*map/i.test(f.title)) return false;
    const gate = fields.find(
      (g) =>
        g.type === "checkbox-group" &&
        /google\s*location|location on (the )?pdf/i.test(g.title)
    );
    if (!gate) return false;
    const set = checks[gate.id];
    return !(set && set.size > 0); // hidden until the checkbox is selected
  }

  function selectedSummary(): string {
    const lines: string[] = [];
    for (const f of fields) {
      if (isFieldHidden(f)) continue;
      if (f.type === "radio-group" || f.type === "select") {
        const i = radio[f.id];
        if (i != null && f.options[i])
          lines.push(`${f.title}: ${f.options[i].label}`);
      } else if (f.type === "checkbox-group") {
        const set = checks[f.id];
        if (set && set.size)
          lines.push(
            `${f.title}: ${[...set].map((i) => f.options[i]?.label).join(", ")}`
          );
      } else if (f.type === "text" || f.type === "textarea") {
        if (texts[f.id]) lines.push(`${f.title}: ${texts[f.id]}`);
      }
    }
    return lines.join("\n");
  }

  function whatsappHref(): string {
    const msg =
      `Hi InviteMart! I'd like to order:\n*${productName}*\n` +
      (selectedSummary() ? selectedSummary() + "\n" : "") +
      `Total: ${inr(total)}\n${permalink}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="mt-6 space-y-3">
      {fields.map((f) => {
        if (isFieldHidden(f)) return null;
        if (f.type === "separator") {
          return null;
        }
        return (
          <div
            key={f.id}
            className="rounded-xl border border-black/5 bg-white p-3.5 shadow-sm"
          >
            <label className="block text-sm font-semibold text-ink">
              {f.title}
            </label>
            {f.helptext && (
              <p className="mt-0.5 text-xs text-gray-500">{f.helptext}</p>
            )}

            {f.type === "radio-group" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {f.options.map((o, i) => {
                  const on = radio[f.id] === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRadio((s) => ({ ...s, [f.id]: i }))}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                        on
                          ? "border-brand-600 bg-brand-600 text-white shadow"
                          : "border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-600"
                      }`}
                    >
                      {o.label}
                      {o.price > 0 && (
                        <span className={on ? "text-white/90" : "text-gray-400"}>
                          {" "}
                          (+{inr(o.price)})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {f.type === "checkbox-group" && (
              <div className="mt-3 space-y-2">
                {f.options.map((o, i) => {
                  const set = checks[f.id];
                  const on = set?.has(i) ?? false;
                  return (
                    <label
                      key={i}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-sm hover:border-brand-400"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() =>
                            setChecks((s) => {
                              const next = new Set(s[f.id] ?? []);
                              if (next.has(i)) next.delete(i);
                              else next.add(i);
                              return { ...s, [f.id]: next };
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-brand-600"
                        />
                        {o.label}
                      </span>
                      {o.price > 0 && (
                        <span className="text-gray-500">+{inr(o.price)}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {f.type === "select" && (
              <select
                value={radio[f.id] ?? ""}
                onChange={(e) =>
                  setRadio((s) => ({ ...s, [f.id]: Number(e.target.value) }))
                }
                className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
              >
                <option value="">Select…</option>
                {f.options.map((o, i) => (
                  <option key={i} value={i}>
                    {o.label}
                    {o.price > 0 ? ` (+${inr(o.price)})` : ""}
                  </option>
                ))}
              </select>
            )}

            {(f.type === "text" || f.type === "textarea") && (
              <input
                value={texts[f.id] ?? ""}
                onChange={(e) =>
                  setTexts((s) => ({ ...s, [f.id]: e.target.value }))
                }
                placeholder={f.title}
                className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
              />
            )}
          </div>
        );
      })}

      {/* Price summary */}
      <div className="overflow-hidden rounded-2xl border border-black/5">
        <Row label="Options price" value={inr(optionsTotal)} />
        <Row label="Product price" value={inr(basePrice)} />
        <Row label="Total" value={inr(total)} strong />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => add(productId, 1)}
          disabled={busy}
          className="flex-1 rounded-xl bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add to Cart"}
        </button>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-semibold text-white transition hover:brightness-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.243z" />
          </svg>
          Order on WhatsApp
        </a>
      </div>
      <a
        href={permalink}
        className="block text-center text-sm text-gray-500 hover:text-brand-600"
      >
        Buy now with secure online payment →
      </a>
      <p className="text-center text-xs text-gray-400">
        Your personalisation details &amp; photos are finalised with our team on
        WhatsApp after ordering.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        strong ? "bg-cream text-lg font-bold text-ink" : "border-b border-gray-100 text-sm text-gray-600"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
