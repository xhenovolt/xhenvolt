import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { safeQuery, CACHE_TAGS } from "@/lib/cache/safe";

export type AiTrainingDocument = typeof schema.aiTrainingDocuments.$inferSelect;

export async function listTrainingDocuments(
  category?: string,
): Promise<AiTrainingDocument[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      const where = and(
        eq(schema.aiTrainingDocuments.published, true),
        isNull(schema.aiTrainingDocuments.deletedAt),
        category ? eq(schema.aiTrainingDocuments.category, category) : undefined,
      );
      return db
        .select()
        .from(schema.aiTrainingDocuments)
        .where(where)
        .orderBy(asc(schema.aiTrainingDocuments.sortOrder));
    },
    {
      key: `ai-docs:${category ?? "all"}`,
      tags: [CACHE_TAGS.aiDocs],
      fallback: [],
    },
  );
}

/**
 * Keyword scoring fallback used until embeddings are generated.
 * Searches title, content, summary, and keywords JSONB for term overlap.
 */
export async function searchTrainingDocumentsByKeywords(
  query: string,
  limit = 5,
): Promise<Array<AiTrainingDocument & { score: number }>> {
  return safeQuery(
    async () => {
      if (!db) return [];
      const q = query.toLowerCase().trim();
      if (!q) return [];

      const rows = await db.execute<AiTrainingDocument & { score: number }>(sql`
        SELECT *,
          (
            (CASE WHEN lower(title) LIKE ${"%" + q + "%"} THEN 3 ELSE 0 END) +
            (CASE WHEN lower(coalesce(summary, '')) LIKE ${"%" + q + "%"} THEN 2 ELSE 0 END) +
            (CASE WHEN lower(content) LIKE ${"%" + q + "%"} THEN 1 ELSE 0 END)
          ) AS score
        FROM ${schema.aiTrainingDocuments}
        WHERE ${schema.aiTrainingDocuments.published} = true
          AND ${schema.aiTrainingDocuments.deletedAt} IS NULL
          AND (
            lower(title) LIKE ${"%" + q + "%"}
            OR lower(content) LIKE ${"%" + q + "%"}
            OR lower(coalesce(summary, '')) LIKE ${"%" + q + "%"}
          )
        ORDER BY score DESC
        LIMIT ${limit}
      `);
      return rows.rows ?? (rows as unknown as Array<AiTrainingDocument & { score: number }>);
    },
    {
      key: `ai-search:${query}:${limit}`,
      tags: [CACHE_TAGS.aiDocs],
      fallback: [],
      timeoutMs: 6000,
    },
  );
}

export async function logConversation(input: {
  sessionId: string;
  role: "user" | "assistant";
  message: string;
  matchedDocIds?: string[];
  matchedFaqIds?: string[];
  confidence?: number;
  latencyMs?: number;
  userAgent?: string;
  ipHash?: string;
}): Promise<void> {
  if (!db) return;
  try {
    await db.insert(schema.aiConversationLogs).values({
      sessionId: input.sessionId,
      role: input.role,
      message: input.message,
      matchedDocIds: input.matchedDocIds ?? [],
      matchedFaqIds: input.matchedFaqIds ?? [],
      confidence: input.confidence ?? null,
      latencyMs: input.latencyMs ?? null,
      userAgent: input.userAgent ?? null,
      ipHash: input.ipHash ?? null,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[ai.repo] logConversation failed:", err);
    }
  }
}
