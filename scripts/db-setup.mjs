// Create the database schema (customers table, indexes).
// Usage: node --env-file=.env.local scripts/db-setup.mjs
import { readFileSync } from "node:fs";

if (!process.env.DATABASE_URL) {
  console.error("\n❌ DATABASE_URL not set. Add it to .env.local, then run:");
  console.error("   node --env-file=.env.local scripts/db-setup.mjs\n");
  process.exit(1);
}

const sql = readFileSync("db/schema.sql", "utf8");
const { default: pg } = await import("pg");
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost") ? undefined : { rejectUnauthorized: false },
});

try {
  await pool.query(sql);
  const { rows } = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`
  );
  console.log("\n✅ Schema applied. Tables:", rows.map((r) => r.table_name).join(", ") || "(none)");
  console.log();
} catch (e) {
  console.error("❌ Schema error:", e.message);
  process.exit(1);
} finally {
  await pool.end();
}
