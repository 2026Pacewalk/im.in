// Order data store. Local JSON-file persistence for development — the public
// API (createOrder/getOrder/setOrderStatus/listOrders) is the single swap-in
// point for a hosted database (Postgres/SQLite/etc.) in production. No callers
// change when you migrate off WordPress and store orders here natively.
import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "node:crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "orders.json");

export type OrderStatus = "PENDING" | "PAID" | "FAILED";

export interface OrderItem {
  name: string;
  quantity: number;
  lineTotal: number; // minor units (paise)
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderRec {
  id: string; // our PhonePe merchantTransactionId
  amount: number; // minor units (paise)
  currency: string; // "INR"
  items: OrderItem[];
  customer: OrderCustomer;
  status: OrderStatus;
  phonepeTransactionId?: string; // PhonePe's own transaction id
  paymentCode?: string; // PhonePe response code (PAYMENT_SUCCESS, ...)
  createdAt: number;
  updatedAt: number;
}

type DB = Record<string, OrderRec>;

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

/**
 * PhonePe merchantTransactionId: alphanumeric (+ underscore), max 35 chars, and
 * must be unique per transaction. We keep it alphanumeric only, and short.
 */
function genOrderId(): string {
  const stamp = Date.now().toString(36);
  const rand = crypto.randomBytes(5).toString("hex");
  return `IM${stamp}${rand}`.slice(0, 35);
}

export async function createOrder(
  data: Pick<OrderRec, "amount" | "currency" | "items" | "customer">
): Promise<OrderRec> {
  const db = await read();
  const now = Date.now();
  let id = genOrderId();
  while (db[id]) id = genOrderId();
  const order: OrderRec = {
    id,
    amount: data.amount,
    currency: data.currency,
    items: data.items,
    customer: data.customer,
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
  };
  db[id] = order;
  await write(db);
  return order;
}

export async function getOrder(id: string): Promise<OrderRec | null> {
  const db = await read();
  return db[id] ?? null;
}

export async function setOrderStatus(
  id: string,
  status: OrderStatus,
  extra: { phonepeTransactionId?: string; paymentCode?: string } = {}
): Promise<OrderRec | null> {
  const db = await read();
  const order = db[id];
  if (!order) return null;
  order.status = status;
  order.updatedAt = Date.now();
  if (extra.phonepeTransactionId)
    order.phonepeTransactionId = extra.phonepeTransactionId;
  if (extra.paymentCode) order.paymentCode = extra.paymentCode;
  db[id] = order;
  await write(db);
  return order;
}

export async function listOrders(): Promise<OrderRec[]> {
  const db = await read();
  return Object.values(db).sort((a, b) => b.createdAt - a.createdAt);
}
