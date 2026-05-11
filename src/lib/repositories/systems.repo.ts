import { and, asc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { safeQuery, CACHE_TAGS } from "@/lib/cache/safe";

export type System = typeof schema.systems.$inferSelect;
export type SystemFeature = typeof schema.systemFeatures.$inferSelect;
export type SystemScreenshot = typeof schema.systemScreenshots.$inferSelect;

export interface SystemWithRelations extends System {
  features: SystemFeature[];
  screenshots: SystemScreenshot[];
}

export async function listSystems(): Promise<SystemWithRelations[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      const rows = await db.query.systems.findMany({
        where: and(
          eq(schema.systems.published, true),
          isNull(schema.systems.deletedAt),
        ),
        orderBy: [asc(schema.systems.sortOrder), asc(schema.systems.name)],
        with: {
          // drizzle relations not declared — we'll fetch in separate calls
        },
      });
      const features = await db
        .select()
        .from(schema.systemFeatures)
        .where(eq(schema.systemFeatures.published, true))
        .orderBy(asc(schema.systemFeatures.sortOrder));
      const screenshots = await db
        .select()
        .from(schema.systemScreenshots)
        .where(eq(schema.systemScreenshots.published, true))
        .orderBy(asc(schema.systemScreenshots.sortOrder));
      return rows.map((s) => ({
        ...s,
        features: features.filter((f) => f.systemId === s.id),
        screenshots: screenshots.filter((sh) => sh.systemId === s.id),
      }));
    },
    {
      key: "systems:list",
      tags: [CACHE_TAGS.systems],
      fallback: [],
    },
  );
}

export async function getSystemBySlug(
  slug: string,
): Promise<SystemWithRelations | null> {
  return safeQuery(
    async () => {
      if (!db) return null;
      const [s] = await db
        .select()
        .from(schema.systems)
        .where(
          and(
            eq(schema.systems.slug, slug),
            eq(schema.systems.published, true),
            isNull(schema.systems.deletedAt),
          ),
        )
        .limit(1);
      if (!s) return null;
      const features = await db
        .select()
        .from(schema.systemFeatures)
        .where(
          and(
            eq(schema.systemFeatures.systemId, s.id),
            eq(schema.systemFeatures.published, true),
          ),
        )
        .orderBy(asc(schema.systemFeatures.sortOrder));
      const screenshots = await db
        .select()
        .from(schema.systemScreenshots)
        .where(
          and(
            eq(schema.systemScreenshots.systemId, s.id),
            eq(schema.systemScreenshots.published, true),
          ),
        )
        .orderBy(asc(schema.systemScreenshots.sortOrder));
      return { ...s, features, screenshots };
    },
    {
      key: `systems:slug:${slug}`,
      tags: [CACHE_TAGS.systems],
      fallback: null,
    },
  );
}
