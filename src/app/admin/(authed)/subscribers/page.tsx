import Link from "next/link";
import { desc } from "drizzle-orm";
import { Download } from "lucide-react";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../_components/ui";
import { setSubscriberStatus, deleteSubscriber } from "./actions";

export const dynamic = "force-dynamic";

type Row = typeof schema.subscribers.$inferSelect;

const STATUS_COLORS: Record<string, string> = {
  subscribed: "bg-green-50 text-green-700 border-green-200",
  unsubscribed: "bg-slate-100 text-slate-600 border-slate-200",
  bounced: "bg-red-50 text-red-700 border-red-200",
};

const NEXT_STATUS: Record<string, string> = {
  subscribed: "unsubscribed",
  unsubscribed: "subscribed",
  bounced: "subscribed",
};

async function getRows(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.subscribers)
      .orderBy(desc(schema.subscribers.createdAt))
      .limit(500);
  } catch {
    return [];
  }
}

function fmtDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
}

export default async function SubscribersPage() {
  const rows = await getRows();
  const active = rows.filter((r) => r.status === "subscribed").length;

  return (
    <div>
      <PageHeader
        title="Subscribers"
        description={
          rows.length === 0
            ? "No subscribers yet. Newsletter signups (page + footer) land here."
            : `${rows.length} total · ${active} subscribed`
        }
        action={
          <Link
            href="/api/admin/subscribers/export"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
          When a visitor subscribes via{" "}
          <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">/newsletter</code>{" "}
          or the footer, they appear here.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Interests</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => {
                const interests = Array.isArray(r.interests)
                  ? (r.interests as string[])
                  : [];
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <a href={`mailto:${r.email}`} className="font-medium text-slate-900 hover:text-blue-600">
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{r.name ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {interests.length > 0 ? interests.join(", ") : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{r.source}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{fmtDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          STATUS_COLORS[r.status] ?? STATUS_COLORS.unsubscribed
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <form
                          action={async () => {
                            "use server";
                            await setSubscriberStatus(r.id, NEXT_STATUS[r.status] ?? "subscribed");
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md px-2 py-1"
                          >
                            {r.status === "subscribed" ? "Unsubscribe" : "Resubscribe"}
                          </button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            await deleteSubscriber(r.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md px-2 py-1"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
