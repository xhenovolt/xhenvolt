import Link from "next/link";
import { PageHeader } from "@/app/admin/_components/ui";

export default function NewPageStub() {
  return (
    <div>
      <PageHeader
        title="Create page"
        description="Page creation will let you author new routes and assign editable sections."
      />
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
        Page builder coming soon. This stub sets the route and editing framework for Phase 3.
      </div>
      <div className="mt-6">
        <Link href="/admin/pages" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          ← Back to pages
        </Link>
      </div>
    </div>
  );
}
