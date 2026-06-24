/**
 * One-time, idempotent migration: move legacy newsletter signups that were
 * stored as contact_messages (source="newsletter") into the new `subscribers`
 * table, then remove them from the Inbox.
 *
 *   npx tsx scripts/migrate-newsletter-to-subscribers.ts
 *
 * Safe to re-run: subscribers upsert on email; once source rows are deleted a
 * re-run simply finds nothing.
 */
import { randomUUID } from "node:crypto";
import { getPool, endPool } from "./_tidb";

interface MsgRow {
  id: string;
  name: string | null;
  email: string;
  metadata: unknown;
  ip_hash: string | null;
  user_agent: string | null;
}

async function main() {
  const pool = getPool();
  const [rows] = (await pool.query(
    "SELECT id, name, email, metadata, ip_hash, user_agent FROM contact_messages WHERE source = 'newsletter'",
  )) as [MsgRow[], unknown];

  if (rows.length === 0) {
    console.log("[migrate-subscribers] no legacy newsletter rows found. Nothing to do.");
    return;
  }

  let migrated = 0;
  for (const r of rows) {
    const email = (r.email ?? "").toLowerCase().trim();
    if (!email) continue;
    let interests: string[] = [];
    try {
      const meta = typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata;
      if (meta && Array.isArray((meta as { interests?: unknown }).interests)) {
        interests = (meta as { interests: string[] }).interests;
      }
    } catch {
      /* ignore malformed metadata */
    }

    await pool.query(
      `INSERT INTO subscribers (id, email, name, status, interests, source, ip_hash, user_agent)
       VALUES (?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), interests = VALUES(interests),
         status = 'subscribed', updated_at = CURRENT_TIMESTAMP(3)`,
      [
        randomUUID(),
        email,
        r.name ?? null,
        "subscribed",
        JSON.stringify(interests),
        "newsletter",
        r.ip_hash ?? null,
        r.user_agent ?? null,
      ],
    );
    await pool.query("DELETE FROM contact_messages WHERE id = ?", [r.id]);
    migrated++;
  }

  console.log(`[migrate-subscribers] migrated ${migrated} newsletter signup(s) into subscribers and removed them from the Inbox.`);
}

main()
  .then(() => endPool())
  .catch(async (err) => {
    console.error("[migrate-subscribers] failed:", err.message ?? err);
    await endPool();
    process.exit(1);
  });
