import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db, schema } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/guard";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/media/cloudinary";

/**
 * Device upload -> Cloudinary -> media_assets. Admin-only.
 *
 * The file streams from the browser through this route to Cloudinary; only
 * the resulting secure_url + metadata is stored. Vercel never retains the
 * binary. If Cloudinary env is missing, returns a clear 503 (no fake success).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB guard
const ALLOWED = /^(image|video)\//;

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "not_configured", message: "Cloudinary env vars are not set on the server." },
      { status: 503 },
    );
  }
  if (!db) return NextResponse.json({ error: "db_unavailable" }, { status: 503 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const file = form.get("file");
  const alt = (form.get("alt") as string | null)?.slice(0, 500) ?? "";
  const title = (form.get("title") as string | null)?.slice(0, 200) || null;

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large", message: "Max 15 MB." }, { status: 413 });
  }
  if (file.type && !ALLOWED.test(file.type)) {
    return NextResponse.json({ error: "unsupported_type", message: "Images and video only." }, { status: 415 });
  }

  try {
    const up = await uploadToCloudinary(file);
    const id = randomUUID();
    await db.insert(schema.mediaAssets).values({
      id,
      url: up.secureUrl,
      alt,
      title,
      mimeType: file.type || (up.format ? `${up.resourceType}/${up.format}` : null),
      width: up.width,
      height: up.height,
      sizeBytes: up.bytes,
      metadata: { provider: "cloudinary", format: up.format, resourceType: up.resourceType },
    });

    return NextResponse.json(
      { ok: true, id, url: up.secureUrl, width: up.width, height: up.height },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "upload_failed";
    if (process.env.NODE_ENV !== "production") console.warn("[media/upload]", message);
    return NextResponse.json(
      { error: "upload_failed", message: "Upload failed. Please try again." },
      { status: 502 },
    );
  }
}
