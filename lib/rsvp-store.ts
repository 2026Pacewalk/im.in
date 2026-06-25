// RSVP data store. Local JSON-file persistence for development — the public
// API (createEvent/getEvent/addRsvp) is the single swap-in point for a hosted
// database (Postgres/SQLite/etc.) in production. No callers change.
import "server-only";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "rsvp.json");

export type RsvpStatus = "yes" | "no" | "maybe";

export interface RsvpEntry {
  name: string;
  status: RsvpStatus;
  guests: number;
  message?: string;
  at: number;
}

export interface EventRec {
  id: string;
  title: string;
  hostName: string;
  eventType: string;
  date?: string;
  time?: string;
  venue?: string;
  message?: string;
  whatsapp?: string;
  createdAt: number;
  rsvps: RsvpEntry[];
}

type DB = Record<string, EventRec>;

async function read(): Promise<DB> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as DB;
  } catch {
    return {};
  }
}

async function write(db: DB): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf8");
}

function genId(): string {
  return (
    Math.random().toString(36).slice(2, 8) +
    Math.random().toString(36).slice(2, 8)
  );
}

export async function createEvent(
  data: Omit<EventRec, "id" | "createdAt" | "rsvps">
): Promise<EventRec> {
  const db = await read();
  const rec: EventRec = { ...data, id: genId(), createdAt: Date.now(), rsvps: [] };
  db[rec.id] = rec;
  await write(db);
  return rec;
}

export async function getEvent(id: string): Promise<EventRec | null> {
  const db = await read();
  return db[id] ?? null;
}

export async function addRsvp(
  id: string,
  entry: Omit<RsvpEntry, "at">
): Promise<EventRec | null> {
  const db = await read();
  const ev = db[id];
  if (!ev) return null;
  ev.rsvps.push({ ...entry, at: Date.now() });
  await write(db);
  return ev;
}

export function rsvpCounts(ev: EventRec) {
  const yes = ev.rsvps.filter((r) => r.status === "yes");
  const no = ev.rsvps.filter((r) => r.status === "no");
  const maybe = ev.rsvps.filter((r) => r.status === "maybe");
  const headcount = yes.reduce((n, r) => n + (r.guests || 1), 0);
  return { yes: yes.length, no: no.length, maybe: maybe.length, headcount };
}
