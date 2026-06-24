import {
  Monitor,
  Smartphone,
  Cpu,
  Box,
  Package,
  Database,
  Boxes,
  AppWindow,
  HardDrive,
  Layers,
  Rocket,
  Shield,
  Terminal,
  Gauge,
  type LucideIcon,
} from "lucide-react";

/**
 * Curated Lucide icon map for Cosmos app cards. Admin stores an icon *name*
 * (string) on the product; we resolve it here to avoid bundling all of
 * lucide-react. Falls back to a neutral Box.
 */
const ICONS: Record<string, LucideIcon> = {
  monitor: Monitor,
  desktop: Monitor,
  smartphone: Smartphone,
  mobile: Smartphone,
  cpu: Cpu,
  box: Box,
  package: Package,
  database: Database,
  boxes: Boxes,
  appwindow: AppWindow,
  app: AppWindow,
  harddrive: HardDrive,
  disk: HardDrive,
  layers: Layers,
  rocket: Rocket,
  shield: Shield,
  terminal: Terminal,
  gauge: Gauge,
};

export function AppIcon({
  name,
  iconUrl,
  brandColor,
  className = "h-7 w-7",
  alt = "",
}: {
  name?: string | null;
  iconUrl?: string | null;
  brandColor?: string | null;
  className?: string;
  alt?: string;
}) {
  if (iconUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={iconUrl} alt={alt} className={`${className} object-contain`} />;
  }
  const Icon = ICONS[(name ?? "").toLowerCase().replace(/[^a-z]/g, "")] ?? Box;
  return <Icon className={className} style={brandColor ? { color: brandColor } : undefined} />;
}
