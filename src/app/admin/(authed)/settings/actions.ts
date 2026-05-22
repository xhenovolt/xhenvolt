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

const contactSchema = z.object({
  address: z.string().trim().min(1).max(240),
  email: z.string().trim().email().max(240),
  secondaryEmail: z.string().trim().max(240).optional().nullable(),
  hours: z.string().trim().max(200).optional().nullable(),
  phonesText: z.string().trim().min(1).max(400),
});

const whatsappSchema = z.object({
  number: z.string().trim().min(8).max(20),
  prefilledMessage: z.string().trim().min(5).max(500),
  tooltip: z.string().trim().min(5).max(500),
});

const aiSchema = z.object({
  name: z.string().trim().min(2).max(80),
  introMessage: z.string().trim().min(5).max(1000),
  fallbackMessage: z.string().trim().min(5).max(1000),
  suggestionsText: z.string().trim().max(2000).optional().nullable(),
});

function bust() {
  revalidateTag(CACHE_TAGS.settings, "default");
  revalidateTag(CACHE_TAGS.footer, "default");
}

async function upsertSetting(key: string, value: unknown, description: string) {
  if (!db) throw new Error("db_unavailable");
  await db
    .insert(schema.settings)
    .values({ key, value, description })
    .onDuplicateKeyUpdate({
      set: { value, description, updatedAt: sql`CURRENT_TIMESTAMP(3)` },
    });
}

export async function saveContact(fd: FormData) {
  await requireAdmin();
  const parsed = contactSchema.safeParse({
    address: fd.get("address"),
    email: fd.get("email"),
    secondaryEmail: fd.get("secondaryEmail"),
    hours: fd.get("hours"),
    phonesText: fd.get("phonesText"),
  });
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));

  const phones = parsed.data.phonesText
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 10);

  await upsertSetting(
    "contact",
    {
      address: parsed.data.address,
      email: parsed.data.email,
      secondaryEmail: parsed.data.secondaryEmail || undefined,
      hours: parsed.data.hours || undefined,
      phones,
    },
    "Primary contact info",
  );
  bust();
  redirect("/admin/settings?saved=contact");
}

export async function saveWhatsapp(fd: FormData) {
  await requireAdmin();
  const parsed = whatsappSchema.safeParse({
    number: fd.get("number"),
    prefilledMessage: fd.get("prefilledMessage"),
    tooltip: fd.get("tooltip"),
  });
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));
  await upsertSetting(
    "whatsapp",
    {
      number: parsed.data.number.replace(/[^0-9]/g, ""),
      prefilledMessage: parsed.data.prefilledMessage,
      tooltip: parsed.data.tooltip,
    },
    "WhatsApp floating CTA config",
  );
  bust();
  redirect("/admin/settings?saved=whatsapp");
}

export async function saveAi(fd: FormData) {
  await requireAdmin();
  const parsed = aiSchema.safeParse({
    name: fd.get("name"),
    introMessage: fd.get("introMessage"),
    fallbackMessage: fd.get("fallbackMessage"),
    suggestionsText: fd.get("suggestionsText"),
  });
  if (!parsed.success) throw new Error("invalid: " + JSON.stringify(parsed.error.flatten()));

  const suggestions = (parsed.data.suggestionsText ?? "")
    .split(/\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 10);

  await upsertSetting(
    "ai_assistant",
    {
      name: parsed.data.name,
      introMessage: parsed.data.introMessage,
      fallbackMessage: parsed.data.fallbackMessage,
      suggestions,
    },
    "Xhenvolt AI assistant configuration",
  );
  bust();
  redirect("/admin/settings?saved=ai");
}

export async function bumpEq() {
  await requireAdmin();
  if (!db) return;
  await db.select().from(schema.settings).where(eq(schema.settings.key, "noop")).limit(1);
}
