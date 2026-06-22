"use client";

import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/wcpa-types";

const BUSINESS_TYPES = [
  "Event planner / wedding planner",
  "Card / gift shop",
  "Freelance designer",
  "Social media seller",
  "Photographer / studio",
  "Other",
];

const FIELD =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-400";

export default function ResellerForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState(BUSINESS_TYPES[0]);
  const [note, setNote] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg =
      `*Reseller Application — InviteMart*\n` +
      `Name: ${name}\n` +
      `WhatsApp: ${phone}\n` +
      `City: ${city}\n` +
      `Business: ${type}\n` +
      (note ? `Note: ${note}\n` : "") +
      `\nI'd like to become an InviteMart reseller.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener"
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg sm:p-8"
    >
      <h3 className="font-display text-2xl font-bold text-ink">
        Apply to become a reseller
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Fill in your details — we&apos;ll set you up on WhatsApp within 24 hours.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">Full name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={FIELD} />
        </label>
        <label>
          <span className="mb-1 block text-sm font-medium text-gray-700">WhatsApp number</span>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" inputMode="tel" className={FIELD} />
        </label>
        <label>
          <span className="mb-1 block text-sm font-medium text-gray-700">City</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Jaipur" className={FIELD} />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">Business type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className={FIELD}>
            {BUSINESS_TYPES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Anything else? <span className="text-gray-400">(optional)</span>
          </span>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tell us about your business" className={FIELD} />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-semibold text-white transition hover:brightness-95"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.243z" />
        </svg>
        Apply on WhatsApp
      </button>
      <p className="mt-3 text-center text-xs text-gray-400">
        No joining fee · No inventory · Start selling today
      </p>
    </form>
  );
}
