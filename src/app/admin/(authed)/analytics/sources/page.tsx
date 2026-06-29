import { PageHeader } from "../../_components/ui";
import { getTopSources } from "@/lib/repositories/analytics.repo";
import { RangeTabs, BarList, parseRange } from "../_components";

export const dynamic = "force-dynamic";

export default async function AnalyticsSources({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: r } = await searchParams;
  const range = parseRange(r);
  const rows = await getTopSources(range);
  return (
    <div>
      <PageHeader
        title="Traffic sources"
        description="Where human visitors came from (referrer-derived: direct, organic, social, referral)."
        action={<RangeTabs base="/admin/analytics/sources" range={range} />}
      />
      <BarList title="Top sources" rows={rows} color="bg-emerald-500" />
    </div>
  );
}
