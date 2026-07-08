// Postgres connection pool. Reads DATABASE_URL from the environment (.env.local).
// Works with any standard Postgres host — Neon, Supabase, Vercel Postgres,
// Railway, self-hosted. For serverless deploys use the provider's POOLED
// connection string.
import "server-only";
import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (see .env.example)."
    );
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Most hosted Postgres providers require TLS. `sslmode=require` in the URL
      // handles it; this relaxes cert validation for providers with self-signed
      // chains (Neon/Supabase are fine either way).
      ssl: process.env.DATABASE_URL.includes("localhost")
        ? undefined
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<T = any>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const res = await getPool().query(text, params);
  return { rows: res.rows as T[], rowCount: res.rowCount ?? 0 };
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
