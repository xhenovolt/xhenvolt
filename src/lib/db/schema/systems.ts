import {
  mysqlTable,
  varchar,
  text,
  json,
  index,
  uniqueIndex,
  int,
} from "drizzle-orm/mysql-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

export const systems = mysqlTable(
  "systems",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    tagline: varchar("tagline", { length: 240 }),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    category: varchar("category", { length: 80 }),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    externalUrl: varchar("external_url", { length: 500 }),
    logoUrl: varchar("logo_url", { length: 500 }),
    accentColor: varchar("accent_color", { length: 30 }),
    icon: varchar("icon", { length: 80 }),
    deployments: int("deployments").default(0),
    highlights: json("highlights"),
    techStack: json("tech_stack"),
    sortOrder: sortOrder(),
    published: published(),
    isFlagship: json("is_flagship"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("systems_slug_uq").on(t.slug),
    index("systems_category_idx").on(t.category),
  ],
);

export const systemFeatures = mysqlTable(
  "system_features",
  {
    id: id(),
    systemId: varchar("system_id", { length: 36 })
      .references(() => systems.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 80 }),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("system_features_system_idx").on(t.systemId)],
);

export const systemScreenshots = mysqlTable(
  "system_screenshots",
  {
    id: id(),
    systemId: varchar("system_id", { length: 36 })
      .references(() => systems.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }),
    caption: text("caption"),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    alt: varchar("alt", { length: 500 }).notNull().default(""),
    width: int("width"),
    height: int("height"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("system_screenshots_system_idx").on(t.systemId)],
);
