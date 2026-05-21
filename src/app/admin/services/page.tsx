import Link from "next/link";
import { asc, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { AdminTable, type TableColumn } from "../_components/AdminTable";
import { toggleServicePublished, softDeleteService } from "./actions";

export const dynamic = "force-dynamic";

type ServiceRow = typeof schema.services.$inferSelect;

async function getList(): Promise<ServiceRow[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.services)
      .where(isNull(schema.services.deletedAt))
      .orderBy(asc(schema.services.sortOrder), asc(schema.services.title));
  } catch {
    return [];
  }
}

export default async function ServicesList() {
  const rows = await getList();
  const columns: TableColumn<ServiceRow>[] = [
    {
      key: "title",
      header: "Title",
      render: (r) => (
        <>
          <div>{r.title}</div>
          <div className="text-xs text-slate-500 mt-0.5">{r.tagline ?? ""}</div>
        </>
      ),
    },
    {
      key: "audience",
      header: "Audience",
      render: (r) => <span className="text-slate-700">{r.audience ?? "—"}</span>,
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
        title="Services"
        description="Service offerings shown on /services."
        action={
          <Link
            href="/admin/services/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/services/${r.id}`}
        newHref="/admin/services/new"
        rowActions={[
          {
            label: "",
            action: (r) => async () => {
              "use server";
              await toggleServicePublished(r.id, !r.published);
            },
          },
          {
            label: "Delete",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await softDeleteService(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
