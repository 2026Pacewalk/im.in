"use client";

import { useMemo, useRef, useState } from "react";
import { exportPng, exportPdf } from "@/lib/card-export";
import FestivalCard from "@/components/ai/FestivalCard";
import {
  FESTIVALS,
  DESIGNS,
  LANGS,
  generateGreeting,
  type DesignId,
  type Lang,
} from "@/lib/festival";

export default function FestivalMaker() {
  const [festivalId, setFestivalId] = useState(FESTIVALS[0].id);
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [design, setDesign] = useState<DesignId>("ornate");
  const [lang, setLang] = useState<Lang>("en");
  const [variant, setVariant] = useState(0.42);
  const [downloading, setDownloading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const festival = useMemo(
    () => FESTIVALS.find((f) => f.id === festivalId) || FESTIVALS[0],
    [festivalId]
  );
  const greeting = useMemo(
    () => generateGreeting(festival, { sender, recipient, note, lang }, variant),
    [festival, sender, recipient, note, lang, variant]
  );

  async function download(kind: "png" | "pdf") {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const name = `${festival.id}-wishes`;
      if (kind === "pdf") await exportPdf(cardRef.current, name);
      else await exportPng(cardRef.current, name);
    } catch {
      /* ignore */
    } finally {
      setDownloading(false);
    }
  }

  function whatsappHref(): string {
    const msg = `${greeting.headline}!\n\n${greeting.body}${
      greeting.sign ? `\n${greeting.sign}` : ""
    }\n\nMade free at invitemart.in`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Controls */}
        <div>
          {/* Festival picker */}
          <h3 className="font-display text-lg font-bold text-ink">
            1. Choose a festival
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {FESTIVALS.map((f) => {
              const on = f.id === festivalId;
              return (
                <button
                  key={f.id}
                  onClick={() => setFestivalId(f.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center text-xs transition ${
                    on
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-gray-200 text-gray-600 hover:border-brand-300"
                  }`}
                >
                  <span className="text-xl">{f.emoji}</span>
                  <span className="leading-tight">{f.name}</span>
                </button>
              );
            })}
          </div>

          {/* Details */}
          <div className="mt-8 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink">
              2. Add your details
            </h3>
            <div className="flex items-center gap-1 rounded-full border border-gray-200 p-1">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    lang === l.id
                      ? "bg-brand-600 text-white"
                      : "text-gray-600 hover:text-brand-600"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-gray-700">To (name)</span>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Sharma Family"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-gray-700">From (your name)</span>
              <input
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Priya"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
              />
            </label>
          </div>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-medium text-gray-700">
              Your own message <span className="text-gray-400">(optional — leave blank for AI wording)</span>
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Write your own greeting, or let us generate one…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
            />
          </label>

          {/* Design */}
          <h3 className="font-display mt-8 text-lg font-bold text-ink">
            3. Pick a design
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {DESIGNS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDesign(d.id)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  design === d.id
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-gray-200 text-gray-700 hover:border-brand-400"
                }`}
              >
                {d.name}
              </button>
            ))}
            <button
              onClick={() => setVariant(Math.random())}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-400"
            >
              ↻ New wording
            </button>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
            <div ref={cardRef}>
              <FestivalCard festival={festival} greeting={greeting} design={design} />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => download("png")}
                disabled={downloading}
                className="rounded-xl bg-brand-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {downloading ? "…" : "⬇ PNG"}
              </button>
              <button
                onClick={() => download("pdf")}
                disabled={downloading}
                className="rounded-xl border border-brand-300 bg-brand-50 px-4 py-3 text-center font-semibold text-brand-700 transition hover:bg-brand-100 disabled:opacity-60"
              >
                {downloading ? "…" : "⬇ PDF"}
              </button>
            </div>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:brightness-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
              </svg>
              Share on WhatsApp
            </a>
          </div>
          <p className="mt-3 text-center text-xs text-gray-400">
            100% free · No signup · No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
