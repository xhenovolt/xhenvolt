import type { ComponentType } from "react";

/**
 * Section renderer registry.
 *
 * Maps a `SectionKind` (the string stored in `sections.kind`) to a
 * server component that knows how to render that kind. The renderer
 * receives the section's `content` JSONB and any per-row overrides.
 *
 * Adding a new renderable section type = add an entry here. Pages then
 * compose sections without code changes via the `sections` table.
 */

export interface SectionRenderProps {
  /** Section identity (key + id), used for keys + Editable wrappers. */
  sectionKey: string;
  sectionId: string;
  /** Section title/subtitle/body straight from the row. */
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  /** The row's `content` JSONB. Shape depends on `kind`. */
  content: unknown;
}

export type SectionRenderer = ComponentType<SectionRenderProps>;

const REGISTRY = new Map<string, SectionRenderer>();

export function registerRenderer(kind: string, renderer: SectionRenderer): void {
  if (REGISTRY.has(kind)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[cms/render] overwriting renderer for kind "${kind}"`);
    }
  }
  REGISTRY.set(kind, renderer);
}

export function getRenderer(kind: string): SectionRenderer | undefined {
  return REGISTRY.get(kind);
}

export function listRendererKinds(): string[] {
  return Array.from(REGISTRY.keys()).sort();
}
