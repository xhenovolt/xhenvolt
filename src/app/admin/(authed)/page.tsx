import Link from "next/link";
import { db, schema, hasDb } from "@/lib/db";
import { count } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

export const dynamic = "force-dynamic";

interface CardDef {
  label: string;
  table: PgTable;
  tableName: string;
  href: string;
}

const CARDS: CardDef[] = [
  { label: "Testimonials", table: schema.testimonials, tableName: "testimonials", href: "/admin/testimonials" },
  { label: "FAQs", table: schema.faqs, tableName: "faqs", href: "/admin/faqs" },
  { label: "Systems", table: schema.systems, tableName: "systems", href: "/admin/systems" },
  { label: "AI Training Docs", table: schema.aiTrainingDocuments, tableName: "ai_training_documents", href: "/admin/ai-docs" },
  { label: "Clients", table: schema.clients, tableName: "clients", href: "/admin" },
  { label: "Statistics", table: schema.statistics, tableName: "statistics", href: "/admin" },
  { label: "Team Members", table: schema.teamMembers, tableName: "team_members", href: "/admin" },
  { label: "Timeline Entries", table: schema.timelineEntries, tableName: "timeline_entries", href: "/admin" },
  { label: "Contact Messages", table: schema.contactMessages, tableName: "contact_messages", href: "/admin/messages" },
  { label: "AI Conversation Logs", table: schema.aiConversationLogs, tableName: "ai_conversation_logs", href: "/admin" },
];

async function safeCount(table: PgTable): Promise<number | "—"> {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c, i) => (
          <Link
            key={c.label}
            href={c.href}
            className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">{c.label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{counts[i]}</div>
            <div className="mt-1 text-xs text-slate-400 font-mono">{c.tableName}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
