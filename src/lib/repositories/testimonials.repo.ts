import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { safeQuery, CACHE_TAGS } from "@/lib/cache/safe";

export type Testimonial = typeof schema.testimonials.$inferSelect;

export async function listTestimonials(opts?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<Testimonial[]> {
  const key = `testimonials:${opts?.featuredOnly ? "featured" : "all"}:${opts?.limit ?? "any"}`;
  return safeQuery(
    async () => {
      if (!db) return [];
      const where = and(
        eq(schema.testimonials.published, true),
        isNull(schema.testimonials.deletedAt),
        opts?.featuredOnly ? eq(schema.testimonials.featured, true) : undefined,
      );
      const rows = await db
        .select()
        .from(schema.testimonials)
        .where(where)
        .orderBy(
          desc(schema.testimonials.featured),
          asc(schema.testimonials.sortOrder),
        )
        .limit(opts?.limit ?? 100);
      return rows;
    },
    { key, tags: [CACHE_TAGS.testimonials], fallback: [] },
  );
}
