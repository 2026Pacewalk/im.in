"use client";

import { useState } from "react";

const FIELD =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-400";

export default function RsvpForm({ eventId }: { eventId: string }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"yes" | "no" | "maybe">("yes");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status, guests, message }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Could not submit");
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-3xl">🎉</p>
        <h3 className="font-display mt-2 text-xl font-bold text-ink">Thank you!</h3>
        <p className="mt-1 text-sm text-gray-600">
          Your response has been recorded. We can&apos;t wait to celebrate with you!
        </p>
      </div>
    );
  }

  const OPTS: { id: typeof status; label: string; cls: string }[] = [
    { id: "yes", label: "✓ Yes, I'll be there", cls: "border-green-500 bg-green-500 text-white" },
    { id: "maybe", label: "Maybe", cls: "border-amber-500 bg-amber-500 text-white" },
    { id: "no", label: "Can't make it", cls: "border-gray-400 bg-gray-500 text-white" },
  ];

  return (
    <form onSubmit={submit} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <h3 className="font-display text-xl font-bold text-ink">Will you join us?</h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {OPTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setStatus(o.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              status === o.id ? o.cls : "border-gray-200 text-gray-700 hover:border-brand-400"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="mb-1 block text-sm font-medium text-gray-700">Your name *</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={FIELD} />
        </label>
        {status !== "no" && (
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-700">Number of guests</span>
            <input type="number" min={1} max={50} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={FIELD} />
          </label>
        )}
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">Message <span className="text-gray-400">(optional)</span></span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} placeholder="Send your wishes…" className={FIELD} />
        </label>
      </div>

      {err && <p className="mt-2 text-sm text-rose-600">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send my RSVP"}
      </button>
    </form>
  );
}
