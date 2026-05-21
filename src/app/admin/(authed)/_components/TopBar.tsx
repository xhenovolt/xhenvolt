"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import HealthPill from "./HealthPill";

interface Crumb {
  href: string;
  label: string;
}

function buildBreadcrumbs(path: string): Crumb[] {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0 || parts[0] !== "admin") return [];
  const crumbs: Crumb[] = [{ href: "/admin", label: "Admin" }];
  let acc = "/admin";
  for (let i = 1; i < parts.length; i++) {
    acc += "/" + parts[i];
    const label = parts[i]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ href: acc, label });
  }
  return crumbs;
}

export default function TopBar() {
  const path = usePathname() ?? "/admin";
  const crumbs = buildBreadcrumbs(path);
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-1.5 text-sm">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                {isLast ? (
                  <span className="font-medium text-slate-900 truncate">
                    {c.label}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className="text-slate-500 hover:text-slate-900 transition-colors truncate"
                  >
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search (coming soon)"
            disabled
            className="bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-sm w-64 text-slate-400 placeholder:text-slate-400 cursor-not-allowed"
          />
        </div>
        <HealthPill />
      </div>
    </header>
  );
}
