import { NextResponse } from "next/server";
import { runHealthChecks } from "@/lib/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Operational truth endpoint. Returns the worst overall status + each
 * individual probe. Used by:
 *  - /admin/system-health  (visual dashboard)
 *  - /admin/login          (warns when DB/auth is degraded BEFORE login)
 *  - external monitors (Pingdom, UptimeRobot, etc.)
 *
 * Never throws. If the report itself can't be generated, returns a 500
 * with the failure mode classified.
 */
export async function GET() {
  try {
    const report = await runHealthChecks();
    const status =
      report.status === "ok" ? 200 : report.status === "degraded" ? 207 : 503;
    return NextResponse.json(report, { status });
  } catch (err) {
    return NextResponse.json(
      {
        status: "down",
        generatedAt: new Date().toISOString(),
        probes: [],
        error: {
          code: "health_check_failed",
          message: err instanceof Error ? err.message : String(err),
        },
      },
      { status: 500 },
    );
  }
}
