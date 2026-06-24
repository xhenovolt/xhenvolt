import Link from "next/link";
import { db, schema, hasDb } from "@/lib/db";
import { count } from "drizzle-orm";
import type { MySqlTable } from "drizzle-orm/mysql-core";

export const dynamic = "force-dynamic";

interface CardDef {
  label: string;
  table: MySqlTable;
  tableName: string;
  /** null = informational stat with no dedicated admin page yet (not a link). */
  href: string | null;
}

const CARDS: CardDef[] = [
  { label: "Testimonials", table: schema.testimonials, tableName: "testimonials", href: "/admin/testimonials" },
  { label: "FAQs", table: schema.faqs, tableName: "faqs", href: "/admin/faqs" },
  { label: "Systems", table: schema.systems, tableName: "systems", href: "/admin/systems" },
  { label: "AI Training Docs", table: schema.aiTrainingDocuments, tableName: "ai_training_documents", href: "/admin/ai-docs" },
  { label: "Clients", table: schema.clients, tableName: "clients", href: "/admin/clients" },
  { label: "Statistics", table: schema.statistics, tableName: "statistics", href: "/admin/statistics" },
  { label: "Team Members", table: schema.teamMembers, tableName: "team_members", href: "/admin/team" },
  { label: "Timeline Entries", table: schema.timelineEntries, tableName: "timeline_entries", href: "/admin/timeline" },
  { label: "Contact Messages", table: schema.contactMessages, tableName: "contact_messages", href: "/admin/messages" },
  // No dedicated viewer yet — render as a non-clickable stat (honest, no dead link).
  { label: "AI Conversation Logs", table: schema.aiConversationLogs, tableName: "ai_conversation_logs", href: null },
];

async function safeCount(table: MySqlTable): Promise<number | "—"> {
  if (!hasDb() || !db) return "—";
  try {
    const r = await Promise.race([
      db.select({ c: count() }).from(table),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 4000)),
    ]);
    return Number((r as Array<{ c: number }>)[0]?.c ?? 0);
  } catch {
    return "—";
  }
}

export default async function AdminDashboard() {
  const counts = await Promise.all(CARDS.map((c) => safeCount(c.table)));
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Content overview. Everything visible on the live site is sourced from these tables.
        </p>
      </div>

      <Link
        href="/admin/site-map"
        className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 p-5 transition-colors hover:bg-blue-100"
      >
        <div>
          <div className="text-sm font-semibold text-blue-900">
            Not sure where to edit something on the website?
          </div>
          <div className="mt-0.5 text-sm text-blue-800">
            Open the <strong>Content Map</strong> — it lists every page and links straight to the
            screen that edits each part (e.g. the footer address).
          </div>
        </div>
        <span className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Open Content Map →
        </span>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c, i) => {
          const inner = (
            <>
              <div className="text-xs uppercase tracking-wide text-slate-500">{c.label}</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{counts[i]}</div>
              <div className="mt-1 text-xs text-slate-400 font-mono">{c.tableName}</div>
            </>
          );
          return c.href ? (
            <Link
              key={c.label}
              href={c.href}
              className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={c.label}
              className="block bg-white rounded-xl border border-slate-200 p-5 opacity-90"
              title="No dedicated admin page yet"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
