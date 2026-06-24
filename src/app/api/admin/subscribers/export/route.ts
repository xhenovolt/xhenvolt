import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/guard";

/**
 * CSV export of subscribers. Admin-only (session-gated). Streams a generated
 * CSV string — no third-party export service.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  // Escape quotes; wrap in quotes if it contains comma/quote/newline.
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!db) {
    return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  }

  const rows = await db
    .select()
    .from(schema.subscribers)
    .orderBy(desc(schema.subscribers.createdAt));

  const header = ["email", "name", "status", "interests", "source", "joined"];
  const lines = [header.join(",")];
  for (const r of rows) {
    const interests = Array.isArray(r.interests) ? (r.interests as string[]).join("; ") : "";
    lines.push(
      [
        csvCell(r.email),
        csvCell(r.name ?? ""),
        csvCell(r.status),
        csvCell(interests),
        csvCell(r.source),
        csvCell(new Date(r.createdAt).toISOString().slice(0, 10)),
      ].join(","),
    );
  }
  const csv = lines.join("\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="xhenvolt-subscribers-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
