import { runHealthChecks, type ProbeStatus, type ProbeResult } from "@/lib/health";
import { PageHeader } from "../_components/ui";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS_STYLE: Record<ProbeStatus, { dot: string; label: string; card: string; text: string }> = {
  ok: {
    dot: "bg-green-500",
    label: "OK",
    card: "border-green-200 bg-green-50",
    text: "text-green-800",
  },
  degraded: {
    dot: "bg-amber-500",
    label: "DEGRADED",
    card: "border-amber-200 bg-amber-50",
    text: "text-amber-900",
  },
  down: {
    dot: "bg-red-500",
    label: "DOWN",
    card: "border-red-200 bg-red-50",
    text: "text-red-800",
  },
  unknown: {
    dot: "bg-slate-400",
    label: "UNKNOWN",
    card: "border-slate-200 bg-slate-50",
    text: "text-slate-700",
  },
};

const CATEGORY_LABEL: Record<ProbeResult["category"], string> = {
  infrastructure: "Infrastructure",
  configuration: "Configuration",
  auth: "Authentication",
  cms: "CMS content",
  ai: "Xhenvolt AI",
};

export default async function SystemHealth() {
  const report = await runHealthChecks();
  const top = STATUS_STYLE[report.status];

  // Group probes by category for visual sectioning.
  const grouped = report.probes.reduce<Record<string, ProbeResult[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="System health"
        description={`Live operational state. Last checked ${new Date(report.generatedAt).toLocaleString()}.`}
      />

      <div className={`rounded-2xl border p-5 mb-8 ${top.card}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className={`inline-block w-3 h-3 rounded-full ${top.dot}`} />
          <span className={`text-sm font-semibold uppercase tracking-wider ${top.text}`}>
            Overall: {top.label}
          </span>
        </div>
        <p className={`text-sm ${top.text}`}>
          {report.status === "ok" && "All probes returning OK. Admin and public site are fully operational."}
          {report.status === "degraded" && "One or more probes report a degraded state. The site is still serving but a follow-up is needed."}
          {report.status === "down" && "At least one critical service is down. Admin functionality and/or live site features will be impaired until resolved."}
          {report.status === "unknown" && "Probes couldn't determine state. Usually means the DB is unreachable so dependent probes were skipped."}
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([cat, probes]) => (
          <section key={cat}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              {CATEGORY_LABEL[cat as ProbeResult["category"]] ?? cat}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {probes.map((p) => {
                const s = STATUS_STYLE[p.status];
                return (
                  <div
                    key={p.name}
                    className={`rounded-xl border p-4 ${s.card}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`inline-block w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {p.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${s.text}`}>
                        {s.label}
                      </span>
                    </div>
                    <div className={`text-sm ${s.text}`}>{p.message}</div>
                    {p.detail && (
                      <div className="mt-2 text-xs text-slate-600 font-mono leading-relaxed">
                        {p.detail}
                      </div>
                    )}
                    <div className="mt-3 text-[10px] text-slate-500">
                      {p.durationMs}ms · {new Date(p.checkedAt).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed">
        <div className="font-semibold text-slate-700 mb-1">How to use this page</div>
        <ul className="list-disc list-inside space-y-1">
          <li>If <strong>Environment variables</strong> is DOWN: the running process isn&apos;t seeing required vars. Restart the dev server after editing <code className="font-mono">.env.local</code>.</li>
          <li>If <strong>Database connectivity</strong> is DOWN: Neon is unreachable or <code className="font-mono">DATABASE_URL</code> is wrong. Check the URL and your network.</li>
          <li>If <strong>Auth tables</strong> is DOWN: migrations haven&apos;t run. Execute <code className="font-mono">npm run db:migrate</code>.</li>
          <li>If <strong>Admin users</strong> is DOWN: no accounts exist. Bootstrap with <code className="font-mono">npm run db:create-admin -- email password</code>.</li>
        </ul>
      </div>
    </div>
  );
}
