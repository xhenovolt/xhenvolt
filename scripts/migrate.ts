/**
 * Run Drizzle-generated MySQL migrations against TiDB.
 *
 * Reads SQL files from ./drizzle/, splits on `--> statement-breakpoint`,
 * and applies each statement once. A `__migrations` table tracks which
 * files have been applied — re-running is safe and idempotent.
 *
 * Run `npm run db:generate` first to regenerate SQL from the schema.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getPool, endPool } from "./_tidb";

async function main() {
  const dir = "./drizzle";
  if (!existsSync(dir)) {
    console.error(
      "[migrate] ./drizzle/ does not exist. Run `npm run db:generate` first to produce MySQL migrations.",
    );
    process.exit(1);
  }
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  if (files.length === 0) {
    console.error(
      "[migrate] no .sql migration files found in ./drizzle/. Run `npm run db:generate`.",
    );
    process.exit(1);
  }

  const pool = getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS __migrations (
    name VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
  )`);

  for (const file of files) {
    const [rows] = (await pool.query(
      "SELECT 1 FROM __migrations WHERE name = ?",
      [file],
    )) as [unknown[], unknown];
    if (Array.isArray(rows) && rows.length > 0) {
      console.log(`[migrate] skip (already applied): ${file}`);
      continue;
    }

    const raw = readFileSync(join(dir, file), "utf8");
    const statements = raw
      .split(/-->\s*statement-breakpoint\s*/g)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`[migrate] applying ${file} (${statements.length} stmts)...`);
    for (const stmt of statements) {
      try {
        await pool.query(stmt);
      } catch (err) {
        console.error(
          `[migrate] FAILED stmt in ${file}:\n${stmt.slice(0, 300)}\n`,
        );
        throw err;
      }
    }
    await pool.query("INSERT INTO __migrations (name) VALUES (?)", [file]);
    console.log(`[migrate] applied: ${file}`);
  }

  console.log("[migrate] done.");
}

main()
  .then(() => endPool())
  .catch(async (err) => {
    console.error("[migrate] failed:", err.message ?? err);
    await endPool();
    process.exit(1);
  });
