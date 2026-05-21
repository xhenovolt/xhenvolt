import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { AdminTable, type TableColumn } from "../_components/AdminTable";
import { toggleStatPublished, deleteStat } from "./actions";

export const dynamic = "force-dynamic";

type Row = typeof schema.statistics.$inferSelect;

async function getList(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.statistics)
      .orderBy(asc(schema.statistics.scope), asc(schema.statistics.sortOrder));
  } catch {
    return [];
  }
}

export default async function StatsList() {
  const rows = await getList();
  const columns: TableColumn<Row>[] = [
    {
      key: "label",
      header: "Label",
      render: (r) => (
        <>
          <div>{r.label}</div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">{r.key}</div>
        </>
      ),
    },
    {
      key: "value",
      header: "Value",
      render: (r) => (
        <span className="font-mono font-semibold text-slate-900">
          {r.value}
          <span className="text-slate-500">{r.suffix ?? ""}</span>
        </span>
      ),
    },
    {
      key: "scope",
      header: "Scope",
      render: (r) => (
        <span className="text-xs uppercase tracking-wide text-slate-500">
          {r.scope ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <StatusBadge active={r.published}>
          {r.published ? "Published" : "Draft"}
        </StatusBadge>
      ),
    },
  ];
  return (
    <div>
      <PageHeader
        title="Statistics"
        description="Numbers that appear across the site (31 schools, 37 orgs, 99.9% uptime, etc.). The frontend looks them up by key."
        action={
          <Link
            href="/admin/statistics/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/statistics/${r.id}`}
        newHref="/admin/statistics/new"
        rowActions={[
          {
            label: "",
            action: (r) => async () => {
              "use server";
              await toggleStatPublished(r.id, !r.published);
            },
          },
          {
            label: "Delete",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await deleteStat(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
