import Link from "next/link";
import { asc, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { toggleFaqPublished, softDeleteFaq } from "./actions";

export const dynamic = "force-dynamic";

async function getList() {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.faqs)
      .where(isNull(schema.faqs.deletedAt))
      .orderBy(asc(schema.faqs.category), asc(schema.faqs.sortOrder))
      .limit(500);
  } catch {
    return [];
  }
}

export default async function FaqsList() {
  const rows = await getList();
  return (
    <div>
      <PageHeader
        title="FAQs"
        description="These power the Xhenvolt AI assistant's responses. The retrieval engine scores against the question + keywords."
        action={
          <Link
            href="/admin/faqs/new"
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
              <th className="px-4 py-3 font-medium">Question</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No FAQs yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/faqs/${r.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {r.question}
                  </Link>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">{r.slug}</div>
                </td>
                <td className="px-4 py-3 text-slate-700">{r.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge active={r.published}>
                    {r.published ? "Published" : "Hidden"}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await toggleFaqPublished(r.id, !r.published);
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
                        await softDeleteFaq(r.id);
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
