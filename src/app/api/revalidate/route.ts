import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache/safe";

export const dynamic = "force-dynamic";

const VALID_TAGS = new Set<string>(Object.values(CACHE_TAGS));

export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { tags?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const tags = (body.tags ?? []).filter((t) => VALID_TAGS.has(t));
  if (tags.length === 0) {
    return NextResponse.json({ error: "no valid tags provided" }, { status: 400 });
  }

  for (const tag of tags) revalidateTag(tag, "default");
  return NextResponse.json({ revalidated: tags });
}
