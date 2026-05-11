import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { safeQuery, CACHE_TAGS } from "@/lib/cache/safe";

export type Client = typeof schema.clients.$inferSelect;
export type Partner = typeof schema.partners.$inferSelect;

export async function listClients(opts?: {
  kind?: string;
}): Promise<Client[]> {
  const key = `clients:${opts?.kind ?? "all"}`;
  return safeQuery(
    async () => {
      if (!db) return [];
      const where = and(
        eq(schema.clients.published, true),
        isNull(schema.clients.deletedAt),
        opts?.kind ? eq(schema.clients.kind, opts.kind) : undefined,
      );
      return db
        .select()
        .from(schema.clients)
        .where(where)
        .orderBy(desc(schema.clients.featured), asc(schema.clients.sortOrder));
    },
    { key, tags: [CACHE_TAGS.clients], fallback: [] },
  );
}

export async function listPartners(): Promise<Partner[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.partners)
        .where(eq(schema.partners.published, true))
        .orderBy(asc(schema.partners.sortOrder));
    },
    { key: "partners:list", tags: [CACHE_TAGS.partners], fallback: [] },
  );
}
