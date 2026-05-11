import {
  pgTable,
  varchar,
  text,
  index,
  date,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  id,
  createdAt,
  updatedAt,
  published,
  sortOrder,
} from "./_shared";

export const timelineEntries = pgTable(
  "timeline_entries",
  {
    id: id(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    occurredOn: date("occurred_on").notNull(),
    label: varchar("label", { length: 80 }),
    icon: varchar("icon", { length: 80 }),
    accentColor: varchar("accent_color", { length: 30 }),
    highlight: jsonb("highlight"),
    events: jsonb("events"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("timeline_occurred_idx").on(t.occurredOn)],
);
