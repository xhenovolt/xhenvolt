import { desc, count, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import { platformLabel } from "@/lib/cosmos/format";

export const dynamic = "force-dynamic";

interface Aggregates {
  total: number;
  last7: number;
  byApp: { name: string; c: number }[];
  byPlatform: { platform: string; c: number }[];
  byVersion: { slug: string; version: string; c: number }[];
  recent: { slug: string; platform: string | null; version: string | null; createdAt: Date }[];
}

async function getAggregates(): Promise<Aggregates | null> {
  if (!db) return null;
  try {
    const [[totalRow], byPlatform, byVersion, recent] = await Promise.all([
      db.select({ c: count() }).from(schema.downloadEvents),
      db
        .select({ platform: schema.downloadEvents.platform, c: count() })
        .from(schema.downloadEvents)
        .groupBy(schema.downloadEvents.platform)
        .orderBy(desc(count())),
      db
        .select({ slug: schema.downloadEvents.slug, version: schema.downloadEvents.version, c: count() })
        .from(schema.downloadEvents)
        .groupBy(schema.downloadEvents.slug, schema.downloadEvents.version)
        .orderBy(desc(count()))
        .limit(12),
      db
        .select({
          slug: schema.downloadEvents.slug,
          platform: schema.downloadEvents.platform,
          version: schema.downloadEvents.version,
          createdAt: schema.downloadEvents.createdAt,
        })
        .from(schema.downloadEvents)
        .orderBy(desc(schema.downloadEvents.createdAt))
        .limit(20),
    ]);

    // Downloads grouped by app name (join through products by id).
    const byAppRaw = await db
      .select({ name: schema.appProducts.name, c: count() })
      .from(schema.downloadEvents)
      .leftJoin(schema.appProducts, eq(schema.downloadEvents.appProductId, schema.appProducts.id))
      .groupBy(schema.appProducts.name)
      .orderBy(desc(count()))
      .limit(12);

    const [last7Row] = await db
      .select({ c: count() })
      .from(schema.downloadEvents)
      .where(sql`${schema.downloadEvents.createdAt} >= (NOW() - INTERVAL 7 DAY)`);

    return {
      total: Number(totalRow?.c ?? 0),
      last7: Number(last7Row?.c ?? 0),
      byApp: byAppRaw.map((r) => ({ name: r.name ?? "Unknown", c: Number(r.c) })),
      byPlatform: byPlatform.map((r) => ({ platform: r.platform ?? "—", c: Number(r.c) })),
      byVersion: byVersion.map((r) => ({ slug: r.slug, version: r.version ?? "—", c: Number(r.c) })),
      recent,
    };
  } catch {
    return null;
  }
}

export default async function DownloadsAnalyticsPage() {
  const agg = await getAggregates();

  return (
    <div>
      <PageHeader
        title="Cosmos · Downloads"
        description="Download-intent analytics. We log clicks, not file transfers — GitHub serves the bytes."
      />

      {!agg ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
          Analytics unavailable (database not reachable).
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Total downloads" value={agg.total} />
            <Stat label="Last 7 days" value={agg.last7} />
            <Stat label="Tracked apps" value={agg.byApp.length} />
            <Stat label="Platforms" value={agg.byPlatform.length} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel title="Top products">
              <BarList items={agg.byApp.map((r) => ({ label: r.name, value: r.c }))} />
            </Panel>
            <Panel title="By platform">
              <BarList items={agg.byPlatform.map((r) => ({ label: platformLabel(r.platform), value: r.c }))} />
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel title="By version">
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-3 py-2">App</th><th className="px-3 py-2">Version</th><th className="px-3 py-2 text-right">Downloads</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {agg.byVersion.length === 0 && (
                      <tr><td colSpan={3} className="px-3 py-6 text-center text-slate-400">No data yet</td></tr>
                    )}
                    {agg.byVersion.map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-slate-700">{r.slug}</td>
                        <td className="px-3 py-2 font-mono text-xs text-slate-500">v{r.version}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900">{r.c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Recent downloads">
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-3 py-2">App</th><th className="px-3 py-2">Platform</th><th className="px-3 py-2">When</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {agg.recent.length === 0 && (
                      <tr><td colSpan={3} className="px-3 py-6 text-center text-slate-400">No downloads yet</td></tr>
                    )}
                    {agg.recent.map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-slate-700">{r.slug}{r.version ? ` v${r.version}` : ""}</td>
                        <td className="px-3 py-2 text-slate-500">{platformLabel(r.platform)}</td>
                        <td className="px-3 py-2 text-slate-500">{new Date(r.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function BarList({ items }: { items: { label: string; value: number }[] }) {
  if (items.length === 0) return <p className="text-sm text-slate-400">No data yet</p>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i}>
          <div className="mb-0.5 flex items-center justify-between text-xs">
            <span className="truncate text-slate-700">{it.label}</span>
            <span className="font-medium text-slate-900">{it.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
