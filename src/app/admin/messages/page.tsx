import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../_components/ui";
import { setMessageStatus } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-amber-50 text-amber-800 border-amber-200",
  replied: "bg-green-50 text-green-800 border-green-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
};

const NEXT_STATUS: Record<string, string> = {
  new: "in_progress",
  in_progress: "replied",
  replied: "archived",
  archived: "new",
};

const NEXT_LABEL: Record<string, string> = {
  new: "Mark in progress",
  in_progress: "Mark replied",
  replied: "Archive",
  archived: "Reopen",
};

async function getList() {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.contactMessages)
      .orderBy(desc(schema.contactMessages.createdAt))
      .limit(200);
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

export default async function MessagesPage() {
  const rows = await getList();
  const newCount = rows.filter((r) => r.status === "new").length;

  return (
    <div>
      <PageHeader
        title="Inbox"
        description={
          rows.length === 0
            ? "No messages yet. Submissions to /api/contact land here."
            : `${rows.length} messages · ${newCount} new`
        }
      />
      <div className="space-y-3">
        {rows.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            When a visitor submits the contact form, it shows up here.
          </div>
        )}
        {rows.map((m) => (
          <article
            key={m.id}
            className="bg-white rounded-xl border border-slate-200 p-5"
          >
            <header className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="font-semibold text-slate-900">{m.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  <a href={`mailto:${m.email}`} className="hover:underline">
                    {m.email}
                  </a>
                  {m.phone && <span> · {m.phone}</span>}
                  <span> · {relativeTime(m.createdAt)}</span>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  STATUS_COLORS[m.status] ?? STATUS_COLORS.archived
                }`}
              >
                {m.status.replace("_", " ")}
              </span>
            </header>
            {m.subject && (
              <div className="text-sm font-medium text-slate-700 mb-1">{m.subject}</div>
            )}
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {m.message}
            </p>
            <footer className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <div>
                {m.source && <span>via {m.source}</span>}
              </div>
              <form
                action={async () => {
                  "use server";
                  await setMessageStatus(m.id, NEXT_STATUS[m.status] ?? "new");
                }}
              >
                <button
                  type="submit"
                  className="text-xs font-medium text-slate-700 border border-slate-200 rounded-md px-2.5 py-1 hover:bg-slate-50"
                >
                  {NEXT_LABEL[m.status] ?? "Update"}
                </button>
              </form>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
