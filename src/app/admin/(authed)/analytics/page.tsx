import { PageHeader } from "../_components/ui";
import {
  getOverview,
  getTrend,
  getTopPages,
  getTopSources,
  getDevices,
  getBots,
} from "@/lib/repositories/analytics.repo";
import { RangeTabs, StatCard, BarList, TrendChart, parseRange } from "./_components";

export const dynamic = "force-dynamic";

export default async function AnalyticsOverview({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeRaw } = await searchParams;
  const range = parseRange(rangeRaw);

  const [overview, trend, topPages, sources, devices, bots] = await Promise.all([
    getOverview(range),
    getTrend(range),
    getTopPages(range),
    getTopSources(range),
    getDevices(range),
    getBots(range),
  ]);

  const acceptPct =
    overview.consentAcceptRate == null ? "—" : `${Math.round(overview.consentAcceptRate * 100)}%`;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="First-party, privacy-aware traffic intelligence. Human page views require analytics consent; bot/AI-crawler hits are logged server-side."
        action={<RangeTabs base="/admin/analytics" range={range} />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Human page views" value={overview.humanViews.toLocaleString()} href="/admin/analytics/pages" />
        <StatCard label="Unique visitors" value={overview.uniqueVisitors.toLocaleString()} />
        <StatCard label="Downloads" value={overview.downloads.toLocaleString()} href="/admin/analytics/downloads" />
        <StatCard label="Tracked events" value={overview.events.toLocaleString()} href="/admin/analytics/events" />
        <StatCard label="Bot / crawler hits" value={overview.botViews.toLocaleString()} href="/admin/analytics/bots" />
        <StatCard label="Likely AI crawler hits" value={overview.aiCrawlerViews.toLocaleString()} sub="UA-declared — not certainty" href="/admin/analytics/bots" />
        <StatCard label="Consent acceptance" value={acceptPct} sub="analytics opt-in rate" href="/admin/analytics/consent" />
        <StatCard label="Total page views" value={overview.pageViews.toLocaleString()} sub="humans + bots" />
      </div>

      <div className="mt-6">
        <TrendChart points={trend} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarList title="Top pages" rows={topPages} color="bg-indigo-500" />
        <BarList title="Top traffic sources" rows={sources} color="bg-emerald-500" />
        <BarList title="Devices" rows={devices} color="bg-sky-500" />
        <BarList
          title="Bots & AI crawlers"
          rows={bots.map((b) => ({ label: b.isAi ? `🤖 ${b.name}` : b.name, value: b.views }))}
          color="bg-amber-500"
          emptyText="No bot or crawler activity recorded yet."
        />
      </div>
    </div>
  );
}
