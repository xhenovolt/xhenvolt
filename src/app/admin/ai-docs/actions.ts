"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const docInput = z.object({
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "lowercase, digits, hyphens only"),
  title: z.string().trim().min(2).max(240),
  category: z.string().trim().max(80).optional().nullable(),
  source: z.string().trim().max(120).optional().nullable(),
  summary: z.string().trim().max(1000).optional().nullable(),
  content: z.string().trim().min(20).max(20000),
  keywordsText: z.string().trim().max(2000).optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(["published", "draft"]).optional(),
});

const bust = () => revalidateTag(CACHE_TAGS.aiDocs, "default");

function readForm(fd: FormData) {
  return {
    slug: fd.get("slug"),
    title: fd.get("title"),
    category: fd.get("category"),
    source: fd.get("source"),
    summary: fd.get("summary"),
    content: fd.get("content"),
    keywordsText: fd.get("keywordsText"),
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status") || "published",
  };
}

function parseKeywords(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[\n,]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 30);
}

function estimateTokens(content: string): number {
  // Rough heuristic — 1 token ≈ 4 chars. Good enough for an admin display.
  return Math.ceil(content.length / 4);
}

export async function createAiDoc(fd: FormData) {
  await requireAdmin();
  const parsed = docInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.aiTrainingDocuments).values({
    slug: parsed.data.slug,
    title: parsed.data.title,
    category: parsed.data.category ?? null,
    source: parsed.data.source ?? null,
    summary: parsed.data.summary ?? null,
    content: parsed.data.content,
    keywords: parseKeywords(parsed.data.keywordsText),
    tokenEstimate: estimateTokens(parsed.data.content),
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
  });
  bust();
  redirect("/admin/ai-docs");
}

export async function updateAiDoc(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = docInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.aiTrainingDocuments)
    .set({
      slug: parsed.data.slug,
      title: parsed.data.title,
      category: parsed.data.category ?? null,
      source: parsed.data.source ?? null,
      summary: parsed.data.summary ?? null,
      content: parsed.data.content,
      keywords: parseKeywords(parsed.data.keywordsText),
      tokenEstimate: estimateTokens(parsed.data.content),
      // Embedding is invalidated whenever content changes — null it so the
      // next ingestion pass regenerates it.
      embedding: null,
      embeddingModel: null,
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
    })
    .where(eq(schema.aiTrainingDocuments.id, id));
  bust();
  redirect("/admin/ai-docs");
}

export async function toggleAiDocPublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.aiTrainingDocuments).set({ published: next }).where(eq(schema.aiTrainingDocuments.id, id));
  bust();
}

export async function softDeleteAiDoc(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.aiTrainingDocuments)
    .set({ deletedAt: sql`now()`, published: false })
    .where(eq(schema.aiTrainingDocuments.id, id));
  bust();
}
