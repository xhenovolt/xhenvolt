import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { boolean, int, timestamp, varchar } from "drizzle-orm/mysql-core";

// TiDB rejects DEFAULT (now()) — the SQL-standard expression-default form
// Drizzle emits for .defaultNow(). It accepts only the bare function form
// CURRENT_TIMESTAMP(3), so timestamps below pass it explicitly via sql``.
const NOW3 = sql`CURRENT_TIMESTAMP(3)`;

/**
 * Shared column helpers — MySQL/TiDB flavor.
 *
 * IDs are application-generated UUIDv4 strings stored as varchar(36).
 * TiDB has a UUID() function but client-side generation is portable and
 * means insert paths don't depend on a server-side default existing.
 *
 * Timestamps use fsp=3 (millisecond precision) which is what mysql2
 * round-trips cleanly. TiDB returns DATETIME values as JS Date objects.
 */
export const id = () =>
  varchar("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID());

export const createdAt = () =>
  timestamp("created_at", { fsp: 3 }).notNull().default(NOW3);

export const updatedAt = () =>
  timestamp("updated_at", { fsp: 3 })
    .notNull()
    .default(NOW3)
    .$onUpdate(() => new Date());

export const deletedAt = () => timestamp("deleted_at", { fsp: 3 });

export const published = () => boolean("published").notNull().default(true);

export const sortOrder = () => int("sort_order").notNull().default(0);

export const slug = () => varchar("slug", { length: 200 }).notNull().unique();

export const STATUS = ["draft", "review", "published", "archived"] as const;
export type Status = (typeof STATUS)[number];
