"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { SUBSCRIBER_STATUS } from "@/lib/db/schema/subscribers";

export async function setSubscriberStatus(id: string, next: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  const status = (SUBSCRIBER_STATUS as readonly string[]).includes(next)
    ? next
    : "subscribed";
  await db
    .update(schema.subscribers)
    .set({ status })
    .where(eq(schema.subscribers.id, id));
  revalidatePath("/admin/subscribers");
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  if (!db) throw new Error("db_unavailable");
  await db.delete(schema.subscribers).where(eq(schema.subscribers.id, id));
  revalidatePath("/admin/subscribers");
}
