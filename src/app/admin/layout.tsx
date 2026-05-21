import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xhenvolt Admin",
  robots: { index: false, follow: false },
};

/**
 * /admin shell — intentionally bare.
 *
 * Why: the dashboard chrome (sidebar, top bar, auth check) lives one
 * level deeper, inside the (authed) route group. The login page sits at
 * /admin/login under THIS layout only, so it never inherits the
 * authenticated shell.
 *
 * This file MUST NOT do any auth checks. Doing one here previously
 * caused an infinite redirect loop because the layout couldn't reliably
 * tell whether it was rendering /admin/login (which must NOT redirect)
 * or a protected page (which must). Route groups give us URL-level
 * isolation instead.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;
}
