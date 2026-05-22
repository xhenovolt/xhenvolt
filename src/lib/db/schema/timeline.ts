import {
  mysqlTable,
  varchar,
  text,
  index,
  date,
  json,
} from "drizzle-orm/mysql-core";
import {
  id,
  createdAt,
  updatedAt,
  published,
  sortOrder,
} from "./_shared";

export const timelineEntries = mysqlTable(
  "timeline_entries",
  {
    id: id(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    occurredOn: date("occurred_on", { mode: "string" }).notNull(),
    label: varchar("label", { length: 80 }),
    icon: varchar("icon", { length: 80 }),
    accentColor: varchar("accent_color", { length: 30 }),
    highlight: json("highlight"),
    events: json("events"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("timeline_occurred_idx").on(t.occurredOn)],
);
