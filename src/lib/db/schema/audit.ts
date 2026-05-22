import {
  mysqlTable,
  varchar,
  text,
  index,
  json,
} from "drizzle-orm/mysql-core";
import { id, createdAt } from "./_shared";
import { adminUsers } from "./admin";

/**
 * Append-only log of admin mutations. Never updated or deleted by app code.
 */
export const adminAuditLogs = mysqlTable(
  "admin_audit_logs",
  {
    id: id(),
    actorId: varchar("actor_id", { length: 36 }).references(
      () => adminUsers.id,
      { onDelete: "set null" },
    ),
    actorEmail: varchar("actor_email", { length: 240 }),
    action: varchar("action", { length: 80 }).notNull(),
    entityType: varchar("entity_type", { length: 80 }).notNull(),
    entityId: varchar("entity_id", { length: 64 }),
    summary: text("summary"),
    metadata: json("metadata"),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
  },
  (t) => [
    index("audit_entity_idx").on(t.entityType, t.entityId),
    index("audit_actor_idx").on(t.actorId),
    index("audit_created_idx").on(t.createdAt),
  ],
);
