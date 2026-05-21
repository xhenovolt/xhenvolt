"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const pageInput = z.object({
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9\-/]+$/, "lowercase, digits, hyphens, slashes"),
  title: z.string().trim().min(2).max(200),
  route: z.string().trim().min(1).max(200),
  summary: z.string().trim().max(500).optional().nullable(),
  status: z.enum(["draft", "review", "published", "archived"]).optional(),
});

const bust = () => revalidateTag(CACHE_TAGS.pages, "default");

function readForm(fd: FormData) {
  return {
    slug: fd.get("slug"),
    title: fd.get("title"),
    route: fd.get("route"),
    summary: fd.get("summary"),
    status: fd.get("status") || "published",
  };
}

export async function createPage(fd: FormData) {
  await requireAdmin();
  const parsed = pageInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.pages).values({
    slug: parsed.data.slug,
    title: parsed.data.title,
    route: parsed.data.route,
    summary: parsed.data.summary ?? null,
    status: parsed.data.status ?? "published",
    published: parsed.data.status === "published",
  });
  bust();
  redirect("/admin/pages");
}

export async function updatePage(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = pageInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.pages)
    .set({
      slug: parsed.data.slug,
      title: parsed.data.title,
      route: parsed.data.route,
      summary: parsed.data.summary ?? null,
      status: parsed.data.status ?? "published",
      published: parsed.data.status === "published",
    })
    .where(eq(schema.pages.id, id));
  bust();
  redirect("/admin/pages");
}

export async function softDeletePage(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.pages)
    .set({ deletedAt: sql`now()`, status: "archived", published: false })
    .where(eq(schema.pages.id, id));
  bust();
}
