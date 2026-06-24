"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";
import { APP_STATUS } from "@/lib/db/schema/cosmos";

const appInput = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, digits and hyphens only"),
  name: z.string().trim().min(2).max(160),
  tagline: z.string().trim().max(240).optional().nullable(),
  description: z.string().trim().min(10).max(4000),
  longDescription: z.string().trim().max(8000).optional().nullable(),
  category: z.string().trim().max(80).optional().nullable(),
  icon: z.string().trim().max(80).optional().nullable(),
  iconUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  brandColor: z.string().trim().max(30).optional().nullable(),
  status: z.enum(APP_STATUS).optional(),
  featured: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

function bust() {
  revalidateTag(CACHE_TAGS.cosmos, "default");
}

function readForm(fd: FormData) {
  return {
    slug: fd.get("slug"),
    name: fd.get("name"),
    tagline: fd.get("tagline"),
    description: fd.get("description"),
    longDescription: fd.get("longDescription"),
    category: fd.get("category"),
    icon: fd.get("icon"),
    iconUrl: fd.get("iconUrl"),
    brandColor: fd.get("brandColor"),
    status: fd.get("status") || "draft",
    featured: fd.get("featured") === "on",
    sortOrder: fd.get("sortOrder"),
  };
}

export async function createApp(fd: FormData) {
  await requireAdmin();
  const parsed = appInput.safeParse(readForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  if (!db) throw new Error("db_unavailable");
  const d = parsed.data;
  await db.insert(schema.appProducts).values({
    slug: d.slug,
    name: d.name,
    tagline: d.tagline || null,
    description: d.description,
    longDescription: d.longDescription || null,
    category: d.category || null,
    icon: d.icon || null,
    iconUrl: d.iconUrl || null,
    brandColor: d.brandColor || null,
    status: d.status ?? "draft",
    featured: Boolean(d.featured),
    sortOrder: d.sortOrder ?? 0,
  });
  bust();
  redirect("/admin/cosmos/apps");
}

export async function updateApp(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = appInput.safeParse(readForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  if (!db) throw new Error("db_unavailable");
  const d = parsed.data;
  await db
    .update(schema.appProducts)
    .set({
      slug: d.slug,
      name: d.name,
      tagline: d.tagline || null,
      description: d.description,
      longDescription: d.longDescription || null,
      category: d.category || null,
      icon: d.icon || null,
      iconUrl: d.iconUrl || null,
      brandColor: d.brandColor || null,
      status: d.status ?? "draft",
      featured: Boolean(d.featured),
      sortOrder: d.sortOrder ?? 0,
    })
    .where(eq(schema.appProducts.id, id));
  bust();
  redirect("/admin/cosmos/apps");
}

/** Quick publish/unpublish toggle from the list (published <-> draft). */
export async function toggleAppPublished(id: string, currentStatus: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  const next = currentStatus === "published" ? "draft" : "published";
  await db
    .update(schema.appProducts)
    .set({ status: next })
    .where(eq(schema.appProducts.id, id));
  bust();
}

export async function toggleAppFeatured(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.appProducts)
    .set({ featured: next })
    .where(eq(schema.appProducts.id, id));
  bust();
}

export async function archiveApp(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.appProducts)
    .set({ status: "archived", deletedAt: sql`now()` })
    .where(eq(schema.appProducts.id, id));
  bust();
}
