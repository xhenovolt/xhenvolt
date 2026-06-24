import Link from "next/link";
import { asc, desc, eq, count } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../../_components/ui";
import { AdminTable, type TableColumn } from "../../_components/AdminTable";
import { toggleAppPublished, archiveApp } from "./actions";

export const dynamic = "force-dynamic";

type AppRow = typeof schema.appProducts.$inferSelect & { releaseCount: number };

async function getList(): Promise<AppRow[]> {
  if (!db) return [];
  try {
    const apps = await db
      .select()
      .from(schema.appProducts)
      .orderBy(asc(schema.appProducts.sortOrder), asc(schema.appProducts.name));
    const counts = await db
      .select({ appProductId: schema.appReleases.appProductId, c: count() })
      .from(schema.appReleases)
      .groupBy(schema.appReleases.appProductId);
    const map = new Map(counts.map((r) => [r.appProductId, Number(r.c)]));
    return apps.map((a) => ({ ...a, releaseCount: map.get(a.id) ?? 0 }));
  } catch {
    return [];
  }
}

export default async function AppsListPage() {
  const rows = await getList();

  const columns: TableColumn<AppRow>[] = [
    {
      key: "name",
      header: "App",
      render: (r) => (
        <>
          <div>{r.name}</div>
          <div className="mt-0.5 text-xs text-slate-500">/{r.slug}</div>
        </>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (r) => <span className="text-slate-700">{r.category ?? "—"}</span>,
    },
    {
      key: "releases",
      header: "Releases",
      render: (r) => <span className="text-slate-700">{r.releaseCount}</span>,
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
        <StatusBadge active={r.status === "published"}>
          {r.status[0].toUpperCase() + r.status.slice(1)}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Cosmos · Apps"
        description="Downloadable Xhenvolt products shown in the public store."
        action={
          <Link
            href="/admin/cosmos/apps/new"
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + New app
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/cosmos/apps/${r.id}`}
        newHref="/admin/cosmos/apps/new"
        emptyTitle="No apps yet"
        emptyDescription="Add DRAIS Desktop or another product to start the catalog."
        rowActions={[
          {
            label: "Toggle publish",
            action: (r) => async () => {
              "use server";
              await toggleAppPublished(r.id, r.status);
            },
          },
          {
            label: "Archive",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await archiveApp(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
