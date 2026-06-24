import { NextResponse } from "next/server";
import { desc, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/guard";

/**
 * Session-gated media list for the MediaPicker. Returns lightweight records
 * (url + alt + title) — no mutation here.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!db) return NextResponse.json({ items: [] });

  const rows = await db
    .select({
      id: schema.mediaAssets.id,
      url: schema.mediaAssets.url,
      alt: schema.mediaAssets.alt,
      title: schema.mediaAssets.title,
    })
    .from(schema.mediaAssets)
    .where(isNull(schema.mediaAssets.deletedAt))
    .orderBy(desc(schema.mediaAssets.createdAt))
    .limit(200);

  return NextResponse.json({ items: rows }, { headers: { "Cache-Control": "no-store" } });
}
