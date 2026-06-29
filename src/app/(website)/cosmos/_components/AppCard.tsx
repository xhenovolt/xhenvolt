import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import type { AppWithReleases } from "@/lib/repositories/cosmos.repo";
import {
  formatFileSize,
  platformLabel,
  channelBadgeClass,
  CHANNEL_LABELS,
} from "@/lib/cosmos/format";
import { AppIcon } from "./AppIcon";

/**
 * Premium enterprise app card for the Cosmos grid. Server component.
 */
export function AppCard({ app }: { app: AppWithReleases }) {
  const latest = app.latest;
  const accent = app.brandColor ?? "#6366f1";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900">
      {/* subtle top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950"
          style={{ boxShadow: `0 0 0 1px ${accent}22, 0 0 24px ${accent}18` }}
        >
          <AppIcon name={app.icon} iconUrl={app.iconUrl} brandColor={accent} alt={app.name} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-zinc-50">{app.name}</h3>
            {app.featured && (
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-300">
                Featured
              </span>
            )}
          </div>
          {app.category && (
            <div className="mt-0.5 text-xs text-zinc-500">{app.category}</div>
          )}
        </div>
      </div>

      {app.tagline && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-400">
          {app.tagline}
        </p>
      )}

      {/* meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {latest && (
          <span className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
            v{latest.version}
          </span>
        )}
        {latest && (
          <span
            className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${channelBadgeClass(latest.releaseChannel)}`}
          >
            {CHANNEL_LABELS[latest.releaseChannel as keyof typeof CHANNEL_LABELS] ?? latest.releaseChannel}
          </span>
        )}
        {latest?.fileSize ? (
          <span className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-[11px] text-zinc-400">
            {formatFileSize(latest.fileSize)}
          </span>
        ) : null}
      </div>

      {/* platform badges */}
      {app.platforms.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {app.platforms.map((p) => (
            <span
              key={p}
              className="rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500"
            >
              {platformLabel(p)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 pt-1">
        {latest ? (
          <Link
            href={`/download/${app.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            rel="nofollow"
            data-track="cosmos_download"
            data-track-type="download"
            data-track-target={app.slug}
          >
            <Download className="h-4 w-4" />
            Download
          </Link>
        ) : (
          <span className="inline-flex flex-1 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-500">
            Coming soon
          </span>
        )}
        <Link
          href={`/cosmos/${app.slug}`}
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
