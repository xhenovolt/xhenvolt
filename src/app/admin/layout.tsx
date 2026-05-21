import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
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

  const c = await cookies();
  const session = await verifySession(c.get(SESSION_COOKIE)?.value);

  // Defense in depth: middleware should have redirected anonymous users
  // before reaching here. If the session is missing for any reason, render
  // an empty shell rather than leaking the admin UI.
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">Redirecting…</div>
      </div>
    );
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
