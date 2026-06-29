import { PageHeader } from "../../_components/ui";
import { getTopEvents, getRecentEvents } from "@/lib/repositories/analytics.repo";
import { RangeTabs, BarList, parseRange } from "../_components";

export const dynamic = "force-dynamic";

function ago(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default async function AnalyticsEvents({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: r } = await searchParams;
  const range = parseRange(r);
  const [top, recent] = await Promise.all([getTopEvents(range), getRecentEvents(100)]);

  return (
    <div>
      <PageHeader
        title="Events"
        description="CTA clicks, outbound links, calls/emails, downloads and custom events (consent-gated)."
        action={<RangeTabs base="/admin/analytics/events" range={range} />}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <BarList title="Top events" rows={top} color="bg-indigo-500" />
        </div>
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">Recent events</div>
          {recent.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">No events recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Event</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Path</th>
                  <th className="px-4 py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-800">{e.eventName}</td>
                    <td className="px-4 py-2 text-xs text-slate-500">{e.eventType}</td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{e.path ?? "—"}</td>
                    <td className="px-4 py-2 text-xs text-slate-400">{ago(e.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
