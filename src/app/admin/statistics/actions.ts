"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const statInput = z.object({
  key: z.string().trim().min(2).max(80).regex(/^[a-z0-9_]+$/, "lowercase, digits, underscores only"),
  label: z.string().trim().min(2).max(200),
  value: z.string().trim().min(1).max(80),
  suffix: z.string().trim().max(20).optional().nullable(),
  description: z.string().trim().max(500).optional().nullable(),
  icon: z.string().trim().max(80).optional().nullable(),
  scope: z.enum(["global", "impact", "drais", "xhaira", "jeton", "consty"]).optional(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(["published", "draft"]).optional(),
});

const bust = () => revalidateTag(CACHE_TAGS.statistics, "default");

function readForm(fd: FormData) {
  return {
    key: fd.get("key"),
    label: fd.get("label"),
    value: fd.get("value"),
    suffix: fd.get("suffix"),
    description: fd.get("description"),
    icon: fd.get("icon"),
    scope: fd.get("scope") || "global",
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status") || "published",
  };
}

export async function createStat(fd: FormData) {
  await requireAdmin();
  const parsed = statInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.statistics).values({
    key: parsed.data.key,
    label: parsed.data.label,
    value: parsed.data.value,
    suffix: parsed.data.suffix ?? null,
    description: parsed.data.description ?? null,
    icon: parsed.data.icon ?? null,
    scope: parsed.data.scope ?? "global",
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
  });
  bust();
  redirect("/admin/statistics");
}

export async function updateStat(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = statInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  // Note: `key` cannot be edited after creation — the frontend depends on it.
  // We ignore parsed.data.key here and use the existing row's key.
  const [existing] = await db
    .select({ key: schema.statistics.key })
    .from(schema.statistics)
    .where(eq(schema.statistics.id, id))
    .limit(1);
  if (!existing) throw new Error("not_found");
  await db
    .update(schema.statistics)
    .set({
      label: parsed.data.label,
      value: parsed.data.value,
      suffix: parsed.data.suffix ?? null,
      description: parsed.data.description ?? null,
      icon: parsed.data.icon ?? null,
      scope: parsed.data.scope ?? "global",
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
    })
    .where(eq(schema.statistics.id, id));
  bust();
  redirect("/admin/statistics");
}

export async function toggleStatPublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.statistics).set({ published: next }).where(eq(schema.statistics.id, id));
  bust();
}

export async function deleteStat(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.delete(schema.statistics).where(eq(schema.statistics.id, id));
  bust();
}
