import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { hasDb } from "@/lib/db";
import Sidebar from "./_components/Sidebar";
import TopBar from "./_components/TopBar";

/**
 * Authenticated admin shell.
 *
 * Only routes under (authed) inherit this layout, so it can safely
 * assume "the user wants to access a protected page" without
 * URL-sniffing. The /admin/login route lives one level up and bypasses
 * this entire layout.
 *
 * Auth model:
 *   - Middleware is the primary gate; an unauthenticated request to a
 *     (authed) route gets redirected before this code runs.
 *   - This layout re-checks the session as defense in depth. If the
 *     session is missing here, redirecting to /admin/login is safe
 *     because /admin/login does NOT inherit this layout — no loop.
 */
export default async function AuthedAdminLayout({ children }: { children: ReactNode }) {
  if (!hasDb()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
          <div className="text-sm font-semibold text-amber-700 mb-2">
            Database connection unavailable
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            The admin can&apos;t reach TiDB. One or more of{" "}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">TIDB_HOST</code>,{" "}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">TIDB_USER</code>,{" "}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">TIDB_PASSWORD</code>,{" "}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">TIDB_DB</code>{" "}
            is missing. Common fixes:
          </p>
          <ol className="text-sm text-slate-700 space-y-1.5 list-decimal list-inside">
            <li>
              Ensure{" "}
              <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">.env.local</code>{" "}
              exists at the repo root with all four TIDB_* variables.
            </li>
            <li>
              Verify the values match the TiDB Cloud console for this cluster.
            </li>
            <li>
              Restart the dev server (
              <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">Ctrl+C</code> then{" "}
              <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">npm run dev</code>) so the env loader picks it up.
            </li>
          </ol>
          <div className="mt-4 text-xs text-slate-500">
            Visit{" "}
            <a href="/api/admin/health" className="underline">/api/admin/health</a>{" "}
            for the full diagnostic.
          </div>
        </div>
      </div>
    );
  }

  const c = await cookies();
  const session = await verifySession(c.get(SESSION_COOKIE)?.value);
  if (!session) {
    // Safe because /admin/login lives outside this layout — no loop.
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar adminEmail={session.email} adminName={session.name} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-x-auto">
          <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
