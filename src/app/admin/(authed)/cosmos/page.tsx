import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { AppWindow, Package, BarChart3, ArrowRight, ExternalLink } from "lucide-react";
import { db, schema, hasDb } from "@/lib/db";

export const dynamic = "force-dynamic";

async function safeCount(run: () => Promise<number>): Promise<number | "—"> {
  if (!hasDb()) return "—";
  try {
    return await run();
  } catch {
    return "—";
  }
}

export default async function CosmosHub() {
  const [apps, published, releases, downloads] = await Promise.all([
    safeCount(async () => {
      const [r] = await db!.select({ c: count() }).from(schema.appProducts);
      return Number(r?.c ?? 0);
    }),
    safeCount(async () => {
      const [r] = await db!
        .select({ c: count() })
        .from(schema.appProducts)
        .where(eq(schema.appProducts.status, "published"));
      return Number(r?.c ?? 0);
    }),
    safeCount(async () => {
      const [r] = await db!.select({ c: count() }).from(schema.appReleases);
      return Number(r?.c ?? 0);
    }),
    safeCount(async () => {
      const [r] = await db!.select({ c: count() }).from(schema.downloadEvents);
      return Number(r?.c ?? 0);
    }),
  ]);

  const cards = [
    { label: "Apps", icon: AppWindow, href: "/admin/cosmos/apps", value: apps, sub: `${published} published` },
    { label: "Releases", icon: Package, href: "/admin/cosmos/releases", value: releases, sub: "all channels" },
    { label: "Downloads", icon: BarChart3, href: "/admin/cosmos/downloads", value: downloads, sub: "download intents logged" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xhenvolt Cosmos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Software release center. Manage downloadable products and the GitHub-backed releases behind them.
          </p>
        </div>
        <Link
          href="/cosmos"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View store
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group block rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-slate-400" />
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900">{c.value}</div>
              <div className="text-sm font-medium text-slate-700">{c.label}</div>
              <div className="mt-0.5 text-xs text-slate-400">{c.sub}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">How to publish a new version</h2>
        <ol className="mt-3 space-y-2 text-sm text-slate-600">
          <li>1. Create a release on GitHub and upload the installer asset.</li>
          <li>2. Copy the asset&apos;s direct download URL.</li>
          <li>
            3. In <Link href="/admin/cosmos/releases/new" className="font-medium text-blue-600 hover:underline">Releases → New</Link>,
            pick the app, paste the URL, and click <strong>Verify URL</strong>.
          </li>
          <li>4. Set the version, platform and file type, tick <strong>Mark as latest</strong>, and save.</li>
          <li>5. The public store updates automatically — no redeploy needed.</li>
        </ol>
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Cosmos never proxies binaries. Downloads redirect to GitHub so large files never touch Vercel bandwidth.
        </p>
      </div>
    </div>
  );
}
