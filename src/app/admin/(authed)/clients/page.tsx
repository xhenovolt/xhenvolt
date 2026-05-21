import Link from "next/link";
import { asc, desc, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { AdminTable, type TableColumn } from "../_components/AdminTable";
import { toggleClientPublished, softDeleteClient } from "./actions";

export const dynamic = "force-dynamic";

type Row = typeof schema.clients.$inferSelect;

async function getList(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.clients)
      .where(isNull(schema.clients.deletedAt))
      .orderBy(desc(schema.clients.featured), asc(schema.clients.sortOrder));
  } catch {
    return [];
  }
}

export default async function ClientsList() {
  const rows = await getList();
  const columns: TableColumn<Row>[] = [
    {
      key: "name",
      header: "Name",
      render: (r) => (
        <>
          <div>{r.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{r.location ?? ""}</div>
        </>
      ),
    },
    {
      key: "kind",
      header: "Kind",
      render: (r) => (
        <span className="text-xs uppercase tracking-wide text-slate-500">{r.kind}</span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (r) => (r.featured ? "★" : ""),
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
        title="Clients"
        description="Schools, SACCOs, and other organizations whose logos appear on the homepage and testimonials carousel."
        action={
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/clients/${r.id}`}
        newHref="/admin/clients/new"
        rowActions={[
          {
            label: "",
            action: (r) => async () => {
              "use server";
              await toggleClientPublished(r.id, !r.published);
            },
          },
          {
            label: "Delete",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await softDeleteClient(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
