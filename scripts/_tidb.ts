/**
 * Shared TiDB client used by all scripts. mysql2/promise pool, SSL on
 * when DATABASE_MODE=tidb. Mirrors src/lib/db/config so scripts and the
 * runtime can't drift.
 */
import "dotenv/config";
import { config } from "dotenv";
import mysql, { type Pool } from "mysql2/promise";

config({ path: ".env.local" });

function readConfig() {
  const pick = (...names: string[]) => {
    for (const n of names) {
      const v = process.env[n];
      if (v && v.trim() !== "") return v.trim();
    }
    return undefined;
  };

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
    throw new Error(`TiDB credentials missing: ${missing.join(", ")}`);
  }

  const port = Number.parseInt(portRaw, 10);
  const mode = (process.env.DATABASE_MODE ?? "tidb").toLowerCase();

  return {
    host: host!,
    port: Number.isFinite(port) ? port : 4000,
    user: user!,
    password: password!,
    database: database!,
    ssl: mode === "tidb" ? { minVersion: "TLSv1.2" as const } : undefined,
  };
}

let cached: Pool | undefined;

export function getPool(): Pool {
  if (!cached) {
    cached = mysql.createPool({
      ...readConfig(),
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0,
      connectTimeout: 10_000,
      multipleStatements: true,
    });
  }
  return cached;
}

export async function endPool(): Promise<void> {
  if (cached) {
    await cached.end();
    cached = undefined;
  }
}
