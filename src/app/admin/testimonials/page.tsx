import Link from "next/link";
import { asc, desc, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { togglePublished, softDeleteTestimonial } from "./actions";

export const dynamic = "force-dynamic";

async function getList() {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.testimonials)
      .where(isNull(schema.testimonials.deletedAt))
      .orderBy(desc(schema.testimonials.featured), asc(schema.testimonials.sortOrder))
      .limit(200);
  } catch {
    return [];
  }
}

export default async function TestimonialsList() {
  const rows = await getList();
  return (
    <div>
      <PageHeader
        title="Testimonials"
        description={`${rows.length} active testimonials. Featured ones surface as the "happiest client" block.`}
        action={
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Organization</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No testimonials yet. Click <strong>+ New</strong> to add one.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/testimonials/${r.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {r.authorName}
                  </Link>
                  {r.authorRole && (
                    <div className="text-xs text-slate-500 mt-0.5">{r.authorRole}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700">{r.organization ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge active={r.published}>
                    {r.published ? "Published" : "Hidden"}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-slate-700">{r.featured ? "★" : ""}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await togglePublished(r.id, !r.published);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md px-2 py-1"
                      >
                        {r.published ? "Hide" : "Publish"}
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await softDeleteTestimonial(r.id);
                      }}
                    >
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
