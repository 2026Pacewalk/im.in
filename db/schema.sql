-- InviteMart — customer + order schema (Postgres).
-- Run once against your database (see scripts/db-setup.mjs, or paste into the
-- Neon/Supabase SQL editor). Safe to re-run: uses IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS customers (
  id             BIGSERIAL PRIMARY KEY,
  woo_id         BIGINT UNIQUE,                 -- original WooCommerce customer id (if any)
  email          TEXT NOT NULL UNIQUE,          -- dedupe key
  first_name     TEXT,
  last_name      TEXT,
  phone          TEXT,
  company        TEXT,
  address_1      TEXT,
  address_2      TEXT,
  city           TEXT,
  state          TEXT,
  postcode       TEXT,
  country        TEXT,
  orders_count   INTEGER DEFAULT 0,
  total_spent    NUMERIC(12,2) DEFAULT 0,       -- rupees
  wp_registered  TIMESTAMPTZ,                   -- original signup date
  source         TEXT DEFAULT 'woocommerce-import',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customers_email_idx ON customers (lower(email));
CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers (phone);
