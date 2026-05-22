/**
 * Bootstrap or reset an admin user on TiDB.
 *
 * Usage:
 *   npm run db:create-admin -- <email> <password> [name]
 *
 * If the email already exists, the password is reset, the name is
 * updated, and all sessions for the user are invalidated.
 */
import { randomUUID } from "node:crypto";
import { getPool, endPool } from "./_tidb";

const ITERATIONS = 210_000;
const KEY_LEN_BITS = 256;
const SALT_LEN_BYTES = 16;

function b64encode(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
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
    console.error(
      "Usage: tsx scripts/create-admin.ts <email> <password> [name]",
    );
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

  const pool = getPool();
  const passwordHash = await hashPassword(passwordArg);

  const [rows] = (await pool.query(
    "SELECT id FROM admin_users WHERE email = ?",
    [email],
  )) as [Array<{ id: string }>, unknown];

  if (Array.isArray(rows) && rows.length > 0) {
    const userId = rows[0].id;
    await pool.query(
      "UPDATE admin_users SET password_hash = ?, name = COALESCE(?, name), updated_at = CURRENT_TIMESTAMP(3) WHERE email = ?",
      [passwordHash, name, email],
    );
    await pool.query("DELETE FROM admin_sessions WHERE user_id = ?", [userId]);
    console.log(
      `[create-admin] reset password for ${email} (all sessions invalidated)`,
    );
  } else {
    const newId = randomUUID();
    await pool.query(
      `INSERT INTO admin_users (id, email, password_hash, name, role)
       VALUES (?, ?, ?, ?, 'admin')`,
      [newId, email, passwordHash, name],
    );
    console.log(`[create-admin] created admin ${email}  id=${newId}`);
  }
}

main()
  .then(() => endPool())
  .catch(async (err) => {
    console.error("[create-admin] failed:", err.message ?? err);
    await endPool();
    process.exit(1);
  });
