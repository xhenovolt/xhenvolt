import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { readTidbConfig, toPoolOptions } from "./config";

/**
 * Singleton Drizzle client backed by a mysql2 connection pool against
 * TiDB Serverless. Cached on globalThis in dev to survive HMR.
 *
 * If credentials are missing, returns undefined and hasDb() reports
 * false — repositories must use that to fall back instead of throwing.
 * This is intentional: a misconfigured runtime should render *something*
 * (so the admin can reach /admin/system-health to diagnose), not crash.
 */

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  // eslint-disable-next-line no-var
  var __xhenvoltDb: DrizzleDb | undefined;
  // eslint-disable-next-line no-var
  var __xhenvoltDbPool: mysql.Pool | undefined;
}

function createDb(): DrizzleDb | undefined {
  const cfg = readTidbConfig();
  if (!cfg.ok) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[db] TiDB credentials missing (${cfg.missing.join(", ")}). Repositories will use fallbacks.`,
      );
    }
    return undefined;
  }
  const pool = mysql.createPool(toPoolOptions(cfg.config));
  if (process.env.NODE_ENV !== "production") {
    globalThis.__xhenvoltDbPool = pool;
  }
  return drizzle(pool, { schema, mode: "default" });
}

const db = globalThis.__xhenvoltDb ?? createDb();

if (process.env.NODE_ENV !== "production" && db) {
  globalThis.__xhenvoltDb = db;
}

export { db, schema };
export type Database = NonNullable<typeof db>;
export const hasDb = (): boolean => Boolean(db);
