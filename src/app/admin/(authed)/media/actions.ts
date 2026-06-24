"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";

/**
 * Media registry actions.
 *
 * This is the "register a hosted asset by URL" path — it does NOT upload
 * bytes (device upload needs a configured storage provider; see the note in
 * the admin UI). URLs must be http(s); dangerous protocols are rejected.
 */

const mediaInput = z.object({
  url: z
    .string()
    .trim()
    .min(4)
    .max(500)
    .refine((u) => /^https?:\/\//i.test(u), "Must be an http(s) URL.")
    .refine(
      (u) => !/^\s*(javascript|data|file|vbscript|blob):/i.test(u),
      "Disallowed URL protocol.",
    ),
  alt: z.string().trim().max(500).optional().default(""),
  title: z.string().trim().max(200).optional().nullable(),
  mimeType: z.string().trim().max(80).optional().nullable(),
  width: z.coerce.number().int().min(0).max(100000).optional().nullable(),
  height: z.coerce.number().int().min(0).max(100000).optional().nullable(),
});

function readForm(fd: FormData) {
  return {
    url: fd.get("url"),
    alt: fd.get("alt") ?? "",
    title: fd.get("title"),
    mimeType: fd.get("mimeType"),
    width: fd.get("width") || undefined,
    height: fd.get("height") || undefined,
  };
}

export async function createMedia(fd: FormData) {
  await requireAdmin();
  const parsed = mediaInput.safeParse(readForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.mediaAssets).values({
    url: parsed.data.url,
    alt: parsed.data.alt ?? "",
    title: parsed.data.title ?? null,
    mimeType: parsed.data.mimeType ?? null,
    width: parsed.data.width ?? null,
    height: parsed.data.height ?? null,
  });
  revalidatePath("/admin/media");
  redirect("/admin/media");
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  // Soft delete — keeps referential history; list filters deletedAt IS NULL.
  await db
    .update(schema.mediaAssets)
    .set({ deletedAt: sql`now()` })
    .where(eq(schema.mediaAssets.id, id));
  revalidatePath("/admin/media");
}
