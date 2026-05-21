import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { AdminTable, type TableColumn } from "../_components/AdminTable";
import { toggleHeroPublished, deleteHero } from "./actions";

export const dynamic = "force-dynamic";

type Row = typeof schema.heroSlides.$inferSelect;

async function getList(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.heroSlides)
      .orderBy(asc(schema.heroSlides.scope), asc(schema.heroSlides.sortOrder));
  } catch {
    return [];
  }
}

export default async function HeroList() {
  const rows = await getList();
  const columns: TableColumn<Row>[] = [
    {
      key: "headline",
      header: "Headline",
      render: (r) => (
        <>
          <div className="line-clamp-1">{r.headline}</div>
          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {r.subheadline ?? ""}
          </div>
        </>
      ),
    },
    {
      key: "scope",
      header: "Scope",
      render: (r) => (
        <span className="text-xs uppercase tracking-wide text-slate-500">{r.scope}</span>
      ),
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
        title="Hero slides"
        description="Hero content for the homepage and other landing pages, grouped by scope. The frontend reads the first published slide for each scope."
        action={
          <Link
            href="/admin/hero/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/hero/${r.id}`}
        newHref="/admin/hero/new"
        rowActions={[
          {
            label: "",
            action: (r) => async () => {
              "use server";
              await toggleHeroPublished(r.id, !r.published);
            },
          },
          {
            label: "Delete",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await deleteHero(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
