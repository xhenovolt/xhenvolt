"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

type Status = "ok" | "degraded" | "down" | "unknown";

const STYLES: Record<Status, { dot: string; text: string; bg: string; label: string }> = {
  ok: { dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50 border-green-200", label: "OK" },
  degraded: { dot: "bg-amber-500", text: "text-amber-800", bg: "bg-amber-50 border-amber-200", label: "DEGRADED" },
  down: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50 border-red-200", label: "DOWN" },
  unknown: { dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-50 border-slate-200", label: "—" },
};

/**
 * Small live indicator in the admin top bar. Polls /api/admin/health
 * every 60s. Always visible so the operator never has to "wonder if
 * the DB is up".
 */
export default function HealthPill() {
  const [status, setStatus] = useState<Status>("unknown");

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const r = await fetch("/api/admin/health", { cache: "no-store" });
        const data = await r.json();
        if (!cancelled) setStatus((data?.status as Status) ?? "unknown");
      } catch {
        if (!cancelled) setStatus("unknown");
      }
    }
    tick();
    const t = setInterval(tick, 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const s = STYLES[status];
  return (
    <Link
      href="/admin/system-health"
      title="Open system health dashboard"
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium ${s.bg} ${s.text}`}
    >
      <Activity className="w-3 h-3" />
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <span className="uppercase tracking-wider">{s.label}</span>
    </Link>
  );
}
