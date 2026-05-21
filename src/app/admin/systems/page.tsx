import Link from "next/link";
import { asc, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { AdminTable, type TableColumn } from "../_components/AdminTable";
import { toggleSystemPublished, softDeleteSystem } from "./actions";

export const dynamic = "force-dynamic";

type SystemRow = typeof schema.systems.$inferSelect;

async function getList(): Promise<SystemRow[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.systems)
      .where(isNull(schema.systems.deletedAt))
      .orderBy(asc(schema.systems.sortOrder), asc(schema.systems.name));
  } catch {
    return [];
  }
}

export default async function SystemsList() {
  const rows = await getList();

  const columns: TableColumn<SystemRow>[] = [
    {
      key: "name",
      header: "Name",
      render: (r) => (
        <>
          <div>{r.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{r.tagline ?? ""}</div>
        </>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (r) => <span className="text-slate-700">{r.category ?? "—"}</span>,
    },
    {
      key: "deployments",
      header: "Deployments",
      render: (r) => <span className="text-slate-700">{r.deployments ?? 0}</span>,
    },
    {
      key: "flagship",
      header: "Flagship",
      render: (r) => (r.isFlagship ? "★" : ""),
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
        title="Systems"
        description="Flagship products that appear across the homepage and /services."
        action={
          <Link
            href="/admin/systems/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/systems/${r.id}`}
        newHref="/admin/systems/new"
        emptyTitle="No systems yet"
        emptyDescription="Add DRAIS, Jeton, Xhaira, etc."
        rowActions={[
          {
            label: "",
            action: (r) => async () => {
              "use server";
              await toggleSystemPublished(r.id, !r.published);
            },
          },
          {
            label: "Delete",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await softDeleteSystem(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
