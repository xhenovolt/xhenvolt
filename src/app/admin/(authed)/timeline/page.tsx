import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { AdminTable, type TableColumn } from "../_components/AdminTable";
import { toggleTimelinePublished, deleteTimeline } from "./actions";

export const dynamic = "force-dynamic";

type Row = typeof schema.timelineEntries.$inferSelect;

async function getList(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.timelineEntries)
      .orderBy(asc(schema.timelineEntries.occurredOn));
  } catch {
    return [];
  }
}

export default async function TimelineList() {
  const rows = await getList();
  const columns: TableColumn<Row>[] = [
    {
      key: "label",
      header: "Period",
      render: (r) => (
        <span className="text-xs uppercase tracking-wide text-slate-500">
          {r.label ?? String(r.occurredOn).slice(0, 10)}
        </span>
      ),
    },
    {
      key: "title",
      header: "Title",
      render: (r) => (
        <>
          <div>{r.title}</div>
          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {r.description}
          </div>
        </>
      ),
    },
    {
      key: "highlight",
      header: "Key",
      render: (r) => (r.highlight ? "★" : ""),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <StatusBadge active={r.published}>{r.published ? "Published" : "Draft"}</StatusBadge>
      ),
    },
  ];
  return (
    <div>
      <PageHeader
        title="Timeline"
        description="Company history entries shown on the homepage 'Our Journey' section."
        action={
          <Link
            href="/admin/timeline/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/timeline/${r.id}`}
        newHref="/admin/timeline/new"
        rowActions={[
          {
            label: "",
            action: (r) => async () => {
              "use server";
              await toggleTimelinePublished(r.id, !r.published);
            },
          },
          {
            label: "Delete",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await deleteTimeline(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
