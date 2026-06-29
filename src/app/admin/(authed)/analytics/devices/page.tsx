import { PageHeader } from "../../_components/ui";
import {
  getDevices,
  getBrowsers,
  getOperatingSystems,
  getCountries,
} from "@/lib/repositories/analytics.repo";
import { RangeTabs, BarList, parseRange } from "../_components";

export const dynamic = "force-dynamic";

export default async function AnalyticsDevices({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: r } = await searchParams;
  const range = parseRange(r);
  const [devices, browsers, os, countries] = await Promise.all([
    getDevices(range),
    getBrowsers(range),
    getOperatingSystems(range),
    getCountries(range),
  ]);
  return (
    <div>
      <PageHeader
        title="Devices & geography"
        description="Device, browser, OS and country breakdown for human traffic. Country needs Vercel geo headers (production)."
        action={<RangeTabs base="/admin/analytics/devices" range={range} />}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarList title="Device type" rows={devices} color="bg-sky-500" />
        <BarList title="Browser" rows={browsers} color="bg-violet-500" />
        <BarList title="Operating system" rows={os} color="bg-rose-500" />
        <BarList title="Country" rows={countries} color="bg-teal-500" emptyText="No country data (only available in production via Vercel geo)." />
      </div>
    </div>
  );
}
