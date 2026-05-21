import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquareQuote,
  HelpCircle,
  Cpu,
  Sparkles,
  Inbox,
  Settings,
  Image as ImageIcon,
  Users,
  Globe,
  FileText,
  BarChart3,
  ExternalLink,
  Type,
  History,
  Building,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/hero", label: "Hero slides", icon: Sparkles },
      { href: "/admin/systems", label: "Systems", icon: Cpu },
      { href: "/admin/services", label: "Services", icon: FileText },
      { href: "/admin/statistics", label: "Statistics", icon: BarChart3 },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { href: "/admin/clients", label: "Clients", icon: Building },
      { href: "/admin/timeline", label: "Timeline", icon: History },
      { href: "/admin/media", label: "Media", icon: ImageIcon, disabled: true, badge: "Soon" },
    ],
  },
  {
    label: "Pages",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/navigation", label: "Navigation", icon: Globe },
      { href: "/admin/footer", label: "Footer", icon: Globe },
      { href: "/admin/seo", label: "SEO", icon: Type },
    ],
  },
  {
    label: "AI",
    items: [
      { href: "/admin/ai-docs", label: "Training Docs", icon: Sparkles },
      { href: "/admin/ai-logs", label: "Conversation Logs", icon: MessageSquareQuote, disabled: true, badge: "Soon" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/messages", label: "Inbox", icon: Inbox },
      { href: "/admin/audit", label: "Audit log", icon: History },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar({
  path,
  adminEmail,
  adminName,
}: {
  path: string;
  adminEmail: string;
  adminName: string | null;
}) {
  return (
    <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col border-r border-slate-800">
      <div className="px-5 py-4 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            X
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Xhenvolt</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              Admin
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <div className="px-5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {section.label}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin"
                  ? path === "/admin"
                  : path.startsWith(item.href);
              return (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  Icon={Icon}
                  active={active}
                  disabled={item.disabled}
                  badge={item.badge}
                />
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-5 py-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs font-semibold text-slate-300">
            {(adminName ?? adminEmail).slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-slate-200 truncate">
              {adminName ?? adminEmail.split("@")[0]}
            </div>
            <div className="text-[10px] text-slate-500 truncate">{adminEmail}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
          >
            <ExternalLink className="w-3 h-3" />
            View site
          </Link>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="text-[11px] text-slate-400 hover:text-slate-200"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  href,
  label,
  Icon,
  active,
  disabled,
  badge,
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
  disabled?: boolean;
  badge?: string;
}) {
  const base =
    "flex items-center gap-3 px-5 py-2 text-sm transition-colors group";
  if (disabled) {
    return (
      <div
        className={`${base} text-slate-600 cursor-not-allowed select-none`}
        aria-disabled="true"
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 truncate">{label}</span>
        {badge && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} ${
        active
          ? "bg-slate-800 text-white border-l-2 border-blue-400 pl-[18px]"
          : "text-slate-300 hover:bg-slate-900 hover:text-white"
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 font-medium uppercase tracking-wider">
          {badge}
        </span>
      )}
    </Link>
  );
}
