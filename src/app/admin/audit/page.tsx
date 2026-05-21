import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../_components/ui";

export const dynamic = "force-dynamic";

type Row = typeof schema.adminAuditLogs.$inferSelect;

async function getList(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.adminAuditLogs)
      .orderBy(desc(schema.adminAuditLogs.createdAt))
      .limit(200);
  } catch {
    return [];
  }
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-50 text-green-700 border-green-200",
  update: "bg-blue-50 text-blue-700 border-blue-200",
  delete: "bg-red-50 text-red-700 border-red-200",
  publish: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unpublish: "bg-amber-50 text-amber-800 border-amber-200",
};

function relTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default async function AuditPage() {
  const rows = await getList();
  return (
    <div>
      <PageHeader
        title="Audit log"
        description="Append-only record of admin actions. Last 200 events."
      />
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Who</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Entity</th>
              <th className="px-4 py-3 font-medium">Summary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500 text-sm">
                  No audit events yet. Edits to content will appear here.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                  {relTime(r.createdAt)}
                </td>
                <td className="px-4 py-3 text-slate-700 text-xs">
                  {r.actorEmail ?? <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      ACTION_COLORS[r.action] ?? "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {r.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700 text-xs font-mono">
                  {r.entityType}
                  {r.entityId && (
                    <span className="text-slate-400">:{r.entityId.slice(0, 8)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700 text-xs line-clamp-2">
                  {r.summary ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
