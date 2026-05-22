"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { audit } from "@/lib/audit";

async function requireAdmin() {
  const c = await cookies();
  const s = await verifySession(c.get(SESSION_COOKIE)?.value);
  if (!s) throw new Error("unauthorized");
}

const testimonialInput = z.object({
  authorName: z.string().trim().min(2).max(160),
  authorRole: z.string().trim().max(200).optional().nullable(),
  organization: z.string().trim().max(200).optional().nullable(),
  location: z.string().trim().max(160).optional().nullable(),
  quote: z.string().trim().min(10).max(4000),
  rating: z.coerce.number().int().min(1).max(5),
  featured: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

function bust() {
  revalidateTag(CACHE_TAGS.testimonials, "default");
}

function fromForm(fd: FormData) {
  const obj: Record<string, FormDataEntryValue | boolean> = {};
  for (const [k, v] of fd.entries()) obj[k] = v;
  obj.featured = fd.get("featured") === "on";
  obj.published = fd.get("published") === "on";
  return obj;
}

export async function createTestimonial(fd: FormData) {
  await requireAdmin();
  const parsed = testimonialInput.safeParse(fromForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  if (!db) throw new Error("db_unavailable");
  const newId = randomUUID();
  await db.insert(schema.testimonials).values({
    id: newId,
    authorName: parsed.data.authorName,
    authorRole: parsed.data.authorRole ?? null,
    organization: parsed.data.organization ?? null,
    location: parsed.data.location ?? null,
    quote: parsed.data.quote,
    rating: parsed.data.rating,
    featured: parsed.data.featured ?? false,
    published: parsed.data.published ?? true,
    sortOrder: parsed.data.sortOrder ?? 0,
  });
  bust();
  await audit({
    action: "create",
    entityType: "testimonial",
    entityId: newId,
    summary: `Created testimonial from ${parsed.data.authorName}`,
  });
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = testimonialInput.safeParse(fromForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.testimonials)
    .set({
      authorName: parsed.data.authorName,
      authorRole: parsed.data.authorRole ?? null,
      organization: parsed.data.organization ?? null,
      location: parsed.data.location ?? null,
      quote: parsed.data.quote,
      rating: parsed.data.rating,
      featured: parsed.data.featured ?? false,
      published: parsed.data.published ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .where(eq(schema.testimonials.id, id));
  bust();
  await audit({
    action: "update",
    entityType: "testimonial",
    entityId: id,
    summary: `Updated testimonial from ${parsed.data.authorName}`,
  });
  redirect("/admin/testimonials");
}

export async function togglePublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.testimonials)
    .set({ published: next })
    .where(eq(schema.testimonials.id, id));
  bust();
  await audit({
    action: next ? "publish" : "unpublish",
    entityType: "testimonial",
    entityId: id,
  });
}

export async function softDeleteTestimonial(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.testimonials)
    .set({ deletedAt: sql`now()`, published: false })
    .where(eq(schema.testimonials.id, id));
  bust();
  await audit({
    action: "delete",
    entityType: "testimonial",
    entityId: id,
  });
}
