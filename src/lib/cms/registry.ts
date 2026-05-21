/**
 * Section registry. Tracks every editable block on the public site.
 *
 * Today the admin doesn't yet render these as forms — that's Phase 6+ work.
 * The registry is the **foundation**: it gives us a single place to ask
 * "what is editable?" and "where is it used?", which unlocks:
 *
 *   - the admin's "Sections" index
 *   - per-section editor URLs (/admin/sections/<key>)
 *   - cache invalidation by section
 *   - dependency analysis ("which routes change when I edit X?")
 *   - validation against the editable schema
 *
 * Register a section by calling `defineSection(...)` from a *.section.ts
 * file inside src/lib/cms/sections/. Those files are imported by
 * src/lib/cms/sections/index.ts so the bundler sees them at build time.
 */

import type { SectionDefinition, SectionRecord } from "./types";

const REGISTRY = new Map<string, SectionDefinition<unknown>>();

export function defineSection<TContent>(def: SectionDefinition<TContent>): SectionDefinition<TContent> {
  if (REGISTRY.has(def.key)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[cms] overwriting section "${def.key}"`);
    }
  }
  REGISTRY.set(def.key, def as SectionDefinition<unknown>);
  return def;
}

export function listSections(): SectionDefinition<unknown>[] {
  return Array.from(REGISTRY.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}

export function getSection<TContent = unknown>(
  key: string,
): SectionDefinition<TContent> | undefined {
  return REGISTRY.get(key) as SectionDefinition<TContent> | undefined;
}

export async function resolveSection<TContent>(
  key: string,
): Promise<SectionRecord<TContent> | null> {
  const def = getSection<TContent>(key);
  if (!def) return null;
  try {
    const content = await def.resolve();
    if (content == null) {
      return { definition: def, content: def.fallback, isFallback: true };
    }
    return { definition: def, content, isFallback: false };
  } catch {
    return { definition: def, content: def.fallback, isFallback: true };
  }
}

export function sectionsForRoute(route: string): SectionDefinition<unknown>[] {
  return listSections().filter((s) => s.routes.includes(route));
}
