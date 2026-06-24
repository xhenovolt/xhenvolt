"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { and, eq, ne } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";
import {
  RELEASE_CHANNELS,
  PLATFORMS,
  ARCHITECTURES,
  FILE_TYPES,
} from "@/lib/db/schema/cosmos";
import { validateDownloadUrl, extensionMatchesFileType } from "@/lib/cosmos/urls";

const releaseInput = z.object({
  appProductId: z.string().trim().min(1, "Select an app"),
  version: z.string().trim().min(1).max(60),
  releaseChannel: z.enum(RELEASE_CHANNELS),
  platform: z.enum(PLATFORMS),
  architecture: z.enum(ARCHITECTURES),
  fileType: z.enum(FILE_TYPES),
  fileSize: z.coerce.number().int().min(0).optional().nullable(),
  githubReleaseUrl: z.string().trim().min(1, "Release URL is required"),
  checksumSha256: z
    .string()
    .trim()
    .regex(/^[a-fA-F0-9]{64}$/, "Must be a 64-char hex SHA-256")
    .optional()
    .or(z.literal("")),
  releaseNotes: z.string().trim().max(8000).optional().nullable(),
  isLatest: z.coerce.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

function bust() {
  revalidateTag(CACHE_TAGS.cosmos, "default");
}

function readForm(fd: FormData) {
  return {
    appProductId: fd.get("appProductId"),
    version: fd.get("version"),
    releaseChannel: fd.get("releaseChannel") || "stable",
    platform: fd.get("platform"),
    architecture: fd.get("architecture") || "x64",
    fileType: fd.get("fileType"),
    fileSize: fd.get("fileSize") || null,
    githubReleaseUrl: fd.get("githubReleaseUrl"),
    checksumSha256: fd.get("checksumSha256"),
    releaseNotes: fd.get("releaseNotes"),
    isLatest: fd.get("isLatest") === "on",
    status: fd.get("status") || "published",
  };
}

/** Shared validation: zod + URL allow-list + extension match. Throws on failure. */
function validate(fd: FormData) {
  const parsed = releaseInput.safeParse(readForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  const d = parsed.data;

  const urlCheck = validateDownloadUrl(d.githubReleaseUrl);
  if (!urlCheck.ok || !urlCheck.url) {
    throw new Error("invalid_url: " + (urlCheck.reason ?? "URL rejected"));
  }
  const extCheck = extensionMatchesFileType(urlCheck.url, d.fileType);
  if (!extCheck.ok) {
    throw new Error("invalid_url: " + (extCheck.reason ?? "extension mismatch"));
  }
  return { ...d, githubReleaseUrl: urlCheck.url };
}

/** Enforce "one latest per (app, platform, channel)" by clearing siblings. */
async function clearOtherLatest(
  appProductId: string,
  platform: string,
  channel: string,
  exceptId?: string,
) {
  if (!db) return;
  const where = and(
    eq(schema.appReleases.appProductId, appProductId),
    eq(schema.appReleases.platform, platform),
    eq(schema.appReleases.releaseChannel, channel),
    exceptId ? ne(schema.appReleases.id, exceptId) : undefined,
  );
  await db.update(schema.appReleases).set({ isLatest: false }).where(where);
}

export async function createRelease(fd: FormData) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  const d = validate(fd);

  // If this build is being flagged latest, clear sibling latest flags first.
  if (d.isLatest) {
    await clearOtherLatest(d.appProductId, d.platform, d.releaseChannel);
  }

  const id = randomUUID();
  await db.insert(schema.appReleases).values({
    id,
    appProductId: d.appProductId,
    version: d.version,
    releaseChannel: d.releaseChannel,
    platform: d.platform,
    architecture: d.architecture,
    fileType: d.fileType,
    fileSize: d.fileSize ?? null,
    githubReleaseUrl: d.githubReleaseUrl,
    checksumSha256: d.checksumSha256 || null,
    releaseNotes: d.releaseNotes || null,
    isLatest: Boolean(d.isLatest),
    status: d.status ?? "published",
    publishedAt: d.status === "published" ? new Date() : null,
  });

  bust();
  redirect(`/admin/cosmos/apps/${d.appProductId}`);
}

export async function updateRelease(id: string, fd: FormData) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  const d = validate(fd);

  const publishedAt = d.status === "published" ? new Date() : null;
  await db
    .update(schema.appReleases)
    .set({
      appProductId: d.appProductId,
      version: d.version,
      releaseChannel: d.releaseChannel,
      platform: d.platform,
      architecture: d.architecture,
      fileType: d.fileType,
      fileSize: d.fileSize ?? null,
      githubReleaseUrl: d.githubReleaseUrl,
      checksumSha256: d.checksumSha256 || null,
      releaseNotes: d.releaseNotes || null,
      isLatest: Boolean(d.isLatest),
      status: d.status ?? "published",
      ...(publishedAt ? { publishedAt } : {}),
    })
    .where(eq(schema.appReleases.id, id));

  if (d.isLatest) {
    await clearOtherLatest(d.appProductId, d.platform, d.releaseChannel, id);
  }
  bust();
  redirect(`/admin/cosmos/apps/${d.appProductId}`);
}

export async function markReleaseLatest(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  const [r] = await db.select().from(schema.appReleases).where(eq(schema.appReleases.id, id)).limit(1);
  if (!r) return;
  await clearOtherLatest(r.appProductId, r.platform, r.releaseChannel, id);
  await db.update(schema.appReleases).set({ isLatest: true }).where(eq(schema.appReleases.id, id));
  bust();
}

export async function archiveRelease(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.appReleases)
    .set({ status: "archived", isLatest: false })
    .where(eq(schema.appReleases.id, id));
  bust();
}

export async function deleteRelease(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.delete(schema.appReleases).where(eq(schema.appReleases.id, id));
  bust();
}
