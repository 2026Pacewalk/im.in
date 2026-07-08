// Customer data store (Postgres). The public API here is the single swap-in
// point for the rest of the app — route handlers and the CSV importer call
// these functions, never raw SQL.
import "server-only";
import { query } from "./db";

export interface Customer {
  id: number;
  wooId: number | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
  ordersCount: number;
  totalSpent: number;
  wpRegistered: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  email: string;
  wooId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  ordersCount?: number;
  totalSpent?: number;
  wpRegistered?: string | null;
  source?: string;
}

/**
 * Insert or update a customer, keyed on email. Idempotent — safe to run the
 * import repeatedly. COALESCE keeps existing non-null values if a later row
 * omits a field.
 */
export async function upsertCustomer(c: CustomerInput): Promise<void> {
  await query(
    `INSERT INTO customers
       (email, woo_id, first_name, last_name, phone, company,
        address_1, address_2, city, state, postcode, country,
        orders_count, total_spent, wp_registered, source, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, now())
     ON CONFLICT (email) DO UPDATE SET
       woo_id        = COALESCE(EXCLUDED.woo_id, customers.woo_id),
       first_name    = COALESCE(EXCLUDED.first_name, customers.first_name),
       last_name     = COALESCE(EXCLUDED.last_name, customers.last_name),
       phone         = COALESCE(EXCLUDED.phone, customers.phone),
       company       = COALESCE(EXCLUDED.company, customers.company),
       address_1     = COALESCE(EXCLUDED.address_1, customers.address_1),
       address_2     = COALESCE(EXCLUDED.address_2, customers.address_2),
       city          = COALESCE(EXCLUDED.city, customers.city),
       state         = COALESCE(EXCLUDED.state, customers.state),
       postcode      = COALESCE(EXCLUDED.postcode, customers.postcode),
       country       = COALESCE(EXCLUDED.country, customers.country),
       orders_count  = GREATEST(EXCLUDED.orders_count, customers.orders_count),
       total_spent   = GREATEST(EXCLUDED.total_spent, customers.total_spent),
       wp_registered = COALESCE(EXCLUDED.wp_registered, customers.wp_registered),
       updated_at    = now()`,
    [
      c.email.toLowerCase().trim(),
      c.wooId ?? null,
      c.firstName ?? null,
      c.lastName ?? null,
      c.phone ?? null,
      c.company ?? null,
      c.address1 ?? null,
      c.address2 ?? null,
      c.city ?? null,
      c.state ?? null,
      c.postcode ?? null,
      c.country ?? null,
      c.ordersCount ?? 0,
      c.totalSpent ?? 0,
      c.wpRegistered ?? null,
      c.source ?? "woocommerce-import",
    ]
  );
}

export async function getCustomerByEmail(
  email: string
): Promise<Customer | null> {
  const { rows } = await query(
    `SELECT * FROM customers WHERE lower(email) = lower($1) LIMIT 1`,
    [email]
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function countCustomers(): Promise<number> {
  const { rows } = await query<{ count: string }>(
    `SELECT count(*)::text AS count FROM customers`
  );
  return Number(rows[0]?.count ?? 0);
}

export async function listCustomers(
  limit = 50,
  offset = 0
): Promise<Customer[]> {
  const { rows } = await query(
    `SELECT * FROM customers ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows.map(mapRow);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(r: any): Customer {
  return {
    id: Number(r.id),
    wooId: r.woo_id != null ? Number(r.woo_id) : null,
    email: r.email,
    firstName: r.first_name,
    lastName: r.last_name,
    phone: r.phone,
    company: r.company,
    address1: r.address_1,
    address2: r.address_2,
    city: r.city,
    state: r.state,
    postcode: r.postcode,
    country: r.country,
    ordersCount: Number(r.orders_count ?? 0),
    totalSpent: Number(r.total_spent ?? 0),
    wpRegistered: r.wp_registered ? new Date(r.wp_registered).toISOString() : null,
    source: r.source,
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}
