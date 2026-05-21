"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const seoInput = z.object({
  route: z.string().trim().min(1).max(200).regex(/^\//, "must start with /"),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(2).max(500),
  keywords: z.string().trim().max(1000).optional().nullable(),
  canonical: z.string().trim().max(500).optional().nullable(),
  ogTitle: z.string().trim().max(200).optional().nullable(),
  ogDescription: z.string().trim().max(500).optional().nullable(),
  ogImage: z.string().trim().max(500).optional().nullable(),
  ogType: z.string().trim().max(40).optional().nullable(),
  twitterCard: z.string().trim().max(40).optional().nullable(),
});

const bust = () => revalidateTag(CACHE_TAGS.seo, "default");

function readForm(fd: FormData) {
  return {
    route: fd.get("route"),
    title: fd.get("title"),
    description: fd.get("description"),
    keywords: fd.get("keywords"),
    canonical: fd.get("canonical"),
    ogTitle: fd.get("ogTitle"),
    ogDescription: fd.get("ogDescription"),
    ogImage: fd.get("ogImage"),
    ogType: fd.get("ogType") || "website",
    twitterCard: fd.get("twitterCard") || "summary_large_image",
  };
}

export async function createSeo(fd: FormData) {
  await requireAdmin();
  const parsed = seoInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.seoMetadata).values({
    route: parsed.data.route,
    title: parsed.data.title,
    description: parsed.data.description,
    keywords: parsed.data.keywords ?? null,
    canonical: parsed.data.canonical ?? null,
    ogTitle: parsed.data.ogTitle ?? null,
    ogDescription: parsed.data.ogDescription ?? null,
    ogImage: parsed.data.ogImage ?? null,
    ogType: parsed.data.ogType ?? "website",
    twitterCard: parsed.data.twitterCard ?? "summary_large_image",
  });
  bust();
  redirect("/admin/seo");
}

export async function updateSeo(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = seoInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.seoMetadata)
    .set({
      route: parsed.data.route,
      title: parsed.data.title,
      description: parsed.data.description,
      keywords: parsed.data.keywords ?? null,
      canonical: parsed.data.canonical ?? null,
      ogTitle: parsed.data.ogTitle ?? null,
      ogDescription: parsed.data.ogDescription ?? null,
      ogImage: parsed.data.ogImage ?? null,
      ogType: parsed.data.ogType ?? "website",
      twitterCard: parsed.data.twitterCard ?? "summary_large_image",
    })
    .where(eq(schema.seoMetadata.id, id));
  bust();
  redirect("/admin/seo");
}

export async function deleteSeo(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.delete(schema.seoMetadata).where(eq(schema.seoMetadata.id, id));
  bust();
}
