import "dotenv/config";
import { config } from "dotenv";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { neonClient } from "./neon-http";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const client = neonClient(url);

  await client.exec(`CREATE TABLE IF NOT EXISTS __migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);

  const dir = "./drizzle";
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const existing = await client.exec(
      "SELECT 1 FROM __migrations WHERE name = $1",
      [file],
    );
    if (existing.rows.length > 0) {
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
        await client.exec(stmt);
      } catch (err) {
        console.error(
          `[migrate] FAILED stmt in ${file}:\n${stmt.slice(0, 200)}\n`,
        );
        throw err;
      }
    }
    await client.exec("INSERT INTO __migrations (name) VALUES ($1)", [file]);
    console.log(`[migrate] applied: ${file}`);
  }

  console.log("[migrate] done.");
}

main().catch((err) => {
  console.error("[migrate] failed:", err.message ?? err);
  process.exit(1);
});
