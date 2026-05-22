import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

/**
 * Drizzle Kit configuration for TiDB (MySQL-compatible).
 *
 * Connection is assembled from TIDB_* vars so SSL can be left implicit
 * for the kit (TLS is negotiated by mysql2 at runtime; drizzle-kit only
 * uses this URL for introspection/migrations and tolerates the bare DSN).
 */
function buildUrl(): string {
  const direct = process.env.TIDB_CONNECTION_STRING;
  if (direct && direct.startsWith("mysql://")) return direct;

  const user = process.env.TIDB_USER ?? process.env.MYSQL_USER;
  const pass = process.env.TIDB_PASSWORD ?? process.env.MYSQL_PASSWORD;
  const host = process.env.TIDB_HOST ?? process.env.MYSQL_HOST;
  const port = process.env.TIDB_PORT ?? process.env.MYSQL_PORT ?? "4000";
  const db = process.env.TIDB_DB ?? process.env.MYSQL_DB;
  if (!user || !pass || !host || !db) {
    throw new Error(
      "TiDB credentials missing. Set TIDB_USER, TIDB_PASSWORD, TIDB_HOST, TIDB_DB (or TIDB_CONNECTION_STRING) in .env.local.",
    );
  }
  const encPass = encodeURIComponent(pass);
  return `mysql://${user}:${encPass}@${host}:${port}/${db}`;
}

export default {
  schema: "./src/lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: buildUrl(),
  },
  verbose: true,
  strict: true,
} satisfies Config;
