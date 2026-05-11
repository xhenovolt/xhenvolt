import { NextResponse } from "next/server";
import { hasDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDb()) {
    return NextResponse.json({ ok: false, reason: "no-db" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, model: "xhenvolt-ai-retrieval-v1" });
}
