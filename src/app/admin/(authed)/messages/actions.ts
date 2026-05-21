"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db, schema } from "@/lib/db";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";

async function requireAdmin() {
  const c = await cookies();
  const s = await verifySession(c.get(SESSION_COOKIE)?.value);
  if (!s) throw new Error("unauthorized");
}

const VALID_STATUSES = new Set(["new", "in_progress", "replied", "archived"]);

export async function setMessageStatus(id: string, status: string) {
  await requireAdmin();
  if (!VALID_STATUSES.has(status)) throw new Error("invalid_status");
  if (!db) throw new Error("db_unavailable");
  await db
    .update(schema.contactMessages)
    .set({ status })
    .where(eq(schema.contactMessages.id, id));
  revalidatePath("/admin/messages");
}
