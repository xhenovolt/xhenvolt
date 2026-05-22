/**
 * Centralized TiDB / MySQL connection configuration.
 *
 * Reads TIDB_* (preferred) or MYSQL_* env vars and assembles a
 * mysql2-shaped PoolOptions object. Kept separate from the Drizzle
 * client so scripts (migrate, create-admin) and the runtime probe can
 * share the exact same connection setup.
 *
 * TLS notes for TiDB Serverless:
 * - host is gateway01.<region>.prod.aws.tidbcloud.com
 * - port 4000
 * - SSL is REQUIRED. We pass `ssl: { minVersion: "TLSv1.2" }` which
 *   makes mysql2 use the Node default CA bundle and verify the cert.
 * - DATABASE_MODE=tidb forces SSL on; any other value falls back to
 *   non-SSL (useful for a local MySQL container).
 */

import type { PoolOptions } from "mysql2";

export interface TidbConnConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
}

export type ConfigResult =
  | { ok: true; config: TidbConnConfig }
  | { ok: false; reason: "missing_credentials"; missing: string[] };

function pick(...names: string[]): string | undefined {
  for (const n of names) {
    const v = process.env[n];
    if (v && v.trim() !== "") return v.trim();
  }
  return undefined;
}

export function readTidbConfig(): ConfigResult {
  const host = pick("TIDB_HOST", "DB_HOST", "MYSQL_HOST");
  const portRaw = pick("TIDB_PORT", "DB_PORT", "MYSQL_PORT") ?? "4000";
  const user = pick("TIDB_USER", "DB_USER", "MYSQL_USER");
  const password = pick("TIDB_PASSWORD", "DB_PASS", "MYSQL_PASSWORD");
  const database = pick("TIDB_DB", "DB_NAME", "MYSQL_DB");

  const missing: string[] = [];
  if (!host) missing.push("TIDB_HOST");
  if (!user) missing.push("TIDB_USER");
  if (!password) missing.push("TIDB_PASSWORD");
  if (!database) missing.push("TIDB_DB");
  if (missing.length > 0) {
    return { ok: false, reason: "missing_credentials", missing };
  }

  const port = Number.parseInt(portRaw, 10);
  const mode = (process.env.DATABASE_MODE ?? "tidb").toLowerCase();
  const ssl = mode === "tidb";

  return {
    ok: true,
    config: {
      host: host!,
      port: Number.isFinite(port) ? port : 4000,
      user: user!,
      password: password!,
      database: database!,
      ssl,
    },
  };
}

export function toPoolOptions(c: TidbConnConfig): PoolOptions {
  return {
    host: c.host,
    port: c.port,
    user: c.user,
    password: c.password,
    database: c.database,
    ssl: c.ssl ? { minVersion: "TLSv1.2" } : undefined,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 8000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10_000,
    dateStrings: false,
    decimalNumbers: true,
    // TiDB requires sql_mode tolerant of NULL defaults on timestamp.
    multipleStatements: false,
  };
}
