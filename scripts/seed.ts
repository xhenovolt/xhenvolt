/**
 * Database seed — REMOVED in the TiDB migration.
 *
 * The original Postgres seed (1097 lines) used `ON CONFLICT ... DO
 * UPDATE` and `RETURNING id`, neither of which exists in MySQL/TiDB.
 * Per the migration decision ("start clean on TiDB"), the seed is not
 * being ported. Content is authored through the admin UI at /admin.
 *
 * If you need to re-introduce a programmatic seed for TiDB later, the
 * MySQL equivalent uses `INSERT ... ON DUPLICATE KEY UPDATE` and a
 * follow-up `SELECT LAST_INSERT_ID()` instead of `RETURNING`.
 */
console.warn(
  "[seed] Seeding is disabled after the TiDB migration. Author content via /admin instead.",
);
console.warn(
  "[seed] To bootstrap the first admin user: npm run db:create-admin -- <email> <password>",
);
process.exit(0);
