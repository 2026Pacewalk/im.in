"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = ["Wedding", "Engagement", "Birthday", "Anniversary", "Housewarming", "Baby Shower", "Puja / Ceremony", "Party", "Other"];
const FIELD =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-400";

export default function CreateEventForm() {
  const router = useRouter();
  const [f, setF] = useState({
    title: "",
    hostName: "",
    eventType: "Wedding",
    date: "",
    time: "",
    venue: "",
    message: "",
    whatsapp: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Could not create event");
      router.push(`/rsvp/${d.id}/guests?created=1`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:grid-cols-2">
      <label className="sm:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Event title *</span>
        <input required value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Aarav weds Diya" className={FIELD} />
      </label>
      <label>
        <span className="mb-1 block text-sm font-medium text-gray-700">Host name *</span>
        <input required value={f.hostName} onChange={(e) => set("hostName", e.target.value)} placeholder="e.g. The Sharma Family" className={FIELD} />
      </label>
      <label>
        <span className="mb-1 block text-sm font-medium text-gray-700">Event type</span>
        <select value={f.eventType} onChange={(e) => set("eventType", e.target.value)} className={FIELD}>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label>
        <span className="mb-1 block text-sm font-medium text-gray-700">Date</span>
        <input value={f.date} onChange={(e) => set("date", e.target.value)} placeholder="Sunday, 14 Dec 2026" className={FIELD} />
      </label>
      <label>
        <span className="mb-1 block text-sm font-medium text-gray-700">Time</span>
        <input value={f.time} onChange={(e) => set("time", e.target.value)} placeholder="7:00 PM onwards" className={FIELD} />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Venue</span>
        <input value={f.venue} onChange={(e) => set("venue", e.target.value)} placeholder="The Grand Ballroom, Jaipur" className={FIELD} />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Message to guests <span className="text-gray-400">(optional)</span></span>
        <textarea value={f.message} onChange={(e) => set("message", e.target.value)} rows={2} placeholder="We'd love for you to join us…" className={FIELD} />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Your WhatsApp <span className="text-gray-400">(for guest replies & reminders)</span></span>
        <input value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+91 73073 44844" className={FIELD} />
      </label>

      {err && <p className="text-sm text-rose-600 sm:col-span-2">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:col-span-2"
      >
        {busy ? "Creating…" : "Create RSVP page →"}
      </button>
    </form>
  );
}
