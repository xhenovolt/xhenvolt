"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const navigationInput = z.object({
  label: z.string().trim().min(2).max(120),
  href: z.string().trim().min(1).max(240),
  target: z.enum(["_self", "_blank"]).optional(),
  location: z.string().trim().min(1).max(40).optional(),
  parentId: z.string().uuid().optional().nullable(),
  description: z.string().trim().max(500).optional().nullable(),
  isExternal: z.preprocess(
    (val) => val === "on" || val === "true" || val === true,
    z.boolean().optional(),
  ),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(["published", "draft"]).optional(),
});

function readForm(fd: FormData) {
  return {
    label: fd.get("label"),
    href: fd.get("href"),
    target: fd.get("target"),
    location: fd.get("location") || "primary",
    parentId: fd.get("parentId"),
    description: fd.get("description"),
    isExternal: fd.get("isExternal"),
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status"),
  };
}

const bust = () => revalidateTag(CACHE_TAGS.navigation, "default");

export async function createNavigation(fd: FormData) {
  await requireAdmin();
  const parsed = navigationInput.safeParse(readForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  if (!db) throw new Error("db_unavailable");

  await db.insert(schema.navigationLinks).values({
    label: parsed.data.label,
    href: parsed.data.href,
    target: parsed.data.target ?? (parsed.data.isExternal ? "_blank" : "_self"),
    location: parsed.data.location ?? "primary",
    parentId: parsed.data.parentId ?? null,
    description: parsed.data.description ?? null,
    isExternal: parsed.data.isExternal ?? false,
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
  });
  bust();
  redirect("/admin/navigation");
}

export async function updateNavigation(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = navigationInput.safeParse(readForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  if (!db) throw new Error("db_unavailable");

  await db
    .update(schema.navigationLinks)
    .set({
      label: parsed.data.label,
      href: parsed.data.href,
      target: parsed.data.target ?? (parsed.data.isExternal ? "_blank" : "_self"),
      location: parsed.data.location ?? "primary",
      parentId: parsed.data.parentId ?? null,
      description: parsed.data.description ?? null,
      isExternal: parsed.data.isExternal ?? false,
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
    })
    .where(eq(schema.navigationLinks.id, id));
  bust();
  redirect("/admin/navigation");
}

export async function toggleNavigationPublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.navigationLinks).set({ published: next }).where(eq(schema.navigationLinks.id, id));
  bust();
}

export async function deleteNavigation(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.delete(schema.navigationLinks).where(eq(schema.navigationLinks.id, id));
  bust();
}
