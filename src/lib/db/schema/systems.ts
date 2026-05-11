import {
  pgTable,
  varchar,
  text,
  jsonb,
  index,
  uniqueIndex,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

export const systems = pgTable(
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
    externalUrl: text("external_url"),
    logoUrl: text("logo_url"),
    accentColor: varchar("accent_color", { length: 30 }),
    icon: varchar("icon", { length: 80 }),
    deployments: integer("deployments").default(0),
    highlights: jsonb("highlights"),
    techStack: jsonb("tech_stack"),
    sortOrder: sortOrder(),
    published: published(),
    isFlagship: jsonb("is_flagship"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("systems_slug_uq").on(t.slug),
    index("systems_category_idx").on(t.category),
  ],
);

export const systemFeatures = pgTable(
  "system_features",
  {
    id: id(),
    systemId: uuid("system_id")
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

export const systemScreenshots = pgTable(
  "system_screenshots",
  {
    id: id(),
    systemId: uuid("system_id")
      .references(() => systems.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 200 }),
    caption: text("caption"),
    imageUrl: text("image_url").notNull(),
    alt: text("alt").notNull().default(""),
    width: integer("width"),
    height: integer("height"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("system_screenshots_system_idx").on(t.systemId)],
);
