import { PageHeader } from "../../_components/ui";
import { getDownloads } from "@/lib/repositories/analytics.repo";
import { RangeTabs, parseRange } from "../_components";
import { platformLabel } from "@/lib/cosmos/format";

export const dynamic = "force-dynamic";

export default async function AnalyticsDownloads({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: r } = await searchParams;
  const range = parseRange(r);
  const rows = await getDownloads(range);
  const total = rows.reduce((s, x) => s + x.count, 0);

  return (
    <div>
      <PageHeader
        title="Downloads"
        description={`Cosmos download intent (click → redirect to GitHub). ${total.toLocaleString()} in range. Source: download_events.`}
        action={<RangeTabs base="/admin/analytics/downloads" range={range} />}
      />
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-slate-400">
            No downloads recorded in this range. They appear when a user clicks a Cosmos download.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">App</th>
                <th className="px-4 py-2 font-medium">Platform</th>
                <th className="px-4 py-2 font-medium">Version</th>
                <th className="px-4 py-2 font-medium text-right">Downloads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium text-slate-800">{d.slug}</td>
                  <td className="px-4 py-2 text-slate-600">{d.platform ? platformLabel(d.platform) : "—"}</td>
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">{d.version ?? "—"}</td>
                  <td className="px-4 py-2 text-right font-semibold text-slate-900">{d.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
