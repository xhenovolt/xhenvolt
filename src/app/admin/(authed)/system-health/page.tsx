import { runHealthChecks, type ProbeStatus, type ProbeResult } from "@/lib/health";
import { probeDatabaseDeep, type DbProbeResult } from "@/lib/health/db-probe";
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

const CAUSE_LABEL: Record<DbProbeResult["cause"], string> = {
  ok: "Connected",
  no_database_url: "DATABASE_URL not set",
  url_parse_failed: "Connection string malformed",
  dns_failed: "Hostname did not resolve",
  network_unreachable: "Network unreachable",
  tls_failed: "TLS handshake failed",
  http_4xx: "Neon rejected the request",
  http_5xx: "Neon returned a server error",
  neon_endpoint_disabled: "Neon endpoint not found",
  neon_endpoint_paused: "Neon project paused or scaled to zero",
  auth_failed: "Authentication failed (wrong password?)",
  channel_binding_unsupported: "channel_binding=require not supported",
  timeout: "Request timed out",
  unknown: "Unknown failure",
};

export default async function SystemHealth() {
  const [report, deep] = await Promise.all([runHealthChecks(), probeDatabaseDeep()]);
  const top = STATUS_STYLE[report.status];

  const grouped = report.probes.reduce<Record<string, ProbeResult[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // Show the deep DB diagnostic prominently when overall status is not OK.
  const showDeepDiagnostic = !deep.ok;

  return (
    <div>
      <PageHeader
        title="System health"
        description={`Live operational state. Last checked ${new Date(report.generatedAt).toLocaleString()}.`}
      />

      <div className={`rounded-2xl border p-5 mb-6 ${top.card}`}>
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

      {showDeepDiagnostic && (
        <div className="rounded-2xl border-2 border-red-200 bg-white p-6 mb-8">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                Database diagnostic
              </div>
              <div className="text-lg font-semibold text-slate-900 mt-0.5">
                {CAUSE_LABEL[deep.cause]}
              </div>
            </div>
            {deep.httpStatus !== undefined && (
              <span className="font-mono text-sm text-slate-500">
                HTTP {deep.httpStatus}
              </span>
            )}
          </div>

          <div className="text-sm text-slate-700 mb-3">{deep.message}</div>

          {deep.hint && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900 mb-3">
              <div className="font-semibold mb-1">How to fix</div>
              {deep.hint}
            </div>
          )}

          {deep.parsedUrl && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 mb-3">
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px]">Host</div>
                <div className="font-mono break-all">{deep.parsedUrl.host}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px]">Database</div>
                <div className="font-mono">{deep.parsedUrl.database}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px]">sslmode</div>
                <div className="font-mono">{deep.parsedUrl.sslmode ?? "(not set)"}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px]">channel_binding</div>
                <div className={`font-mono ${deep.parsedUrl.channelBinding ? "text-red-600" : ""}`}>
                  {deep.parsedUrl.channelBinding ?? "(not set)"}
                </div>
              </div>
            </div>
          )}

          {deep.detail && (
            <details className="text-xs">
              <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                Raw error / response body
              </summary>
              <pre className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg overflow-x-auto text-slate-700 whitespace-pre-wrap">
                {deep.detail}
              </pre>
            </details>
          )}

          <div className="mt-3 text-[10px] text-slate-400">
            Probe took {deep.durationMs}ms · classification: <span className="font-mono">{deep.cause}</span>
          </div>
        </div>
      )}

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
                  <div key={p.name} className={`rounded-xl border p-4 ${s.card}`}>
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
                      <div className="mt-2 text-xs text-slate-600 font-mono leading-relaxed break-words">
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
        <div className="font-semibold text-slate-700 mb-1">Common fixes</div>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>DB timing out</strong>: most often Neon is paused (free tier sleeps after inactivity). Open the Neon
            console once to wake the project, then refresh.
          </li>
          <li>
            <strong>channel_binding=require</strong> in the URL: the HTTP driver doesn&apos;t support SCRAM channel
            binding. Strip that parameter from <code className="font-mono">DATABASE_URL</code>.
          </li>
          <li>
            <strong>auth_failed</strong>: the Neon password was rotated. Get the current one from the Neon dashboard
            and update <code className="font-mono">.env.local</code>.
          </li>
          <li>
            <strong>network_unreachable / timeout</strong>: IPv6-only routing. Restart with{" "}
            <code className="font-mono">NODE_OPTIONS=--dns-result-order=ipv4first npm run dev</code> (the{" "}
            <code className="font-mono">instrumentation.ts</code> hook now sets this automatically, but it only
            applies after a clean restart).
          </li>
        </ul>
      </div>
    </div>
  );
}
