import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../_components/ui";

export const dynamic = "force-dynamic";

type LogRow = typeof schema.aiConversationLogs.$inferSelect;

async function getLogs(): Promise<LogRow[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.aiConversationLogs)
      .orderBy(desc(schema.aiConversationLogs.createdAt))
      .limit(300);
  } catch {
    return [];
  }
}

function relativeTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

interface Session {
  sessionId: string;
  turns: LogRow[];
  lastAt: Date;
}

export default async function AiLogsPage() {
  const rows = await getLogs();

  // Group by session; keep newest session first, turns oldest-first within.
  const map = new Map<string, LogRow[]>();
  for (const r of rows) {
    if (!map.has(r.sessionId)) map.set(r.sessionId, []);
    map.get(r.sessionId)!.push(r);
  }
  const sessions: Session[] = Array.from(map.entries())
    .map(([sessionId, turns]) => {
      const sorted = [...turns].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      return {
        sessionId,
        turns: sorted,
        lastAt: new Date(sorted[sorted.length - 1]!.createdAt),
      };
    })
    .sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime());

  return (
    <div>
      <PageHeader
        title="Conversation Logs"
        description={
          rows.length === 0
            ? "No chatbot conversations logged yet. Visitor chats land here."
            : `${rows.length} messages across ${sessions.length} session${sessions.length === 1 ? "" : "s"} (most recent 300)`
        }
      />

      {rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
          When a visitor chats with the AI assistant, each turn is recorded in{" "}
          <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">ai_conversation_logs</code>{" "}
          and shown here, grouped by session.
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <article key={s.sessionId} className="bg-white rounded-xl border border-slate-200 p-5">
              <header className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-100">
                <div className="text-xs font-mono text-slate-500">
                  session {s.sessionId.slice(0, 12)}…
                </div>
                <div className="text-xs text-slate-400">
                  {s.turns.length} turn{s.turns.length === 1 ? "" : "s"} · {relativeTime(s.lastAt)}
                </div>
              </header>
              <div className="space-y-3">
                {s.turns.map((t) => {
                  const isUser = t.role === "user";
                  return (
                    <div key={t.id} className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          isUser
                            ? "bg-slate-100 text-slate-800"
                            : "bg-blue-50 text-blue-900 border border-blue-100"
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-wide font-medium mb-0.5 opacity-60">
                          {t.role}
                        </div>
                        <p className="whitespace-pre-wrap">{t.message}</p>
                        {!isUser && (t.confidence != null || t.latencyMs != null) && (
                          <div className="mt-1.5 flex gap-3 text-[10px] text-blue-700/70">
                            {t.confidence != null && <span>confidence {t.confidence}%</span>}
                            {t.latencyMs != null && <span>{t.latencyMs}ms</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
