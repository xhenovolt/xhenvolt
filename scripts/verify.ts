import "dotenv/config";
import { config } from "dotenv";
import { neonClient } from "./neon-http";

config({ path: ".env.local" });

async function main() {
  const client = neonClient(process.env.DATABASE_URL!);
  const res = await client.exec<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
     ORDER BY table_name`,
  );
  console.log(`tables (${res.rows.length}):`);
  for (const r of res.rows) console.log("  -", r.table_name);

  const ext = await client.exec<{ extname: string }>(
    `SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto', 'vector') ORDER BY extname`,
  );
  console.log("\nextensions:");
  for (const r of ext.rows) console.log("  -", r.extname);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
