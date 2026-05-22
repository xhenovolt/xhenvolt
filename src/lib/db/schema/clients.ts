import {
  mysqlTable,
  varchar,
  text,
  index,
  uniqueIndex,
  boolean,
} from "drizzle-orm/mysql-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

export const clients = mysqlTable(
  "clients",
  {
    id: id(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    kind: varchar("kind", { length: 60 }).notNull().default("school"),
    location: varchar("location", { length: 160 }),
    logoUrl: varchar("logo_url", { length: 500 }),
    website: varchar("website", { length: 500 }),
    description: text("description"),
    featured: boolean("featured").notNull().default(false),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("clients_slug_uq").on(t.slug),
    index("clients_kind_idx").on(t.kind),
  ],
);

export const partners = mysqlTable(
  "partners",
  {
    id: id(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    logoUrl: varchar("logo_url", { length: 500 }),
    website: varchar("website", { length: 500 }),
    description: text("description"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("partners_slug_uq").on(t.slug)],
);
