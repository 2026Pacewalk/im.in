// Server-side proxy for the WooCommerce Store API cart.
// We talk to invitemart.in from the Next server (no browser CORS), and persist
// the Store API Cart-Token in an httpOnly cookie so the visitor keeps one cart.
import "server-only";
import { cookies } from "next/headers";
import { SITE } from "./wp";
import type { Cart } from "./cart-types";

const STORE = `${SITE}/wp-json/wc/store/v1`;
export const CART_COOKIE = "im_cart_token";
const NONCE_COOKIE = "im_cart_nonce";

interface StoreResult {
  data: unknown;
  token: string | null;
  nonce: string | null;
  status: number;
}

async function call(
  path: string,
  init: { method?: string; body?: unknown; token?: string | null; nonce?: string | null } = {}
): Promise<StoreResult> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (init.body) headers["Content-Type"] = "application/json";
  if (init.token) headers["Cart-Token"] = init.token;
  if (init.nonce) headers["Nonce"] = init.nonce;

  const res = await fetch(`${STORE}${path}`, {
    method: init.method || "GET",
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }
  return {
    data,
    token: res.headers.get("Cart-Token"),
    nonce: res.headers.get("Nonce"),
    status: res.status,
  };
}

/** Read the cart token from the cookie (if any). */
async function readToken(): Promise<string | null> {
  return (await cookies()).get(CART_COOKIE)?.value ?? null;
}
async function readNonce(): Promise<string | null> {
  return (await cookies()).get(NONCE_COOKIE)?.value ?? null;
}

async function save(token: string | null, nonce: string | null) {
  const jar = await cookies();
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
  if (token) jar.set(CART_COOKIE, token, opts);
  if (nonce) jar.set(NONCE_COOKIE, nonce, opts);
}

/** GET the current cart and refresh token + nonce. */
export async function fetchCart(): Promise<{
  cart: Cart;
  token: string | null;
  nonce: string | null;
}> {
  const token = await readToken();
  const res = await call("/cart", { token });
  await save(res.token, res.nonce);
  return {
    cart: res.data as Cart,
    token: res.token || token,
    nonce: res.nonce,
  };
}

/**
 * Run a cart mutation. Uses the cached token + nonce for a single round-trip;
 * if the nonce is missing or rejected, refreshes via a GET and retries once.
 */
async function mutate(path: string, body: unknown): Promise<Cart> {
  let token = await readToken();
  let nonce = await readNonce();

  // Refresh first only if we have no nonce yet.
  if (!nonce) {
    const pre = await call("/cart", { token });
    token = pre.token || token;
    nonce = pre.nonce;
  }

  let res = await call(path, { method: "POST", body, token, nonce });

  // Nonce/token stale -> refresh and retry once.
  if (res.status === 401 || res.status === 403) {
    const pre = await call("/cart", { token });
    token = pre.token || token;
    nonce = pre.nonce;
    res = await call(path, { method: "POST", body, token, nonce });
  }

  await save(res.token || token, res.nonce || nonce);
  if (res.status >= 400) {
    const msg =
      (res.data as { message?: string })?.message || `Cart error ${res.status}`;
    throw new Error(msg);
  }
  return res.data as Cart;
}

export function addItem(id: number, quantity = 1) {
  return mutate("/cart/add-item", { id, quantity });
}
export function updateItem(key: string, quantity: number) {
  return mutate("/cart/update-item", { key, quantity });
}
export function removeItem(key: string) {
  return mutate("/cart/remove-item", { key });
}
