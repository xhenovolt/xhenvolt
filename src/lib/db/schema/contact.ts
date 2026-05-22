import {
  mysqlTable,
  varchar,
  text,
  index,
  json,
} from "drizzle-orm/mysql-core";
import { id, createdAt, updatedAt } from "./_shared";

export const contactMessages = mysqlTable(
  "contact_messages",
  {
    id: id(),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 240 }).notNull(),
    phone: varchar("phone", { length: 80 }),
    subject: varchar("subject", { length: 240 }),
    message: text("message").notNull(),
    source: varchar("source", { length: 80 }),
    status: varchar("status", { length: 30 }).notNull().default("new"),
    metadata: json("metadata"),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("contact_status_idx").on(t.status),
    index("contact_created_idx").on(t.createdAt),
  ],
);
