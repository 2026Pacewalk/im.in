// Import WooCommerce customers from a CSV export into the Postgres `customers`
// table. Tolerant of different export formats (native WC Analytics, SkyVerge
// Customer/Order CSV Export, plain user export) — it auto-detects columns.
//
// Usage:
//   node --env-file=.env.local scripts/import-customers.mjs [path-to.csv] [--dry-run]
//
//   --dry-run  : parse + map + report only. No DB needed, nothing written.
//                Use this first to confirm the column mapping looks right.
//
// Default CSV path: .data/customers-export.csv
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const csvPath = args.find((a) => !a.startsWith("--")) || ".data/customers-export.csv";

// --- normalize a header to a comparable key: lowercase, alphanumeric only ---
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// candidate header keys (normalized) for each field, in priority order
const MAP = {
  wooId: ["customerid", "userid", "id", "wpuserid"],
  email: ["email", "useremail", "billingemail", "emailaddress"],
  firstName: ["firstname", "billingfirstname", "shippingfirstname"],
  lastName: ["lastname", "billinglastname", "shippinglastname"],
  fullName: ["name", "customername", "fullname", "displayname"],
  phone: ["phone", "billingphone", "telephone", "mobile", "phonenumber"],
  company: ["company", "billingcompany"],
  address1: ["address1", "billingaddress1", "billingaddress", "streetaddress", "address"],
  address2: ["address2", "billingaddress2"],
  city: ["city", "billingcity"],
  state: ["state", "billingstate", "region", "province"],
  postcode: ["postcode", "billingpostcode", "postalcode", "zip", "zipcode", "pincode"],
  country: ["country", "billingcountry", "countryregion"],
  ordersCount: ["orderscount", "ordercount", "orders", "numberoforders"],
  totalSpent: ["totalspent", "totalspend", "moneyspent", "amountspent"],
  wpRegistered: ["dateregistered", "userregistered", "registered", "registereddate", "signupdate", "datecreated"],
};

function buildResolver(headers) {
  const index = {}; // normalizedHeader -> originalHeader
  for (const h of headers) index[norm(h)] = h;
  const resolved = {};
  const usedHeaders = {};
  for (const [field, candidates] of Object.entries(MAP)) {
    for (const c of candidates) {
      if (index[c] != null) {
        resolved[field] = index[c];
        usedHeaders[field] = index[c];
        break;
      }
    }
  }
  return { resolved, usedHeaders };
}

function num(v) {
  if (v == null || v === "") return 0;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function clean(v) {
  const s = v == null ? "" : String(v).trim();
  return s === "" ? null : s;
}

function mapRow(row, resolved) {
  const get = (field) => (resolved[field] ? row[resolved[field]] : undefined);
  let first = clean(get("firstName"));
  let last = clean(get("lastName"));
  const full = clean(get("fullName"));
  if (!first && !last && full) {
    const parts = full.split(/\s+/);
    first = parts.shift() || null;
    last = parts.length ? parts.join(" ") : null;
  }
  const email = clean(get("email"));
  return {
    email: email ? email.toLowerCase() : null,
    wooId: get("wooId") ? num(get("wooId")) || null : null,
    firstName: first,
    lastName: last,
    phone: clean(get("phone")),
    company: clean(get("company")),
    address1: clean(get("address1")),
    address2: clean(get("address2")),
    city: clean(get("city")),
    state: clean(get("state")),
    postcode: clean(get("postcode")),
    country: clean(get("country")),
    ordersCount: Math.round(num(get("ordersCount"))),
    totalSpent: num(get("totalSpent")),
    wpRegistered: clean(get("wpRegistered")),
  };
}

// ---------------------------------------------------------------------------
async function main() {
  let raw;
  try {
    raw = readFileSync(csvPath, "utf8");
  } catch {
    console.error(`\n❌ Could not read CSV at "${csvPath}".`);
    console.error(`   Export your customers from WooCommerce and save it there,`);
    console.error(`   or pass the path: node --env-file=.env.local scripts/import-customers.mjs path/to.csv --dry-run\n`);
    process.exit(1);
  }

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
  });

  if (!records.length) {
    console.error("❌ CSV has no data rows.");
    process.exit(1);
  }

  const headers = Object.keys(records[0]);
  const { resolved, usedHeaders } = buildResolver(headers);

  console.log(`\n📄 CSV: ${csvPath}`);
  console.log(`   Rows: ${records.length}`);
  console.log(`\n🔗 Detected column mapping:`);
  for (const field of Object.keys(MAP)) {
    const h = usedHeaders[field];
    console.log(`   ${field.padEnd(13)} <- ${h ? `"${h}"` : "(not found)"}`);
  }
  const unmappedHeaders = headers.filter((h) => !Object.values(usedHeaders).includes(h));
  if (unmappedHeaders.length) {
    console.log(`\n   ℹ️  Unmapped CSV columns (ignored): ${unmappedHeaders.join(", ")}`);
  }

  const mapped = records.map((r) => mapRow(r, resolved));
  const valid = mapped.filter((m) => m.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m.email));
  const skipped = mapped.length - valid.length;
  const uniqueEmails = new Set(valid.map((m) => m.email)).size;

  console.log(`\n📊 Summary:`);
  console.log(`   valid (has email): ${valid.length}`);
  console.log(`   unique emails    : ${uniqueEmails}`);
  console.log(`   skipped (no/bad email): ${skipped}`);
  // privacy-safe preview: mask emails
  const mask = (e) => e.replace(/^(.).*(@.*)$/, "$1***$2");
  console.log(`\n   sample (masked): ${valid.slice(0, 3).map((m) => `${m.firstName || "?"} <${mask(m.email)}>`).join(", ")}`);

  if (dryRun) {
    console.log(`\n✅ Dry run complete. No database changes made.`);
    console.log(`   Re-run without --dry-run (and with DATABASE_URL set) to import.\n`);
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error(`\n❌ DATABASE_URL not set. Add it to .env.local and run with --env-file=.env.local\n`);
    process.exit(1);
  }

  const { default: pg } = await import("pg");
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") ? undefined : { rejectUnauthorized: false },
  });

  const SQL = `
    INSERT INTO customers
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
      updated_at    = now()`;

  let ok = 0, fail = 0;
  const client = await pool.connect();
  try {
    for (const m of valid) {
      try {
        await client.query(SQL, [
          m.email, m.wooId, m.firstName, m.lastName, m.phone, m.company,
          m.address1, m.address2, m.city, m.state, m.postcode, m.country,
          m.ordersCount, m.totalSpent, m.wpRegistered || null, "woocommerce-import",
        ]);
        ok++;
        if (ok % 200 === 0) console.log(`   …${ok} imported`);
      } catch (e) {
        fail++;
        if (fail <= 5) console.warn(`   ⚠️  row failed (${mask(m.email)}): ${e.message}`);
      }
    }
  } finally {
    client.release();
    const { rows } = await pool.query(`SELECT count(*)::text AS c FROM customers`);
    await pool.end();
    console.log(`\n✅ Import done. upserted=${ok} failed=${fail}. Total customers in DB: ${rows[0].c}\n`);
  }
}

main().catch((e) => {
  console.error("Import error:", e.message);
  process.exit(1);
});
