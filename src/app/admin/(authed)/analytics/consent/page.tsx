import { PageHeader } from "../../_components/ui";
import { getConsentStats } from "@/lib/repositories/analytics.repo";
import { StatCard } from "../_components";

export const dynamic = "force-dynamic";

function pct(n: number, total: number): string {
  if (total <= 0) return "—";
  return `${Math.round((n / total) * 100)}%`;
}

export default async function AnalyticsConsent() {
  const s = await getConsentStats();
  return (
    <div>
      <PageHeader
        title="Cookie Consent"
        description="Consent decisions recorded from the cookie banner. Necessary cookies are always on and not counted as opt-in."
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Consent decisions" value={s.total.toLocaleString()} />
        <StatCard label="Analytics opt-in" value={pct(s.analyticsGranted, s.total)} sub={`${s.analyticsGranted.toLocaleString()} visitors`} />
        <StatCard label="Preferences opt-in" value={pct(s.preferencesGranted, s.total)} sub={`${s.preferencesGranted.toLocaleString()} visitors`} />
        <StatCard label="Marketing opt-in" value={pct(s.marketingGranted, s.total)} sub={`${s.marketingGranted.toLocaleString()} visitors`} />
      </div>

      {s.total === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No consent decisions recorded yet. They appear once visitors interact with the cookie banner.
        </div>
      )}
    </div>
  );
}
