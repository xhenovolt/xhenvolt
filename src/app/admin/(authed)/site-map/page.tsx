import Link from "next/link";
import { ExternalLink, Pencil, Globe2, Layers } from "lucide-react";
import { PageHeader } from "../_components/ui";

export const dynamic = "force-dynamic";

/**
 * Content Map — bridges "what I see on xhenvolt.com" to "where do I edit it".
 *
 * The CMS is organized by content type (Hero, Systems, Settings…). This page
 * re-organizes those by PUBLIC PAGE so a non-technical editor can find the
 * exact screen that controls any element they see on the live site.
 */

interface Section {
  name: string;
  where: string;
  href: string;
}
interface PageEntry {
  page: string;
  route: string;
  sections: Section[];
}

const PAGES: PageEntry[] = [
  {
    page: "Homepage",
    route: "/",
    sections: [
      { name: "Hero — headline, sub-text, buttons, tags", where: "Hero slides", href: "/admin/hero" },
      { name: "Flagship products (DRAIS, etc.)", where: "Systems", href: "/admin/systems" },
      { name: "Statistics / counters", where: "Statistics", href: "/admin/statistics" },
      { name: "Testimonials", where: "Testimonials", href: "/admin/testimonials" },
      { name: "Our journey / timeline", where: "Timeline", href: "/admin/timeline" },
      { name: "Services list", where: "Services", href: "/admin/services" },
    ],
  },
  {
    page: "About",
    route: "/about",
    sections: [
      { name: "Team members", where: "Team", href: "/admin/team" },
      { name: "Company timeline", where: "Timeline", href: "/admin/timeline" },
    ],
  },
  {
    page: "Services",
    route: "/services",
    sections: [
      { name: "Products / systems", where: "Systems", href: "/admin/systems" },
      { name: "Service offerings", where: "Services", href: "/admin/services" },
    ],
  },
  {
    page: "Contact",
    route: "/contact",
    sections: [
      { name: "Address, emails, phones, hours", where: "Settings → Contact", href: "/admin/settings" },
      { name: "Form submissions land in", where: "Inbox", href: "/admin/messages" },
    ],
  },
  {
    page: "FAQ",
    route: "/faq",
    sections: [{ name: "Questions & answers", where: "FAQs", href: "/admin/faqs" }],
  },
  {
    page: "Cosmos store",
    route: "/cosmos",
    sections: [
      { name: "Apps shown in the store", where: "Cosmos → Apps", href: "/admin/cosmos/apps" },
      { name: "Versions & download links", where: "Cosmos → Releases", href: "/admin/cosmos/releases" },
    ],
  },
];

const GLOBAL: Section[] = [
  { name: "Footer address, phones, email, hours", where: "Settings → Contact", href: "/admin/settings" },
  { name: "Footer link columns", where: "Footer", href: "/admin/footer" },
  { name: "Top navigation menu", where: "Navigation", href: "/admin/navigation" },
  { name: "WhatsApp floating button", where: "Settings → WhatsApp", href: "/admin/settings" },
  { name: "AI assistant greeting & replies", where: "Settings → AI Assistant", href: "/admin/settings" },
  { name: "Per-page SEO (title, description, social image)", where: "SEO", href: "/admin/seo" },
  { name: "Images / logos / icons", where: "Media Library", href: "/admin/media" },
];

function SectionRow({ s }: { s: Section }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <div className="text-sm text-slate-800">{s.name}</div>
        <div className="text-xs text-slate-400">edited in: {s.where}</div>
      </div>
      <Link
        href={s.href}
        className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Link>
    </div>
  );
}

export default function SiteMapPage() {
  return (
    <div>
      <PageHeader
        title="Content Map"
        description="Find anything on the website and jump straight to the screen that edits it. Changes show on the live site within seconds of saving."
      />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <Layers className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <div>
          <strong>How to edit the website:</strong> pick the page below, find the part you want
          to change, and click <strong>Edit</strong>. For example, the <em>address in the footer</em>{" "}
          is under <strong>Settings → Contact → Address</strong> (linked in “Site-wide” below).
        </div>
      </div>

      <div className="space-y-5">
        {PAGES.map((p) => (
          <section key={p.route} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">{p.page}</h2>
              <a
                href={p.route}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View live {p.route}
              </a>
            </div>
            <div className="divide-y divide-slate-100">
              {p.sections.map((s) => (
                <SectionRow key={s.name} s={s} />
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe2 className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900">Site-wide (every page)</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {GLOBAL.map((s) => (
              <SectionRow key={s.name} s={s} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
