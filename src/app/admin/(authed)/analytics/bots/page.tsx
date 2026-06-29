import { PageHeader } from "../../_components/ui";
import { getBots, getRecentBotHits } from "@/lib/repositories/analytics.repo";
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

export default async function AnalyticsBots({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: r } = await searchParams;
  const range = parseRange(r);
  const [bots, recent] = await Promise.all([getBots(range), getRecentBotHits(100)]);
  const ai = bots.filter((b) => b.isAi);
  const other = bots.filter((b) => !b.isAi);

  return (
    <div>
      <PageHeader
        title="Bots & AI Crawlers"
        description="Server-side detection from User-Agent. This shows that a crawler fetched a page — it does NOT prove an AI trained on or answered from our content. UAs can be spoofed."
        action={<RangeTabs base="/admin/analytics/bots" range={range} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarList
          title="Likely AI crawlers"
          rows={ai.map((b) => ({ label: b.name, value: b.views }))}
          color="bg-fuchsia-500"
          emptyText="No AI-crawler activity detected yet (GPTBot, ClaudeBot, PerplexityBot, etc.)."
        />
        <BarList
          title="Search & social bots"
          rows={other.map((b) => ({ label: b.name, value: b.views }))}
          color="bg-amber-500"
          emptyText="No search/social bot activity yet."
        />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
          Recent crawler hits
        </div>
        {recent.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-400">No crawler hits recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Crawler</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Path</th>
                <th className="px-4 py-2 font-medium">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-800">{h.botName ?? "(unknown)"}</td>
                  <td className="px-4 py-2">
                    {h.isAiCrawler ? (
                      <span className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2 py-0.5 text-xs text-fuchsia-700">AI</span>
                    ) : (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">Bot</span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">{h.path}</td>
                  <td className="px-4 py-2 text-xs text-slate-400">{ago(h.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
