"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const serviceInput = z.object({
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/, "lowercase, digits, hyphens only"),
  title: z.string().trim().min(2).max(200),
  tagline: z.string().trim().max(240).optional().nullable(),
  description: z.string().trim().min(10).max(2000),
  icon: z.string().trim().max(80).optional().nullable(),
  accentColor: z.string().trim().max(30).optional().nullable(),
  audience: z.string().trim().max(200).optional().nullable(),
  priceFrom: z.string().trim().max(80).optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(["published", "draft"]).optional(),
});

const bust = () => revalidateTag(CACHE_TAGS.services, "default");

function readForm(fd: FormData) {
  return {
    slug: fd.get("slug"),
    title: fd.get("title"),
    tagline: fd.get("tagline"),
    description: fd.get("description"),
    icon: fd.get("icon"),
    accentColor: fd.get("accentColor"),
    audience: fd.get("audience"),
    priceFrom: fd.get("priceFrom"),
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status") || "published",
  };
}

export async function createService(fd: FormData) {
  await requireAdmin();
  const parsed = serviceInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.services).values({
    slug: parsed.data.slug,
    title: parsed.data.title,
    tagline: parsed.data.tagline ?? null,
    description: parsed.data.description,
    icon: parsed.data.icon ?? null,
    accentColor: parsed.data.accentColor ?? null,
    audience: parsed.data.audience ?? null,
    priceFrom: parsed.data.priceFrom ?? null,
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
  });
  bust();
  redirect("/admin/services");
}

export async function updateService(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = serviceInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.services)
    .set({
      slug: parsed.data.slug,
      title: parsed.data.title,
      tagline: parsed.data.tagline ?? null,
      description: parsed.data.description,
      icon: parsed.data.icon ?? null,
      accentColor: parsed.data.accentColor ?? null,
      audience: parsed.data.audience ?? null,
      priceFrom: parsed.data.priceFrom ?? null,
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
    })
    .where(eq(schema.services.id, id));
  bust();
  redirect("/admin/services");
}

export async function toggleServicePublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.services).set({ published: next }).where(eq(schema.services.id, id));
  bust();
}

export async function softDeleteService(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.services)
    .set({ deletedAt: sql`now()`, published: false })
    .where(eq(schema.services.id, id));
  bust();
}
