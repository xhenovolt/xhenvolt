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
  missing_credentials: "TiDB credentials not set",
  dns_failed: "Hostname did not resolve",
  network_unreachable: "Network unreachable",
  tls_failed: "TLS handshake failed",
  auth_failed: "Authentication failed (wrong password?)",
  unknown_database: "Database does not exist",
  host_refused: "Host refused the connection",
  timeout: "Connection timed out",
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
                TiDB diagnostic
              </div>
              <div className="text-lg font-semibold text-slate-900 mt-0.5">
                {CAUSE_LABEL[deep.cause]}
              </div>
            </div>
            {deep.errorCode && (
              <span className="font-mono text-sm text-slate-500">
                {deep.errorCode}
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

          {deep.parsedConfig && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 mb-3">
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px]">Host</div>
                <div className="font-mono break-all">{deep.parsedConfig.host}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px]">Port</div>
                <div className="font-mono">{deep.parsedConfig.port}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px]">Database</div>
                <div className="font-mono">{deep.parsedConfig.database}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px]">User</div>
                <div className="font-mono break-all">{deep.parsedConfig.user}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase tracking-wider text-[10px]">TLS</div>
                <div className={`font-mono ${deep.parsedConfig.ssl ? "text-green-700" : "text-red-600"}`}>
                  {deep.parsedConfig.ssl ? "enabled" : "disabled"}
                </div>
              </div>
            </div>
          )}

          {deep.detail && (
            <details className="text-xs">
              <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                Raw error / stack
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
            <strong>auth_failed</strong>: TIDB_PASSWORD wrong or rotated. Reissue in the TiDB Cloud
            console and update <code className="font-mono">.env.local</code>.
          </li>
          <li>
            <strong>dns_failed</strong>: TIDB_HOST malformed. Format is{" "}
            <code className="font-mono">gateway01.&lt;region&gt;.prod.aws.tidbcloud.com</code>.
          </li>
          <li>
            <strong>tls_failed</strong>: Keep <code className="font-mono">DATABASE_MODE=tidb</code>{" "}
            so the client negotiates TLS. Update Node CA certs if the error mentions cert verification.
          </li>
          <li>
            <strong>unknown_database</strong>: TIDB_DB does not exist. Create it in the TiDB Cloud
            console under the cluster&apos;s SQL editor, or change TIDB_DB to the existing one.
          </li>
          <li>
            <strong>timeout</strong>: TiDB Serverless may be cold. Retry once. If persistent, check
            egress firewall on port 4000.
          </li>
        </ul>
      </div>
    </div>
  );
}
