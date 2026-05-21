"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const footerInput = z.object({
  label: z.string().trim().min(2).max(120),
  href: z.string().trim().min(1).max(240),
  column: z.string().trim().min(2).max(80).optional(),
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
    column: fd.get("column"),
    isExternal: fd.get("isExternal"),
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status"),
  };
}

const bust = () => revalidateTag(CACHE_TAGS.footer, "default");

export async function createFooterLink(fd: FormData) {
  await requireAdmin();
  const parsed = footerInput.safeParse(readForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  if (!db) throw new Error("db_unavailable");

  await db.insert(schema.footerLinks).values({
    label: parsed.data.label,
    href: parsed.data.href,
    column: parsed.data.column ?? "Company",
    isExternal: parsed.data.isExternal ?? false,
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
  });
  bust();
  redirect("/admin/footer");
}

export async function updateFooterLink(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = footerInput.safeParse(readForm(fd));
  if (!parsed.success) {
    throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  }
  if (!db) throw new Error("db_unavailable");

  await db
    .update(schema.footerLinks)
    .set({
      label: parsed.data.label,
      href: parsed.data.href,
      column: parsed.data.column ?? "Company",
      isExternal: parsed.data.isExternal ?? false,
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
    })
    .where(eq(schema.footerLinks.id, id));
  bust();
  redirect("/admin/footer");
}

export async function toggleFooterPublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.footerLinks).set({ published: next }).where(eq(schema.footerLinks.id, id));
  bust();
}

export async function deleteFooterLink(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.delete(schema.footerLinks).where(eq(schema.footerLinks.id, id));
  bust();
}
