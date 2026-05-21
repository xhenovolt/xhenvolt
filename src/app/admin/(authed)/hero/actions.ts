"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const heroInput = z.object({
  scope: z.string().trim().min(2).max(60),
  eyebrow: z.string().trim().max(240).optional().nullable(),
  headline: z.string().trim().min(2).max(240),
  subheadline: z.string().trim().max(1000).optional().nullable(),
  ctaPrimaryLabel: z.string().trim().max(80).optional().nullable(),
  ctaPrimaryHref: z.string().trim().max(240).optional().nullable(),
  ctaSecondaryLabel: z.string().trim().max(80).optional().nullable(),
  ctaSecondaryHref: z.string().trim().max(240).optional().nullable(),
  backgroundUrl: z.string().trim().max(500).optional().nullable(),
  tagsText: z.string().trim().max(500).optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(["published", "draft"]).optional(),
});

const bust = () => revalidateTag(CACHE_TAGS.hero, "default");

function readForm(fd: FormData) {
  return {
    scope: fd.get("scope") || "home",
    eyebrow: fd.get("eyebrow"),
    headline: fd.get("headline"),
    subheadline: fd.get("subheadline"),
    ctaPrimaryLabel: fd.get("ctaPrimaryLabel"),
    ctaPrimaryHref: fd.get("ctaPrimaryHref"),
    ctaSecondaryLabel: fd.get("ctaSecondaryLabel"),
    ctaSecondaryHref: fd.get("ctaSecondaryHref"),
    backgroundUrl: fd.get("backgroundUrl"),
    tagsText: fd.get("tagsText"),
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status") || "published",
  };
}

function parseTags(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export async function createHero(fd: FormData) {
  await requireAdmin();
  const parsed = heroInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.heroSlides).values({
    scope: parsed.data.scope,
    eyebrow: parsed.data.eyebrow ?? null,
    headline: parsed.data.headline,
    subheadline: parsed.data.subheadline ?? null,
    ctaPrimaryLabel: parsed.data.ctaPrimaryLabel ?? null,
    ctaPrimaryHref: parsed.data.ctaPrimaryHref ?? null,
    ctaSecondaryLabel: parsed.data.ctaSecondaryLabel ?? null,
    ctaSecondaryHref: parsed.data.ctaSecondaryHref ?? null,
    backgroundUrl: parsed.data.backgroundUrl ?? null,
    media: { tags: parseTags(parsed.data.tagsText) },
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
  });
  bust();
  redirect("/admin/hero");
}

export async function updateHero(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = heroInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.heroSlides)
    .set({
      scope: parsed.data.scope,
      eyebrow: parsed.data.eyebrow ?? null,
      headline: parsed.data.headline,
      subheadline: parsed.data.subheadline ?? null,
      ctaPrimaryLabel: parsed.data.ctaPrimaryLabel ?? null,
      ctaPrimaryHref: parsed.data.ctaPrimaryHref ?? null,
      ctaSecondaryLabel: parsed.data.ctaSecondaryLabel ?? null,
      ctaSecondaryHref: parsed.data.ctaSecondaryHref ?? null,
      backgroundUrl: parsed.data.backgroundUrl ?? null,
      media: { tags: parseTags(parsed.data.tagsText) },
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
    })
    .where(eq(schema.heroSlides.id, id));
  bust();
  redirect("/admin/hero");
}

export async function toggleHeroPublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.heroSlides).set({ published: next }).where(eq(schema.heroSlides.id, id));
  bust();
}

export async function deleteHero(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.delete(schema.heroSlides).where(eq(schema.heroSlides.id, id));
  bust();
}
