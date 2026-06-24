import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../../_components/ui";
import { AdminTable, type TableColumn } from "../../_components/AdminTable";
import { formatFileSize, platformLabel } from "@/lib/cosmos/format";
import { markReleaseLatest, archiveRelease } from "./actions";

export const dynamic = "force-dynamic";

type ReleaseRow = typeof schema.appReleases.$inferSelect & { appName: string };

async function getList(): Promise<ReleaseRow[]> {
  if (!db) return [];
  try {
    const rows = await db
      .select({
        r: schema.appReleases,
        appName: schema.appProducts.name,
      })
      .from(schema.appReleases)
      .leftJoin(schema.appProducts, eq(schema.appReleases.appProductId, schema.appProducts.id))
      .orderBy(desc(schema.appReleases.createdAt));
    return rows.map((row) => ({ ...row.r, appName: row.appName ?? "—" }));
  } catch {
    return [];
  }
}

export default async function ReleasesListPage() {
  const rows = await getList();

  const columns: TableColumn<ReleaseRow>[] = [
    {
      key: "app",
      header: "App / Version",
      render: (r) => (
        <>
          <div>{r.appName}</div>
          <div className="mt-0.5 font-mono text-xs text-slate-500">v{r.version}</div>
        </>
      ),
    },
    {
      key: "platform",
      header: "Platform",
      render: (r) => <span className="text-slate-700">{platformLabel(r.platform)} · {r.architecture}</span>,
    },
    {
      key: "channel",
      header: "Channel",
      render: (r) => <span className="text-slate-700">{r.releaseChannel}</span>,
    },
    {
      key: "size",
      header: "Size",
      render: (r) => <span className="text-slate-700">{formatFileSize(r.fileSize)}</span>,
    },
    {
      key: "latest",
      header: "Latest",
      render: (r) => (r.isLatest ? "★" : ""),
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
        title="Cosmos · Releases"
        description="Every build across all apps. Paste a GitHub release URL to add one."
        action={
          <Link
            href="/admin/cosmos/releases/new"
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + New release
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/cosmos/releases/${r.id}`}
        newHref="/admin/cosmos/releases/new"
        emptyTitle="No releases yet"
        emptyDescription="Create an app, then add its first release."
        rowActions={[
          {
            label: "Make latest",
            action: (r) => async () => {
              "use server";
              await markReleaseLatest(r.id);
            },
          },
          {
            label: "Archive",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await archiveRelease(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
