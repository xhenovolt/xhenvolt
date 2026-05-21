import type { SectionRecord } from "@/lib/cms/types";
import { getSection, resolveSection, sectionsForRoute } from "@/lib/cms/sections";

export async function resolveCmsSection<TContent = unknown>(
  key: string,
): Promise<SectionRecord<TContent> | null> {
  return resolveSection<TContent>(key);
}

export async function resolveCmsSectionsForRoute(
  route: string,
): Promise<Array<SectionRecord<unknown>>> {
  const definitions = sectionsForRoute(route);
  return Promise.all(definitions.map(async (def) => await resolveSection(def.key))); 
}

export function getCmsSectionDefinition<TContent = unknown>(
  key: string,
) {
  return getSection<TContent>(key);
}
