import { PageHeader } from "../../_components/ui";
import { getTopPages } from "@/lib/repositories/analytics.repo";
import { RangeTabs, BarList, parseRange } from "../_components";

export const dynamic = "force-dynamic";

export default async function AnalyticsPages({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: r } = await searchParams;
  const range = parseRange(r);
  const rows = await getTopPages(range);
  return (
    <div>
      <PageHeader
        title="Pages"
        description="Most-viewed pages (human traffic) in the selected range."
        action={<RangeTabs base="/admin/analytics/pages" range={range} />}
      />
      <BarList title="Top pages" rows={rows} color="bg-indigo-500" />
    </div>
  );
}
