import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Download,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  Github,
  ChevronRight,
} from "lucide-react";
import { getPublishedAppBySlug } from "@/lib/repositories/cosmos.repo";
import type { AppRelease } from "@/lib/repositories/cosmos.repo";
import {
  formatFileSize,
  platformLabel,
  channelBadgeClass,
  CHANNEL_LABELS,
  ARCH_LABELS,
  FILE_TYPE_LABELS,
} from "@/lib/cosmos/format";
import { AppIcon } from "../_components/AppIcon";

const BASE_URL = "https://xhenvolt.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = await getPublishedAppBySlug(slug);
  if (!app) {
    return { title: "App not found — Xhenvolt Cosmos" };
  }
  const desc =
    app.tagline ??
    app.description?.slice(0, 160) ??
    `Download ${app.name} from Xhenvolt Cosmos.`;
  const title = `${app.name}${app.latest ? ` v${app.latest.version}` : ""} — Xhenvolt Cosmos`;
  return {
    title,
    description: desc,
    alternates: { canonical: `${BASE_URL}/cosmos/${app.slug}` },
    openGraph: {
      title,
      description: desc,
      type: "website",
      url: `${BASE_URL}/cosmos/${app.slug}`,
      siteName: "Xhenvolt Uganda",
      images: [{ url: app.iconUrl ?? "/og-image.png", width: 1200, height: 630, alt: app.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [app.iconUrl ?? "/og-image.png"],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await getPublishedAppBySlug(slug);
  if (!app) notFound();

  const accent = app.brandColor ?? "#6366f1";
  const latest = app.latest;
  // Group releases by platform for the download list (latest first per platform).
  const byPlatform = new Map<string, AppRelease[]>();
  for (const r of app.releases) {
    if (!byPlatform.has(r.platform)) byPlatform.set(r.platform, []);
    byPlatform.get(r.platform)!.push(r);
  }

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.tagline ?? app.description,
    applicationCategory: app.category ?? "BusinessApplication",
    operatingSystem: app.platforms.map(platformLabel).join(", ") || undefined,
    softwareVersion: latest?.version,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Xhenvolt Uganda", url: BASE_URL },
  };

  return (
    <main className="bg-zinc-950 text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      {/* breadcrumb + hero */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ background: `radial-gradient(50% 50% at 30% 0%, ${accent}22, transparent 70%)` }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-12 sm:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Link href="/cosmos" className="hover:text-zinc-300">Cosmos</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-400">{app.name}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div
              className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950"
              style={{ boxShadow: `0 0 0 1px ${accent}22, 0 0 40px ${accent}22` }}
            >
              <AppIcon name={app.icon} iconUrl={app.iconUrl} brandColor={accent} className="h-10 w-10" alt={app.name} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{app.name}</h1>
                {latest && (
                  <span className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 font-mono text-sm text-zinc-300">
                    v{latest.version}
                  </span>
                )}
              </div>
              {app.tagline && <p className="mt-2 max-w-2xl text-lg text-zinc-400">{app.tagline}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {app.category && (
                  <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400">
                    {app.category}
                  </span>
                )}
                {app.platforms.map((p) => (
                  <span key={p} className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400">
                    {platformLabel(p)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {latest && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/download/${app.slug}`}
                rel="nofollow"
                data-track="cosmos_download"
                data-track-type="download"
                data-track-target={app.slug}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                <Download className="h-4 w-4" />
                Download latest ({platformLabel(latest.platform)})
              </Link>
              <span className="text-sm text-zinc-500">
                {FILE_TYPE_LABELS[latest.fileType as keyof typeof FILE_TYPE_LABELS] ?? latest.fileType}
                {latest.fileSize ? ` · ${formatFileSize(latest.fileSize)}` : ""}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* main column */}
          <div className="lg:col-span-2">
            {app.longDescription || app.description ? (
              <section>
                <h2 className="text-lg font-semibold text-white">About {app.name}</h2>
                <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-400">
                  {app.longDescription || app.description}
                </div>
              </section>
            ) : null}

            {latest?.releaseNotes && (
              <section className="mt-10">
                <h2 className="text-lg font-semibold text-white">Release notes — v{latest.version}</h2>
                <div className="mt-3 whitespace-pre-line rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm leading-relaxed text-zinc-400">
                  {latest.releaseNotes}
                </div>
              </section>
            )}

            {/* downloads per platform */}
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-white">Downloads</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Choose your platform. Files are served from Xhenvolt&apos;s official GitHub releases.
              </p>
              {byPlatform.size === 0 ? (
                <p className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-6 text-sm text-zinc-500">
                  No published downloads yet — check back soon.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {Array.from(byPlatform.entries()).map(([platform, releases]) => (
                    <PlatformDownload
                      key={platform}
                      slug={app.slug}
                      platform={platform}
                      releases={releases}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold text-white">Details</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <Detail label="Latest version" value={latest ? `v${latest.version}` : "—"} />
                <Detail
                  label="Channel"
                  value={latest ? CHANNEL_LABELS[latest.releaseChannel as keyof typeof CHANNEL_LABELS] ?? latest.releaseChannel : "—"}
                />
                <Detail label="Platforms" value={app.platforms.map(platformLabel).join(", ") || "—"} />
                <Detail
                  label="Size"
                  value={latest?.fileSize ? formatFileSize(latest.fileSize) : "—"}
                />
              </dl>
            </div>

            {latest?.checksumSha256 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">SHA-256 checksum</h3>
                </div>
                <code className="mt-2 block break-all rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-400">
                  {latest.checksumSha256}
                </code>
                <p className="mt-2 text-xs text-zinc-500">
                  Verify your download matches this value before installing.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Verified release</h3>
              </div>
              <p className="mt-2 flex items-start gap-2 text-xs text-zinc-500">
                <Github className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                Served from Xhenvolt&apos;s official GitHub release pipeline through a safety-checked redirect.
              </p>
            </div>

            <Link
              href="/cosmos"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cosmos
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-medium text-zinc-300">{value}</dd>
    </div>
  );
}

function PlatformDownload({
  slug,
  platform,
  releases,
}: {
  slug: string;
  platform: string;
  releases: AppRelease[];
}) {
  const primary = releases[0]!;
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{platformLabel(platform)}</span>
            <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500">
              {ARCH_LABELS[primary.architecture as keyof typeof ARCH_LABELS] ?? primary.architecture}
            </span>
            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${channelBadgeClass(primary.releaseChannel)}`}
            >
              {CHANNEL_LABELS[primary.releaseChannel as keyof typeof CHANNEL_LABELS] ?? primary.releaseChannel}
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            v{primary.version} ·{" "}
            {FILE_TYPE_LABELS[primary.fileType as keyof typeof FILE_TYPE_LABELS] ?? primary.fileType}
            {primary.fileSize ? ` · ${formatFileSize(primary.fileSize)}` : ""}
          </div>
        </div>
        <Link
          href={`/download/${slug}/${platform}`}
          rel="nofollow"
          data-track="cosmos_download"
          data-track-type="download"
          data-track-target={`${slug}/${platform}`}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white"
        >
          <Download className="h-4 w-4" />
          Download
        </Link>
      </div>
    </div>
  );
}
