import {
  pgTable,
  varchar,
  text,
  index,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

export const careers = pgTable(
  "careers",
  {
    id: id(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    department: varchar("department", { length: 120 }),
    location: varchar("location", { length: 160 }),
    employmentType: varchar("employment_type", { length: 60 }),
    seniority: varchar("seniority", { length: 60 }),
    description: text("description").notNull(),
    requirements: jsonb("requirements"),
    responsibilities: jsonb("responsibilities"),
    applyUrl: text("apply_url"),
    status: varchar("status", { length: 30 }).notNull().default("open"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("careers_slug_uq").on(t.slug),
    index("careers_status_idx").on(t.status),
  ],
);
