import {
  mysqlTable,
  varchar,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import {
  id,
  createdAt,
  updatedAt,
  published,
  sortOrder,
} from "./_shared";

export const technologies = mysqlTable(
  "technologies",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    category: varchar("category", { length: 80 }),
    iconUrl: varchar("icon_url", { length: 500 }),
    description: text("description"),
    proficiency: varchar("proficiency", { length: 40 }),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("technologies_slug_uq").on(t.slug),
    index("technologies_category_idx").on(t.category),
  ],
);
