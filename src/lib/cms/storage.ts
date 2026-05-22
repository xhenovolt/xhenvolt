/**
 * Content storage abstraction.
 *
 * Most CMS content lives in dedicated relational tables (testimonials,
 * systems, faqs, ...). A subset — page-level overrides, settings,
 * unstructured blocks — lands in the generic `settings` table as a
 * JSONB blob keyed by section key.
 *
 * This module exposes a tiny key/value API on top of `settings` for the
 * CMS to use when a section doesn't have a dedicated table. Sections
 * that DO have a dedicated table (testimonials, systems, etc.) keep
 * using their repository — `storage` is the fallback for everything else.
 */

import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const SETTINGS_KEY_PREFIX = "cms:";

export async function readBlock<T>(sectionKey: string): Promise<T | null> {
  if (!db) return null;
  try {
    const [row] = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.key, SETTINGS_KEY_PREFIX + sectionKey))
      .limit(1);
    return (row?.value as T) ?? null;
  } catch {
    return null;
  }
}

export async function writeBlock<T>(
  sectionKey: string,
  value: T,
  description?: string,
): Promise<void> {
  if (!db) throw new Error("db_unavailable");
  await db
    .insert(schema.settings)
    .values({
      key: SETTINGS_KEY_PREFIX + sectionKey,
      value: value as unknown,
      description: description ?? `CMS block: ${sectionKey}`,
    })
    .onDuplicateKeyUpdate({
      set: {
        value: value as unknown,
        description: description ?? `CMS block: ${sectionKey}`,
        updatedAt: sql`CURRENT_TIMESTAMP(3)`,
      },
    });
}

export async function deleteBlock(sectionKey: string): Promise<void> {
  if (!db) return;
  await db.delete(schema.settings).where(eq(schema.settings.key, SETTINGS_KEY_PREFIX + sectionKey));
}
