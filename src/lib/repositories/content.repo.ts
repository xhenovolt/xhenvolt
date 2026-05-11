import { and, asc, eq, isNull, lte, or, gte, isNotNull, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { safeQuery, CACHE_TAGS } from "@/lib/cache/safe";

export type Statistic = typeof schema.statistics.$inferSelect;
export type Service = typeof schema.services.$inferSelect;
export type Faq = typeof schema.faqs.$inferSelect;
export type TimelineEntry = typeof schema.timelineEntries.$inferSelect;
export type HeroSlide = typeof schema.heroSlides.$inferSelect;
export type Announcement = typeof schema.announcements.$inferSelect;
export type TeamMember = typeof schema.teamMembers.$inferSelect;
export type Technology = typeof schema.technologies.$inferSelect;
export type NavLink = typeof schema.navigationLinks.$inferSelect;
export type FooterLink = typeof schema.footerLinks.$inferSelect;
export type SocialLink = typeof schema.socialLinks.$inferSelect;
export type Setting = typeof schema.settings.$inferSelect;
export type SeoMetadata = typeof schema.seoMetadata.$inferSelect;

export async function listStatistics(scope?: string): Promise<Statistic[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      const where = and(
        eq(schema.statistics.published, true),
        scope ? eq(schema.statistics.scope, scope) : undefined,
      );
      return db
        .select()
        .from(schema.statistics)
        .where(where)
        .orderBy(asc(schema.statistics.sortOrder));
    },
    {
      key: `statistics:${scope ?? "all"}`,
      tags: [CACHE_TAGS.statistics],
      fallback: [],
    },
  );
}

export async function listServices(): Promise<Service[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.services)
        .where(
          and(
            eq(schema.services.published, true),
            isNull(schema.services.deletedAt),
          ),
        )
        .orderBy(asc(schema.services.sortOrder));
    },
    { key: "services:list", tags: [CACHE_TAGS.services], fallback: [] },
  );
}

export async function listFaqs(scope: string = "public"): Promise<Faq[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.faqs)
        .where(
          and(
            eq(schema.faqs.published, true),
            eq(schema.faqs.scope, scope),
            isNull(schema.faqs.deletedAt),
          ),
        )
        .orderBy(asc(schema.faqs.sortOrder));
    },
    { key: `faqs:${scope}`, tags: [CACHE_TAGS.faqs], fallback: [] },
  );
}

export async function listTimeline(): Promise<TimelineEntry[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.timelineEntries)
        .where(eq(schema.timelineEntries.published, true))
        .orderBy(asc(schema.timelineEntries.occurredOn));
    },
    { key: "timeline:list", tags: [CACHE_TAGS.timeline], fallback: [] },
  );
}

export async function listHeroSlides(scope: string = "home"): Promise<HeroSlide[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.heroSlides)
        .where(
          and(
            eq(schema.heroSlides.scope, scope),
            eq(schema.heroSlides.published, true),
          ),
        )
        .orderBy(asc(schema.heroSlides.sortOrder));
    },
    { key: `hero:${scope}`, tags: [CACHE_TAGS.hero], fallback: [] },
  );
}

export async function listActiveAnnouncements(): Promise<Announcement[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      const now = new Date();
      return db
        .select()
        .from(schema.announcements)
        .where(
          and(
            eq(schema.announcements.published, true),
            or(
              isNull(schema.announcements.startsAt),
              lte(schema.announcements.startsAt, now),
            ),
            or(
              isNull(schema.announcements.endsAt),
              gte(schema.announcements.endsAt, now),
            ),
          ),
        )
        .orderBy(asc(schema.announcements.sortOrder));
    },
    {
      key: "announcements:active",
      tags: [CACHE_TAGS.announcements],
      fallback: [],
    },
  );
}

export async function listTeam(): Promise<TeamMember[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.teamMembers)
        .where(
          and(
            eq(schema.teamMembers.published, true),
            isNull(schema.teamMembers.deletedAt),
          ),
        )
        .orderBy(asc(schema.teamMembers.sortOrder));
    },
    { key: "team:list", tags: [CACHE_TAGS.team], fallback: [] },
  );
}

export async function listTechnologies(): Promise<Technology[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.technologies)
        .where(eq(schema.technologies.published, true))
        .orderBy(asc(schema.technologies.sortOrder));
    },
    { key: "tech:list", tags: [CACHE_TAGS.technologies], fallback: [] },
  );
}

export async function listNavigation(location: string = "primary"): Promise<NavLink[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.navigationLinks)
        .where(
          and(
            eq(schema.navigationLinks.location, location),
            eq(schema.navigationLinks.published, true),
          ),
        )
        .orderBy(asc(schema.navigationLinks.sortOrder));
    },
    { key: `nav:${location}`, tags: [CACHE_TAGS.navigation], fallback: [] },
  );
}

export async function listFooterLinks(): Promise<FooterLink[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.footerLinks)
        .where(eq(schema.footerLinks.published, true))
        .orderBy(asc(schema.footerLinks.column), asc(schema.footerLinks.sortOrder));
    },
    { key: "footer:list", tags: [CACHE_TAGS.footer], fallback: [] },
  );
}

export async function listSocialLinks(): Promise<SocialLink[]> {
  return safeQuery(
    async () => {
      if (!db) return [];
      return db
        .select()
        .from(schema.socialLinks)
        .where(eq(schema.socialLinks.published, true))
        .orderBy(asc(schema.socialLinks.sortOrder));
    },
    { key: "social:list", tags: [CACHE_TAGS.social], fallback: [] },
  );
}

export async function getSetting<T = unknown>(
  key: string,
  fallback: T,
): Promise<T> {
  return safeQuery(
    async () => {
      if (!db) return fallback;
      const [row] = await db
        .select()
        .from(schema.settings)
        .where(eq(schema.settings.key, key))
        .limit(1);
      return (row?.value as T) ?? fallback;
    },
    { key: `setting:${key}`, tags: [CACHE_TAGS.settings], fallback },
  );
}

export async function getSeoMetadata(route: string): Promise<SeoMetadata | null> {
  return safeQuery(
    async () => {
      if (!db) return null;
      const [row] = await db
        .select()
        .from(schema.seoMetadata)
        .where(eq(schema.seoMetadata.route, route))
        .limit(1);
      return row ?? null;
    },
    { key: `seo:${route}`, tags: [CACHE_TAGS.seo], fallback: null },
  );
}
