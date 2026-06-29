import Link from "next/link";
import type { ReactNode } from "react";
import type { Counted, DayPoint } from "@/lib/repositories/analytics.repo";

/** Date-range selector (today/7/30/90) driven by ?range= query param. */
export function RangeTabs({ base, range }: { base: string; range: number }) {
  const opts = [
    { label: "24h", days: 1 },
    { label: "7 days", days: 7 },
    { label: "30 days", days: 30 },
    { label: "90 days", days: 90 },
  ];
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
      {opts.map((o) => {
        const active = o.days === range;
        return (
          <Link
            key={o.days}
            href={`${base}?range=${o.days}`}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </>
  );
  const cls = "block rounded-xl border border-slate-200 bg-white p-5";
  return href ? (
    <Link href={href} className={`${cls} transition-all hover:border-slate-300 hover:shadow-sm`}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** Horizontal bar list — enterprise, no chart library. */
export function BarList({
  title,
  rows,
  emptyText = "No data yet for this range.",
  color = "bg-indigo-500",
  formatLabel,
}: {
  title: string;
  rows: Counted[];
  emptyText?: string;
  color?: string;
  formatLabel?: (label: string) => ReactNode;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">{emptyText}</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {rows.map((r) => (
            <li key={r.label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-slate-700" title={r.label}>
                  {formatLabel ? formatLabel(r.label) : r.label}
                </span>
                <span className="flex-shrink-0 font-medium text-slate-900">{r.value.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${(r.value / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Simple CSS column chart for the daily traffic trend. */
export function TrendChart({ points }: { points: DayPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.views));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900">Traffic trend (human page views)</h3>
      {points.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No page views recorded in this range yet.</p>
      ) : (
        <div className="mt-5 flex h-40 items-end gap-1">
          {points.map((p) => (
            <div key={p.date} className="group flex flex-1 flex-col items-center justify-end" title={`${p.date}: ${p.views} views, ${p.visitors} visitors`}>
              <div
                className="w-full rounded-t bg-indigo-500/80 transition-colors group-hover:bg-indigo-600"
                style={{ height: `${(p.views / max) * 100}%`, minHeight: p.views > 0 ? 2 : 0 }}
              />
            </div>
          ))}
        </div>
      )}
      {points.length > 0 && (
        <div className="mt-2 flex justify-between text-[10px] text-slate-400">
          <span>{points[0]!.date}</span>
          <span>{points[points.length - 1]!.date}</span>
        </div>
      )}
    </div>
  );
}

export function parseRange(v: string | undefined): number {
  const n = Number(v);
  return [1, 7, 30, 90].includes(n) ? n : 7;
}
