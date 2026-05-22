import {
  mysqlTable,
  varchar,
  text,
  json,
  index,
  uniqueIndex,
  int,
  customType,
} from "drizzle-orm/mysql-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

/**
 * TiDB native VECTOR type. Syntax is identical to pgvector at the
 * column-definition level (VECTOR(N)) but operators differ: TiDB uses
 * vec_cosine_distance(a, b) instead of the `<=>` infix.
 *
 * Values round-trip as the string form "[1.0, 2.0, ...]" — same wire
 * format as pgvector — which is why toDriver is unchanged.
 */
const vector = customType<{ data: number[]; driverData: string }>({
  dataType(config) {
    const dims = (config as { dimensions?: number })?.dimensions ?? 1536;
    return `vector(${dims})`;
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
});

export const aiTrainingDocuments = mysqlTable(
  "ai_training_documents",
  {
    id: id(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 240 }).notNull(),
    source: varchar("source", { length: 120 }),
    category: varchar("category", { length: 80 }),
    keywords: json("keywords"),
    content: text("content").notNull(),
    summary: text("summary"),
    tokenEstimate: int("token_estimate"),
    embedding: vector("embedding", { dimensions: 1536 }),
    embeddingModel: varchar("embedding_model", { length: 80 }),
    metadata: json("metadata"),
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

export const aiConversationLogs = mysqlTable(
  "ai_conversation_logs",
  {
    id: id(),
    sessionId: varchar("session_id", { length: 80 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(),
    message: text("message").notNull(),
    matchedDocIds: json("matched_doc_ids"),
    matchedFaqIds: json("matched_faq_ids"),
    confidence: int("confidence"),
    latencyMs: int("latency_ms"),
    userAgent: text("user_agent"),
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: createdAt(),
  },
  (t) => [
    index("ai_logs_session_idx").on(t.sessionId),
    index("ai_logs_created_idx").on(t.createdAt),
  ],
);
