import { NextResponse } from "next/server";
import { probeDatabaseDeep } from "@/lib/health/db-probe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deep database probe — bypasses Drizzle and hits Neon's HTTP SQL
 * endpoint directly. Returns the raw cause of any failure (HTTP
 * status, error message, classified category, fix hint). Use this when
 * /api/admin/health says the DB is down and you need to know WHY.
 */
export async function GET() {
  const result = await probeDatabaseDeep();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
