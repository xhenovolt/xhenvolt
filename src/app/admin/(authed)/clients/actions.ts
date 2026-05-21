"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const KINDS = ["school", "sacco", "business", "ngo", "government", "other"] as const;

const clientInput = z.object({
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/, "lowercase, digits, hyphens only"),
  name: z.string().trim().min(2).max(200),
  kind: z.enum(KINDS).optional(),
  location: z.string().trim().max(160).optional().nullable(),
  logoUrl: z.string().trim().max(500).optional().nullable(),
  website: z.string().trim().max(500).optional().nullable(),
  description: z.string().trim().max(1000).optional().nullable(),
  featured: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(["published", "draft"]).optional(),
});

const bust = () => revalidateTag(CACHE_TAGS.clients, "default");

function readForm(fd: FormData) {
  return {
    slug: fd.get("slug"),
    name: fd.get("name"),
    kind: fd.get("kind") || "school",
    location: fd.get("location"),
    logoUrl: fd.get("logoUrl"),
    website: fd.get("website"),
    description: fd.get("description"),
    featured: fd.get("featured") === "on",
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status") || "published",
  };
}

export async function createClient(fd: FormData) {
  await requireAdmin();
  const parsed = clientInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.clients).values({
    slug: parsed.data.slug,
    name: parsed.data.name,
    kind: parsed.data.kind ?? "school",
    location: parsed.data.location ?? null,
    logoUrl: parsed.data.logoUrl ?? null,
    website: parsed.data.website ?? null,
    description: parsed.data.description ?? null,
    featured: Boolean(parsed.data.featured),
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
  });
  bust();
  redirect("/admin/clients");
}

export async function updateClient(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = clientInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.clients)
    .set({
      slug: parsed.data.slug,
      name: parsed.data.name,
      kind: parsed.data.kind ?? "school",
      location: parsed.data.location ?? null,
      logoUrl: parsed.data.logoUrl ?? null,
      website: parsed.data.website ?? null,
      description: parsed.data.description ?? null,
      featured: Boolean(parsed.data.featured),
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
    })
    .where(eq(schema.clients.id, id));
  bust();
  redirect("/admin/clients");
}

export async function toggleClientPublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.clients).set({ published: next }).where(eq(schema.clients.id, id));
  bust();
}

export async function softDeleteClient(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.clients)
    .set({ deletedAt: sql`now()`, published: false })
    .where(eq(schema.clients.id, id));
  bust();
}
