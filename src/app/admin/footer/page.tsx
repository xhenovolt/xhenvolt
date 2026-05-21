import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "@/app/admin/_components/ui";
import { toggleFooterPublished, deleteFooterLink } from "./actions";

export const dynamic = "force-dynamic";

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  column: string;
  isExternal: boolean;
  sortOrder: number;
  published: boolean;
}

async function getFooterLinks() {
  if (!db) return [];
  return db
    .select()
    .from(schema.footerLinks)
    .orderBy(asc(schema.footerLinks.column), asc(schema.footerLinks.sortOrder));
}

export default async function FooterList() {
  const rows = await getFooterLinks();
  return (
    <div>
      <PageHeader
        title="Footer links"
        description="Manage footer navigation columns and published state for the live site." 
        action={
          <Link
            href="/admin/footer/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New footer link
          </Link>
        }
      />
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Label</th>
              <th className="px-4 py-3 font-medium">Href</th>
              <th className="px-4 py-3 font-medium">Column</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No footer links yet. Click <strong>+ New footer link</strong> to add one.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/footer/${r.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {r.label}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700 break-all">{r.href}</td>
                <td className="px-4 py-3 text-slate-700">{r.column}</td>
                <td className="px-4 py-3">
                  <StatusBadge active={r.published}>
                    {r.published ? "Published" : "Draft"}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <form action={async () => {
                      "use server";
                      await toggleFooterPublished(r.id, !r.published);
                    }}>
                      <button
                        type="submit"
                        className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md px-2 py-1"
                      >
                        {r.published ? "Hide" : "Publish"}
                      </button>
                    </form>
                    <form action={async () => {
                      "use server";
                      await deleteFooterLink(r.id);
                    }}>
                      <button
                        type="submit"
                        className="text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md px-2 py-1"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
