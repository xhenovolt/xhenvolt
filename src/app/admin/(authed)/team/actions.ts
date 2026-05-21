"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const memberInput = z.object({
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/, "lowercase, digits, hyphens only"),
  name: z.string().trim().min(2).max(200),
  role: z.string().trim().min(2).max(200),
  bio: z.string().trim().max(2000).optional().nullable(),
  avatarUrl: z.string().trim().max(500).optional().nullable(),
  email: z.string().trim().max(240).optional().nullable(),
  location: z.string().trim().max(160).optional().nullable(),
  linkedin: z.string().trim().max(500).optional().nullable(),
  twitter: z.string().trim().max(500).optional().nullable(),
  github: z.string().trim().max(500).optional().nullable(),
  specialtiesText: z.string().trim().max(1000).optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(["published", "draft"]).optional(),
});

const bust = () => revalidateTag(CACHE_TAGS.team, "default");

function readForm(fd: FormData) {
  return {
    slug: fd.get("slug"),
    name: fd.get("name"),
    role: fd.get("role"),
    bio: fd.get("bio"),
    avatarUrl: fd.get("avatarUrl"),
    email: fd.get("email"),
    location: fd.get("location"),
    linkedin: fd.get("linkedin"),
    twitter: fd.get("twitter"),
    github: fd.get("github"),
    specialtiesText: fd.get("specialtiesText"),
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status") || "published",
  };
}

function parseSpecialties(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function buildSocials(d: { linkedin?: string | null; twitter?: string | null; github?: string | null }) {
  const out: Record<string, string> = {};
  if (d.linkedin) out.linkedin = d.linkedin;
  if (d.twitter) out.twitter = d.twitter;
  if (d.github) out.github = d.github;
  return out;
}

export async function createMember(fd: FormData) {
  await requireAdmin();
  const parsed = memberInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.teamMembers).values({
    slug: parsed.data.slug,
    name: parsed.data.name,
    role: parsed.data.role,
    bio: parsed.data.bio ?? null,
    avatarUrl: parsed.data.avatarUrl ?? null,
    email: parsed.data.email ?? null,
    location: parsed.data.location ?? null,
    specialties: parseSpecialties(parsed.data.specialtiesText),
    socials: buildSocials(parsed.data),
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
  });
  bust();
  redirect("/admin/team");
}

export async function updateMember(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = memberInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.teamMembers)
    .set({
      slug: parsed.data.slug,
      name: parsed.data.name,
      role: parsed.data.role,
      bio: parsed.data.bio ?? null,
      avatarUrl: parsed.data.avatarUrl ?? null,
      email: parsed.data.email ?? null,
      location: parsed.data.location ?? null,
      specialties: parseSpecialties(parsed.data.specialtiesText),
      socials: buildSocials(parsed.data),
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
    })
    .where(eq(schema.teamMembers.id, id));
  bust();
  redirect("/admin/team");
}

export async function toggleMemberPublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.teamMembers).set({ published: next }).where(eq(schema.teamMembers.id, id));
  bust();
}

export async function softDeleteMember(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.teamMembers)
    .set({ deletedAt: sql`now()`, published: false })
    .where(eq(schema.teamMembers.id, id));
  bust();
}
