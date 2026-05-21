import Link from "next/link";
import { PageHeader } from "@/app/admin/_components/ui";

export const dynamic = "force-dynamic";

export default function PagesIndex() {
  return (
    <div>
      <PageHeader
        title="Pages"
        description="Upcoming CMS pages dashboard. Manage page-level content and section composition here."
        action={
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New page
          </Link>
        }
      />
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
        Page listing and section assignment foundation is ready. Next step: page drafts and dynamic section composition.
      </div>
    </div>
  );
}
