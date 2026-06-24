import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { safeQuery, CACHE_TAGS } from "@/lib/cache/safe";

export type AppProduct = typeof schema.appProducts.$inferSelect;
export type AppRelease = typeof schema.appReleases.$inferSelect;
export type DownloadEvent = typeof schema.downloadEvents.$inferSelect;

export interface AppWithReleases extends AppProduct {
  releases: AppRelease[];
  /** Highest-priority published release across all platforms. */
  latest: AppRelease | null;
  /** Distinct published platforms, e.g. ["windows","linux"]. */
  platforms: string[];
}

/** Ranking so "the latest" is deterministic: latest flag > channel > date. */
const CHANNEL_RANK: Record<string, number> = {
  stable: 4,
  beta: 3,
  alpha: 2,
  legacy: 1,
};

function pickLatest(releases: AppRelease[]): AppRelease | null {
  if (releases.length === 0) return null;
  return [...releases].sort((a, b) => {
    if (a.isLatest !== b.isLatest) return a.isLatest ? -1 : 1;
    const cr = (CHANNEL_RANK[b.releaseChannel] ?? 0) - (CHANNEL_RANK[a.releaseChannel] ?? 0);
    if (cr !== 0) return cr;
    const ad = a.publishedAt?.getTime() ?? a.createdAt.getTime();
    const bd = b.publishedAt?.getTime() ?? b.createdAt.getTime();
    return bd - ad;
  })[0]!;
}

function onlyPublished(releases: AppRelease[]): AppRelease[] {
  return releases.filter((r) => r.status === "published");
}

function decorate(app: AppProduct, releases: AppRelease[]): AppWithReleases {
  const pub = onlyPublished(releases);
  const platforms = Array.from(new Set(pub.map((r) => r.platform)));
  return { ...app, releases: pub, latest: pickLatest(pub), platforms };
}

/** Public: all published apps with their published releases, ordered for the grid. */
export async function listPublishedApps(): Promise<AppWithReleases[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      const apps = await db
        .select()
        .from(schema.appProducts)
        .where(
          and(
            eq(schema.appProducts.status, "published"),
            isNull(schema.appProducts.deletedAt),
          ),
        )
        .orderBy(
          desc(schema.appProducts.featured),
          asc(schema.appProducts.sortOrder),
          asc(schema.appProducts.name),
        );
      if (apps.length === 0) return [];
      const releases = await db
        .select()
        .from(schema.appReleases)
        .where(eq(schema.appReleases.status, "published"));
      return apps.map((a) =>
        decorate(
          a,
          releases.filter((r) => r.appProductId === a.id),
        ),
      );
    },
    { key: "cosmos:apps:published", tags: [CACHE_TAGS.cosmos], fallback: [] },
  );
}

export async function listFeaturedApps(): Promise<AppWithReleases[]> {
  const all = await listPublishedApps();
  return all.filter((a) => a.featured);
}

/** Public: single published app by slug, with published releases. */
export async function getPublishedAppBySlug(
  slug: string,
): Promise<AppWithReleases | null> {
  return safeQuery(
    async () => {
      if (!db) return null;
      const [app] = await db
        .select()
        .from(schema.appProducts)
        .where(
          and(
            eq(schema.appProducts.slug, slug),
            eq(schema.appProducts.status, "published"),
            isNull(schema.appProducts.deletedAt),
          ),
        )
        .limit(1);
      if (!app) return null;
      const releases = await db
        .select()
        .from(schema.appReleases)
        .where(
          and(
            eq(schema.appReleases.appProductId, app.id),
            eq(schema.appReleases.status, "published"),
          ),
        )
        .orderBy(desc(schema.appReleases.publishedAt));
      return decorate(app, releases);
    },
    { key: `cosmos:app:${slug}`, tags: [CACHE_TAGS.cosmos], fallback: null },
  );
}

export interface ResolvedDownload {
  app: AppProduct;
  release: AppRelease;
}

/**
 * Resolver lookup used by /download/[slug]. Returns the app + the release to
 * redirect to. If `platform` is given, restrict to that platform.
 *
 * NOT cached — the resolver path must reflect admin changes immediately and
 * is cheap (two indexed reads). Returns null if nothing publishable matches.
 */
export async function resolveDownloadTarget(
  slug: string,
  platform?: string,
): Promise<ResolvedDownload | null> {
  if (!db) return null;
  try {
    const [app] = await db
      .select()
      .from(schema.appProducts)
      .where(
        and(
          eq(schema.appProducts.slug, slug),
          eq(schema.appProducts.status, "published"),
          isNull(schema.appProducts.deletedAt),
        ),
      )
      .limit(1);
    if (!app) return null;

    const conditions = [
      eq(schema.appReleases.appProductId, app.id),
      eq(schema.appReleases.status, "published"),
    ];
    if (platform) conditions.push(eq(schema.appReleases.platform, platform));

    const releases = await db
      .select()
      .from(schema.appReleases)
      .where(and(...conditions));
    const release = pickLatest(releases);
    if (!release) return null;
    return { app, release };
  } catch {
    return null;
  }
}
