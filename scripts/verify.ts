import { getPool, endPool } from "./_tidb";

async function main() {
  const pool = getPool();

  const [versionRows] = (await pool.query("SELECT VERSION() AS v")) as [
    Array<{ v: string }>,
    unknown,
  ];
  console.log("Server version:", versionRows[0]?.v ?? "unknown");

  const [tableRows] = (await pool.query(
    `SELECT TABLE_NAME AS table_name
     FROM information_schema.tables
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
     ORDER BY TABLE_NAME`,
  )) as [Array<{ table_name: string }>, unknown];

  console.log(`\ntables (${tableRows.length}):`);
  for (const r of tableRows) console.log("  -", r.table_name);
}

main()
  .then(() => endPool())
  .catch(async (e) => {
    console.error(e);
    await endPool();
    process.exit(1);
  });
