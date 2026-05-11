import "dotenv/config";
import { config } from "dotenv";
import { neonClient } from "./neon-http";

config({ path: ".env.local" });

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
];

async function main() {
  const client = neonClient(process.env.DATABASE_URL!);
  console.log("Row counts:");
  for (const t of TABLES) {
    const r = await client.exec<{ c: string }>(
      `SELECT count(*)::text AS c FROM "${t}"`,
    );
    console.log(`  ${t.padEnd(28)} ${r.rows[0].c}`);
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
