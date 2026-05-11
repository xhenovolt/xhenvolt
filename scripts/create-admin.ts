/**
 * Bootstrap or reset an admin user.
 *
 * Usage:
 *   npm run db:create-admin -- <email> <password> [name]
 *
 * If the email already exists, the password is reset and the name is updated.
 */
import "dotenv/config";
import { config } from "dotenv";
import { setDefaultResultOrder } from "node:dns";
import { neonClient } from "./neon-http";

setDefaultResultOrder("ipv4first");
config({ path: ".env.local" });

const ITERATIONS = 210_000;
const KEY_LEN_BITS = 256;
const SALT_LEN_BYTES = 16;

function b64encode(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    KEY_LEN_BITS,
  );
  return new Uint8Array(bits);
}

async function hashPassword(plain: string): Promise<string> {
  const salt = new Uint8Array(SALT_LEN_BYTES);
  crypto.getRandomValues(salt);
  const derived = await pbkdf2(plain, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${b64encode(salt)}$${b64encode(derived)}`;
}

async function main() {
  const [, , emailArg, passwordArg, ...nameParts] = process.argv;
  if (!emailArg || !passwordArg) {
    console.error("Usage: tsx scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }
  const email = emailArg.toLowerCase().trim();
  if (!/^.+@.+\..+$/.test(email)) {
    console.error("Invalid email format.");
    process.exit(1);
  }
  if (passwordArg.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }
  const name = nameParts.join(" ") || null;

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  const client = neonClient(process.env.DATABASE_URL);
  const passwordHash = await hashPassword(passwordArg);

  const existing = await client.exec<{ id: string }>(
    "SELECT id FROM admin_users WHERE email = $1",
    [email],
  );

  if (existing.rows.length > 0) {
    await client.exec(
      "UPDATE admin_users SET password_hash = $1, name = COALESCE($2, name), updated_at = now() WHERE email = $3",
      [passwordHash, name, email],
    );
    // Wipe any existing sessions for this user.
    await client.exec(
      "DELETE FROM admin_sessions WHERE user_id = $1",
      [existing.rows[0].id],
    );
    console.log(`[create-admin] reset password for ${email} (all sessions invalidated)`);
  } else {
    const r = await client.exec<{ id: string }>(
      `INSERT INTO admin_users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'admin') RETURNING id`,
      [email, passwordHash, name],
    );
    console.log(`[create-admin] created admin ${email}  id=${r.rows[0].id}`);
  }
}

main().catch((err) => {
  console.error("[create-admin] failed:", err.message ?? err);
  process.exit(1);
});
