import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { hashPassword, verifyPassword } from "./password";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export async function findAdminByEmail(
  email: string,
): Promise<{ id: string; email: string; passwordHash: string; name: string | null; role: string } | null> {
  if (!db) return null;
  const rows = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email.toLowerCase().trim()))
    .limit(1);
  return rows[0] ?? null;
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  const user = await findAdminByEmail(email);
  if (!user) {
    // Burn time on a dummy hash to keep timing consistent.
    await verifyPassword(
      password,
      "pbkdf2$210000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    );
    return null;
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  if (db) {
    db
      .update(schema.adminUsers)
      .set({ lastLoginAt: sql`now()` })
      .where(eq(schema.adminUsers.id, user.id))
      .catch(() => {});
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function createAdmin(input: {
  email: string;
  password: string;
  name?: string;
  role?: string;
}): Promise<AdminUser> {
  if (!db) throw new Error("db_unavailable");
  const passwordHash = await hashPassword(input.password);
  const id = randomUUID();
  const email = input.email.toLowerCase().trim();
  const name = input.name ?? null;
  const role = input.role ?? "admin";
  await db.insert(schema.adminUsers).values({
    id,
    email,
    passwordHash,
    name,
    role,
  });
  return { id, email, name, role };
}

export async function setAdminPassword(
  email: string,
  newPassword: string,
): Promise<boolean> {
  if (!db) throw new Error("db_unavailable");
  const passwordHash = await hashPassword(newPassword);
  const res = await db
    .update(schema.adminUsers)
    .set({ passwordHash })
    .where(eq(schema.adminUsers.email, email.toLowerCase().trim()));
  const header = res as unknown as { affectedRows?: number };
  return (header.affectedRows ?? 0) > 0;
}
