import Link from "next/link";
import { asc, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { AdminTable, type TableColumn } from "../_components/AdminTable";
import { toggleMemberPublished, softDeleteMember } from "./actions";

export const dynamic = "force-dynamic";

type Row = typeof schema.teamMembers.$inferSelect;

async function getList(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.teamMembers)
      .where(isNull(schema.teamMembers.deletedAt))
      .orderBy(asc(schema.teamMembers.sortOrder), asc(schema.teamMembers.name));
  } catch {
    return [];
  }
}

export default async function TeamList() {
  const rows = await getList();
  const columns: TableColumn<Row>[] = [
    {
      key: "name",
      header: "Name",
      render: (r) => (
        <>
          <div>{r.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{r.role}</div>
        </>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (r) => <span className="text-slate-700">{r.location ?? "—"}</span>,
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
        title="Team"
        description="Members shown on /about. Drag-and-drop reordering ships in a later phase — use the Sort order field for now."
        action={
          <Link
            href="/admin/team/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/team/${r.id}`}
        newHref="/admin/team/new"
        rowActions={[
          {
            label: "",
            action: (r) => async () => {
              "use server";
              await toggleMemberPublished(r.id, !r.published);
            },
          },
          {
            label: "Delete",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await softDeleteMember(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
