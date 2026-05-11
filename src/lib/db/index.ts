import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __xhenvoltDb: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

const connectionString = process.env.DATABASE_URL;

function createDb() {
  if (!connectionString) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[db] DATABASE_URL is not set. Repositories will return safe fallbacks.",
      );
    }
    return undefined;
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

const db = globalThis.__xhenvoltDb ?? createDb();

if (process.env.NODE_ENV !== "production" && db) {
  globalThis.__xhenvoltDb = db;
}

export { db, schema };
export type Database = NonNullable<typeof db>;
export const hasDb = (): boolean => Boolean(db);
