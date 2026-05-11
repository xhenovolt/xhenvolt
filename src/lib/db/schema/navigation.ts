import {
  pgTable,
  varchar,
  text,
  index,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import {
  id,
  createdAt,
  updatedAt,
  published,
  sortOrder,
} from "./_shared";

export const navigationLinks = pgTable(
  "navigation_links",
  {
    id: id(),
    label: varchar("label", { length: 120 }).notNull(),
    href: varchar("href", { length: 240 }).notNull(),
    target: varchar("target", { length: 20 }).default("_self"),
    icon: varchar("icon", { length: 80 }),
    parentId: uuid("parent_id"),
    location: varchar("location", { length: 40 }).notNull().default("primary"),
    description: text("description"),
    isExternal: boolean("is_external").notNull().default(false),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("nav_location_idx").on(t.location),
    index("nav_parent_idx").on(t.parentId),
  ],
);

export const footerLinks = pgTable(
  "footer_links",
  {
    id: id(),
    label: varchar("label", { length: 120 }).notNull(),
    href: varchar("href", { length: 240 }).notNull(),
    column: varchar("column", { length: 80 }).notNull().default("Company"),
    isExternal: boolean("is_external").notNull().default(false),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("footer_column_idx").on(t.column)],
);

export const socialLinks = pgTable(
  "social_links",
  {
    id: id(),
    platform: varchar("platform", { length: 60 }).notNull().unique(),
    label: varchar("label", { length: 120 }).notNull(),
    href: varchar("href", { length: 240 }).notNull(),
    icon: varchar("icon", { length: 80 }),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
);
