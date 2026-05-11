"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";

async function requireAdmin() {
  const c = await cookies();
  const s = await verifySession(c.get(SESSION_COOKIE)?.value);
  if (!s) throw new Error("unauthorized");
}

const faqInput = z.object({
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "lowercase, digits, hyphens only"),
  question: z.string().trim().min(3).max(1000),
  answer: z.string().trim().min(5).max(8000),
  category: z.string().trim().max(80).optional().nullable(),
  keywordsText: z.string().trim().max(2000).optional().nullable(),
  scope: z.enum(["public", "internal"]).default("public"),
  published: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

function bust() {
  revalidateTag(CACHE_TAGS.faqs, "default");
  revalidateTag(CACHE_TAGS.aiDocs, "default");
}

function fromForm(fd: FormData) {
  return {
    slug: fd.get("slug"),
    question: fd.get("question"),
    answer: fd.get("answer"),
    category: fd.get("category"),
    keywordsText: fd.get("keywordsText"),
    scope: fd.get("scope") ?? "public",
    published: fd.get("published") === "on",
    sortOrder: fd.get("sortOrder"),
  };
}

function parseKeywords(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[\n,]/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0)
    .slice(0, 30);
}

export async function createFaq(fd: FormData) {
  await requireAdmin();
  const parsed = faqInput.safeParse(fromForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.faqs).values({
    slug: parsed.data.slug,
    question: parsed.data.question,
    answer: parsed.data.answer,
    category: parsed.data.category ?? null,
    keywords: parseKeywords(parsed.data.keywordsText),
    scope: parsed.data.scope,
    published: parsed.data.published ?? true,
    sortOrder: parsed.data.sortOrder ?? 0,
  });
  bust();
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = faqInput.safeParse(fromForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.faqs)
    .set({
      slug: parsed.data.slug,
      question: parsed.data.question,
      answer: parsed.data.answer,
      category: parsed.data.category ?? null,
      keywords: parseKeywords(parsed.data.keywordsText),
      scope: parsed.data.scope,
      published: parsed.data.published ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .where(eq(schema.faqs.id, id));
  bust();
  redirect("/admin/faqs");
}

export async function toggleFaqPublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.faqs).set({ published: next }).where(eq(schema.faqs.id, id));
  bust();
}

export async function softDeleteFaq(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.faqs)
    .set({ deletedAt: sql`now()`, published: false })
    .where(eq(schema.faqs.id, id));
  bust();
}
