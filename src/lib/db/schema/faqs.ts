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

export const faqs = pgTable(
  "faqs",
  {
    id: id(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    keywords: jsonb("keywords"),
    category: varchar("category", { length: 80 }),
    scope: varchar("scope", { length: 60 }).default("public"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("faqs_slug_uq").on(t.slug),
    index("faqs_category_idx").on(t.category),
    index("faqs_scope_idx").on(t.scope),
  ],
);
