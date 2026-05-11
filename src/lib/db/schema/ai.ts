import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  jsonb,
  index,
  uniqueIndex,
  integer,
  customType,
} from "drizzle-orm/pg-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

const vector = customType<{ data: number[]; driverData: string }>({
  dataType(config) {
    const dims = (config as { dimensions?: number })?.dimensions ?? 1536;
    return `vector(${dims})`;
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
});

export const aiTrainingDocuments = pgTable(
  "ai_training_documents",
  {
    id: id(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 240 }).notNull(),
    source: varchar("source", { length: 120 }),
    category: varchar("category", { length: 80 }),
    keywords: jsonb("keywords"),
    content: text("content").notNull(),
    summary: text("summary"),
    tokenEstimate: integer("token_estimate"),
    embedding: vector("embedding", { dimensions: 1536 }),
    embeddingModel: varchar("embedding_model", { length: 80 }),
    metadata: jsonb("metadata"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("ai_docs_slug_uq").on(t.slug),
    index("ai_docs_category_idx").on(t.category),
  ],
);

export const aiConversationLogs = pgTable(
  "ai_conversation_logs",
  {
    id: id(),
    sessionId: varchar("session_id", { length: 80 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(),
    message: text("message").notNull(),
    matchedDocIds: jsonb("matched_doc_ids"),
    matchedFaqIds: jsonb("matched_faq_ids"),
    confidence: integer("confidence"),
    latencyMs: integer("latency_ms"),
    userAgent: text("user_agent"),
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: createdAt(),
  },
  (t) => [
    index("ai_logs_session_idx").on(t.sessionId),
    index("ai_logs_created_idx").on(t.createdAt),
  ],
);
