import {
  mysqlTable,
  varchar,
  text,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

export const services = mysqlTable(
  "services",
  {
    id: id(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    tagline: varchar("tagline", { length: 240 }),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    icon: varchar("icon", { length: 80 }),
    accentColor: varchar("accent_color", { length: 30 }),
    deliverables: json("deliverables"),
    audience: varchar("audience", { length: 200 }),
    priceFrom: varchar("price_from", { length: 80 }),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("services_slug_uq").on(t.slug),
    index("services_published_idx").on(t.published),
  ],
);
