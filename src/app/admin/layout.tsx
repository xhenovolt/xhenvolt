import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { hasDb } from "@/lib/db";
import Sidebar from "./_components/Sidebar";
import TopBar from "./_components/TopBar";

export const metadata: Metadata = {
  title: "Xhenvolt Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin layout — completely isolated from the public website.
 *
 * Because the root layout (src/app/layout.tsx) only renders <html>/<body>
 * and the public navbar/footer live under app/(website)/layout.tsx, an
 * /admin page can never inherit any public chrome. This file owns the
 * full admin shell.
 *
 * Login page (/admin/login) renders without the dashboard chrome — it's
 * detected via the x-xhv-path header set by middleware.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const path = h.get("x-xhv-path") ?? "";

  // Login page renders bare — no sidebar, no topbar.
  if (path === "/admin/login") {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  // If the DB isn't reachable, render a diagnostic instead of looping.
  // This is the single most common dev-setup failure: DATABASE_URL not
  // loaded, so verifySession returns null forever and middleware/layout
  // can't agree.
  if (!hasDb()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
          <div className="text-sm font-semibold text-amber-700 mb-2">
            Database connection unavailable
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            The admin can't reach Neon. <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">DATABASE_URL</code>{" "}
            is not set in the running process. Common fixes:
          </p>
          <ol className="text-sm text-slate-700 space-y-1.5 list-decimal list-inside">
            <li>Ensure <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">.env.local</code> exists at the repo root.</li>
            <li>The variable name is exactly <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">DATABASE_URL</code>.</li>
            <li>Restart the dev server (<code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">Ctrl+C</code> then <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">npm run dev</code>) so the env loader picks it up.</li>
          </ol>
        </div>
      </div>
    );
  }

  const c = await cookies();
  const session = await verifySession(c.get(SESSION_COOKIE)?.value);

  // Defense in depth: middleware should have redirected anonymous users
  // before reaching here. If the session is missing for any other
  // reason, do an actual redirect rather than showing dead-end text.
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar
        path={path}
        adminEmail={session.email}
        adminName={session.name}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar path={path} />
        <main className="flex-1 overflow-x-auto">
          <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
