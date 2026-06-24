import type {
  Platform,
  ReleaseChannel,
  FileType,
  Architecture,
} from "@/lib/db/schema/cosmos";

/** Human-readable file size from a byte count. */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  windows: "Windows",
  linux: "Linux",
  android: "Android",
  macos: "macOS",
  web: "Web",
  iso: "ISO Image",
  other: "Other",
};

export const CHANNEL_LABELS: Record<ReleaseChannel, string> = {
  stable: "Stable",
  beta: "Beta",
  alpha: "Alpha",
  legacy: "Legacy",
};

export const ARCH_LABELS: Record<Architecture, string> = {
  x64: "x64",
  arm64: "ARM64",
  universal: "Universal",
  other: "Other",
};

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  exe: ".exe Installer",
  deb: ".deb Package",
  apk: ".apk (Android)",
  appimage: "AppImage",
  iso: ".iso Image",
  zip: ".zip Archive",
  dmg: ".dmg (macOS)",
  other: "File",
};

/** Tailwind classes for the small channel pill. */
export function channelBadgeClass(channel: string): string {
  switch (channel) {
    case "stable":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
    case "beta":
      return "bg-amber-500/10 text-amber-300 border-amber-500/30";
    case "alpha":
      return "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30";
    case "legacy":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
  }
}

export function platformLabel(p: string | null | undefined): string {
  return PLATFORM_LABELS[(p ?? "other") as Platform] ?? "Other";
}
