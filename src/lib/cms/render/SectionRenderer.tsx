import { asc, eq, and, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getRenderer } from "./renderers";

/**
 * <DynamicPage page="/" /> looks up the page row by route, loads its
 * published `sections` in order, and dispatches each row to the matching
 * renderer. Sections whose `kind` has no registered renderer are skipped
 * with a dev-only warning.
 */
export default async function DynamicPage({ route }: { route: string }) {
  if (!db) return null;

  let pageRow;
  try {
    const rows = await db
      .select()
      .from(schema.pages)
      .where(
        and(
          eq(schema.pages.route, route),
          eq(schema.pages.published, true),
          isNull(schema.pages.deletedAt),
        ),
      )
      .limit(1);
    pageRow = rows[0];
  } catch {
    return null;
  }
  if (!pageRow) return null;

  let sectionRows;
  try {
    sectionRows = await db
      .select()
      .from(schema.sections)
      .where(
        and(
          eq(schema.sections.pageId, pageRow.id),
          eq(schema.sections.published, true),
          isNull(schema.sections.deletedAt),
        ),
      )
      .orderBy(asc(schema.sections.sortOrder));
  } catch {
    return null;
  }

  return (
    <>
      {sectionRows.map((s) => {
        const Renderer = getRenderer(s.kind);
        if (!Renderer) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`[cms/render] no renderer for kind "${s.kind}" (section ${s.key})`);
          }
          return null;
        }
        return (
          <Renderer
            key={s.id}
            sectionKey={s.key}
            sectionId={s.id}
            title={s.title}
            subtitle={s.subtitle}
            body={s.body}
            content={s.content}
          />
        );
      })}
    </>
  );
}
