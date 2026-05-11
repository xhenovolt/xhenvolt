import Link from "next/link";
import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";

export const metadata = {
  title: "Xhenvolt Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/messages", label: "Inbox" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const c = await cookies();
  const session = await verifySession(c.get(SESSION_COOKIE)?.value);
  const h = await headers();
  const path = h.get("x-xhv-path") ?? "";

  // /admin/login renders without the admin chrome
  if (path === "/admin/login" || !session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <Link href="/admin" className="block">
            <div className="text-lg font-semibold">Xhenvolt</div>
            <div className="text-xs text-slate-400">Admin</div>
          </Link>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map((n) => {
            const active =
              n.href === "/admin"
                ? path === "/admin"
                : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`block px-6 py-2.5 text-sm transition-colors ${
                  active ? "bg-slate-800 text-white border-l-2 border-blue-400" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <form action="/api/admin/logout" method="post" className="p-4 border-t border-slate-800">
          <button
            type="submit"
            className="w-full text-left text-sm text-slate-400 hover:text-slate-100"
          >
            Sign out
          </button>
        </form>
        <div className="px-4 pb-4 text-[10px] text-slate-500">
          <Link href="/" target="_blank" className="hover:text-slate-300">
            ↗ View live site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
