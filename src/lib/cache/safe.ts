import { unstable_cache } from "next/cache";

interface SafeOptions<T> {
  key: string;
  tags?: string[];
  revalidate?: number;
  fallback: T;
  timeoutMs?: number;
}

const ENABLE_CACHE = process.env.NODE_ENV === "production";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(
      () => reject(new Error(`safeQuery timeout after ${ms}ms`)),
      ms,
    );
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (err) => {
        clearTimeout(t);
        reject(err);
      },
    );
  });
}

/**
 * Wraps a database read with:
 *  - timeout
 *  - error catch -> typed fallback (never throws)
 *  - Next.js cache in production with tag-based revalidation
 *
 * Frontend components should always render even if Neon is unavailable.
 */
export async function safeQuery<T>(
  loader: () => Promise<T>,
  opts: SafeOptions<T>,
): Promise<T> {
  const wrapped = async () => {
    try {
      return await withTimeout(loader(), opts.timeoutMs ?? 4000);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[safeQuery:${opts.key}] failed, using fallback:`, err);
      }
      return opts.fallback;
    }
  };

  if (!ENABLE_CACHE) return wrapped();

  const cached = unstable_cache(wrapped, [opts.key], {
    tags: opts.tags ?? [opts.key],
    revalidate: opts.revalidate ?? 60,
  });
  return cached();
}

export const CACHE_TAGS = {
  systems: "systems",
  testimonials: "testimonials",
  services: "services",
  clients: "clients",
  statistics: "statistics",
  faqs: "faqs",
  navigation: "navigation",
  footer: "footer",
  social: "social",
  hero: "hero",
  team: "team",
  technologies: "technologies",
  timeline: "timeline",
  partners: "partners",
  settings: "settings",
  seo: "seo",
  announcements: "announcements",
  pages: "pages",
  gallery: "gallery",
  aiDocs: "ai-docs",
  cosmos: "cosmos",
} as const;
