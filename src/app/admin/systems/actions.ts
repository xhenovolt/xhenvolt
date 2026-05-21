"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const SYSTEM_KINDS = ["Education", "Finance", "Construction", "Microfinance", "Retail", "Healthcare", "Other"] as const;

const systemInput = z.object({
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/, "lowercase, digits, hyphens only"),
  name: z.string().trim().min(2).max(160),
  tagline: z.string().trim().max(240).optional().nullable(),
  description: z.string().trim().min(10).max(2000),
  category: z.enum(SYSTEM_KINDS).optional(),
  externalUrl: z.string().trim().url().optional().or(z.literal("")),
  accentColor: z.string().trim().max(30).optional().nullable(),
  deployments: z.coerce.number().int().min(0).optional(),
  isFlagship: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(["published", "draft"]).optional(),
  highlightsJson: z.string().optional().nullable(),
});

function bust() {
  revalidateTag(CACHE_TAGS.systems, "default");
  revalidateTag(CACHE_TAGS.services, "default");
}

function parseHighlights(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as Array<{ label?: string } | string>;
    return parsed
      .map((it) => (typeof it === "string" ? it : it.label ?? ""))
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 30);
  } catch {
    return [];
  }
}

function readForm(fd: FormData) {
  return {
    slug: fd.get("slug"),
    name: fd.get("name"),
    tagline: fd.get("tagline"),
    description: fd.get("description"),
    category: fd.get("category") || undefined,
    externalUrl: fd.get("externalUrl"),
    accentColor: fd.get("accentColor"),
    deployments: fd.get("deployments"),
    isFlagship: fd.get("isFlagship") === "on",
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status") || "published",
    highlightsJson: fd.get("highlightsJson"),
  };
}

export async function createSystem(fd: FormData) {
  await requireAdmin();
  const parsed = systemInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  const highlights = parseHighlights(parsed.data.highlightsJson);
  await db.insert(schema.systems).values({
    slug: parsed.data.slug,
    name: parsed.data.name,
    tagline: parsed.data.tagline ?? null,
    description: parsed.data.description,
    category: parsed.data.category ?? null,
    externalUrl: parsed.data.externalUrl || null,
    accentColor: parsed.data.accentColor ?? null,
    deployments: parsed.data.deployments ?? 0,
    isFlagship: Boolean(parsed.data.isFlagship),
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
    highlights,
  });
  bust();
  redirect("/admin/systems");
}

export async function updateSystem(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = systemInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  const highlights = parseHighlights(parsed.data.highlightsJson);
  await db
    .update(schema.systems)
    .set({
      slug: parsed.data.slug,
      name: parsed.data.name,
      tagline: parsed.data.tagline ?? null,
      description: parsed.data.description,
      category: parsed.data.category ?? null,
      externalUrl: parsed.data.externalUrl || null,
      accentColor: parsed.data.accentColor ?? null,
      deployments: parsed.data.deployments ?? 0,
      isFlagship: Boolean(parsed.data.isFlagship),
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
      highlights,
    })
    .where(eq(schema.systems.id, id));
  bust();
  redirect("/admin/systems");
}

export async function toggleSystemPublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.systems).set({ published: next }).where(eq(schema.systems.id, id));
  bust();
}

export async function softDeleteSystem(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.systems)
    .set({ deletedAt: sql`now()`, published: false })
    .where(eq(schema.systems.id, id));
  bust();
}
