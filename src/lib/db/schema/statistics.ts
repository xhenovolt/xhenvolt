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

export const statistics = mysqlTable(
  "statistics",
  {
    id: id(),
    key: varchar("key", { length: 80 }).notNull().unique(),
    label: varchar("label", { length: 200 }).notNull(),
    value: varchar("value", { length: 80 }).notNull(),
    suffix: varchar("suffix", { length: 20 }),
    description: text("description"),
    icon: varchar("icon", { length: 80 }),
    scope: varchar("scope", { length: 60 }).default("global"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("statistics_key_uq").on(t.key),
    index("statistics_scope_idx").on(t.scope),
  ],
);
