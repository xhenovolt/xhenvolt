import { sql } from "drizzle-orm";
import { timestamp, uuid, varchar, boolean, integer } from "drizzle-orm/pg-core";

export const id = () =>
  uuid("id").primaryKey().default(sql`gen_random_uuid()`);

export const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

export const deletedAt = () =>
  timestamp("deleted_at", { withTimezone: true });

export const published = () =>
  boolean("published").notNull().default(true);

export const sortOrder = () =>
  integer("sort_order").notNull().default(0);

export const slug = () => varchar("slug", { length: 200 }).notNull().unique();

export const STATUS = ["draft", "review", "published", "archived"] as const;
export type Status = (typeof STATUS)[number];
