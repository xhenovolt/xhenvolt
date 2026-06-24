import type { Metadata } from "next";
import Link from "next/link";
import {
  Rocket,
  ShieldCheck,
  GitBranch,
  FileCheck2,
  Github,
  RefreshCw,
  Layers,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { listPublishedApps } from "@/lib/repositories/cosmos.repo";
import { AppCard } from "./_components/AppCard";

const BASE_URL = "https://xhenvolt.com";

export const metadata: Metadata = {
  title: "Xhenvolt Cosmos — Official Software Release Center",
  description:
    "Download official Xhenvolt software: DRAIS Desktop and more. Windows, Linux, Android and ISO builds served straight from verified GitHub releases with version transparency.",
  keywords: [
    "Xhenvolt Cosmos",
    "Xhenvolt software downloads",
    "DRAIS Desktop download",
    "Xhenvolt app store",
    "official Xhenvolt releases",
  ],
  alternates: { canonical: `${BASE_URL}/cosmos` },
  openGraph: {
    title: "Xhenvolt Cosmos — Official Software Release Center",
    description:
      "The official place to download Xhenvolt products. Verified releases, version transparency, safe installs.",
    type: "website",
    url: `${BASE_URL}/cosmos`,
    siteName: "Xhenvolt Uganda",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Xhenvolt Cosmos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xhenvolt Cosmos — Official Software Release Center",
    description: "Verified Xhenvolt software releases. Download safely.",
    images: ["/og-image.png"],
  },
};

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  "invalid-app": "That download link wasn't valid.",
  "not-found": "We couldn't find a published release for that app yet.",
  "unsafe-url": "That release link failed our safety check and was blocked.",
  "invalid-platform": "That platform isn't available for this app.",
};

export default async function CosmosStorePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, apps] = await Promise.all([searchParams, listPublishedApps()]);
  const featured = apps.filter((a) => a.featured);
  const errorMsg = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <main className="bg-zinc-950 text-zinc-100">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.18), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(60% 60% at 50% 0%, black, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-xs font-medium text-zinc-300">
            <Rocket className="h-3.5 w-3.5 text-indigo-400" />
            Xhenvolt Cosmos
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            The official software release center for Xhenvolt products.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Download DRAIS Desktop and every Xhenvolt application from one trusted place.
            Verified releases, transparent versions, and safe installs — straight from our
            official GitHub release pipeline.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#apps"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Browse apps
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#trust"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-600 hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" />
              Why it's safe
            </Link>
          </div>
        </div>
      </section>

      {errorMsg && (
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {errorMsg}
          </div>
        </div>
      )}

      {/* ===== FEATURED ===== */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pt-16">
          <SectionHeading
            eyebrow="Featured"
            title="Flagship Xhenvolt software"
            description="The products our teams and partners rely on every day."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>
      )}

      {/* ===== APP GRID ===== */}
      <section id="apps" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
        <SectionHeading
          eyebrow="All apps"
          title="Browse the Cosmos catalog"
          description="Every published Xhenvolt application, with the latest version and supported platforms."
        />
        {apps.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-20 text-center">
            <Layers className="mx-auto h-8 w-8 text-zinc-600" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-200">No apps published yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Cosmos is being prepared. Published Xhenvolt applications will appear here soon.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </section>

      {/* ===== TRUST / SAFETY ===== */}
      <section id="trust" className="border-y border-zinc-800 bg-zinc-900/40 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading
            eyebrow="Trust & safety"
            title="Why downloading from Cosmos is safe"
            description="Cosmos is the single source of truth for genuine Xhenvolt software."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <TrustCard
              icon={Github}
              title="Official source only"
              body="Every download is served directly from Xhenvolt's verified GitHub release pipeline — never a re-hosted mirror."
            />
            <TrustCard
              icon={ShieldCheck}
              title="Allow-listed hosts"
              body="Download links are validated against an approved host list before any redirect. Unsafe URLs are blocked."
            />
            <TrustCard
              icon={GitBranch}
              title="Version transparency"
              body="Each app shows its exact version, release channel and platform so you always know what you're installing."
            />
            <TrustCard
              icon={FileCheck2}
              title="Checksum support"
              body="Where published, SHA-256 checksums let you verify a file is exactly what Xhenvolt released."
            />
          </div>
        </div>
      </section>

      {/* ===== FUTURE / UPDATES ===== */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 sm:p-12">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-indigo-300">
            <RefreshCw className="h-3.5 w-3.5" />
            On the roadmap
          </div>
          <h2 className="mt-4 max-w-2xl text-2xl font-bold text-white sm:text-3xl">
            Cosmos is growing into a full update platform.
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Soon Cosmos will deliver platform-specific downloads, automatic update channels,
            in-app update notifications for DRAIS Desktop, and signed releases — so keeping
            Xhenvolt software current is effortless.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Auto-updates", "Per-platform builds", "Signed releases", "Update channels", "Release notes feed"].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400"
                >
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-zinc-400">{description}</p>}
    </div>
  );
}

function TrustCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Github;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
        <Icon className="h-5 w-5 text-indigo-400" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{body}</p>
    </div>
  );
}
