"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache/safe";
import { requireAdmin } from "@/lib/auth/guard";

const timelineInput = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(5).max(2000),
  occurredOn: z.string().trim().min(8).max(20),
  label: z.string().trim().max(80).optional().nullable(),
  icon: z.string().trim().max(80).optional().nullable(),
  accentColor: z.string().trim().max(30).optional().nullable(),
  highlight: z.coerce.boolean().optional(),
  eventsJson: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(["published", "draft"]).optional(),
});

const bust = () => revalidateTag(CACHE_TAGS.timeline, "default");

function readForm(fd: FormData) {
  return {
    title: fd.get("title"),
    description: fd.get("description"),
    occurredOn: fd.get("occurredOn"),
    label: fd.get("label"),
    icon: fd.get("icon"),
    accentColor: fd.get("accentColor"),
    highlight: fd.get("highlight") === "on",
    eventsJson: fd.get("eventsJson"),
    sortOrder: fd.get("sortOrder"),
    status: fd.get("status") || "published",
  };
}

function parseEvents(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as Array<{ label?: string } | string>;
    return parsed
      .map((it) => (typeof it === "string" ? it : it.label ?? ""))
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function createTimeline(fd: FormData) {
  await requireAdmin();
  const parsed = timelineInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db.insert(schema.timelineEntries).values({
    title: parsed.data.title,
    description: parsed.data.description,
    occurredOn: parsed.data.occurredOn,
    label: parsed.data.label ?? null,
    icon: parsed.data.icon ?? null,
    accentColor: parsed.data.accentColor ?? null,
    highlight: Boolean(parsed.data.highlight),
    events: parseEvents(parsed.data.eventsJson),
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.status !== "draft",
  });
  bust();
  redirect("/admin/timeline");
}

export async function updateTimeline(id: string, fd: FormData) {
  await requireAdmin();
  const parsed = timelineInput.safeParse(readForm(fd));
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.timelineEntries)
    .set({
      title: parsed.data.title,
      description: parsed.data.description,
      occurredOn: parsed.data.occurredOn,
      label: parsed.data.label ?? null,
      icon: parsed.data.icon ?? null,
      accentColor: parsed.data.accentColor ?? null,
      highlight: Boolean(parsed.data.highlight),
      events: parseEvents(parsed.data.eventsJson),
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.status !== "draft",
    })
    .where(eq(schema.timelineEntries.id, id));
  bust();
  redirect("/admin/timeline");
}

export async function toggleTimelinePublished(id: string, next: boolean) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.update(schema.timelineEntries).set({ published: next }).where(eq(schema.timelineEntries.id, id));
  bust();
}

export async function deleteTimeline(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.delete(schema.timelineEntries).where(eq(schema.timelineEntries.id, id));
  bust();
}
