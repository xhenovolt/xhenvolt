import { getPool, endPool } from "./_tidb";

const TABLES = [
  "settings",
  "navigation_links",
  "footer_links",
  "social_links",
  "hero_slides",
  "announcements",
  "systems",
  "system_features",
  "system_screenshots",
  "services",
  "clients",
  "partners",
  "testimonials",
  "statistics",
  "timeline_entries",
  "team_members",
  "technologies",
  "faqs",
  "ai_training_documents",
  "ai_conversation_logs",
  "contact_messages",
  "careers",
  "seo_metadata",
  "pages",
  "sections",
  "categories",
  "tags",
  "gallery_images",
  "media_assets",
  "admin_users",
  "admin_sessions",
  "admin_audit_logs",
];

async function main() {
  const pool = getPool();
  console.log("Row counts:");
  for (const t of TABLES) {
    try {
      const [rows] = (await pool.query(
        `SELECT COUNT(*) AS c FROM \`${t}\``,
      )) as [Array<{ c: number }>, unknown];
      console.log(`  ${t.padEnd(28)} ${rows[0]?.c ?? 0}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ${t.padEnd(28)} (missing) ${msg.slice(0, 80)}`);
    }
  }
}

main()
  .then(() => endPool())
  .catch(async (e) => {
    console.error(e);
    await endPool();
    process.exit(1);
  });
