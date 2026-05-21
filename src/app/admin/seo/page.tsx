import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../_components/ui";
import { AdminTable, type TableColumn } from "../_components/AdminTable";
import { deleteSeo } from "./actions";

export const dynamic = "force-dynamic";

type Row = typeof schema.seoMetadata.$inferSelect;

async function getList(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.seoMetadata)
      .orderBy(asc(schema.seoMetadata.route));
  } catch {
    return [];
  }
}

export default async function SeoList() {
  const rows = await getList();
  const columns: TableColumn<Row>[] = [
    {
      key: "route",
      header: "Route",
      render: (r) => <span className="font-mono text-xs">{r.route}</span>,
    },
    {
      key: "title",
      header: "Title",
      render: (r) => (
        <>
          <div className="line-clamp-1">{r.title}</div>
          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {r.description}
          </div>
        </>
      ),
    },
    {
      key: "og",
      header: "OG image",
      render: (r) =>
        r.ogImage ? (
          <span className="text-xs text-slate-700 font-mono line-clamp-1">{r.ogImage}</span>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="SEO metadata"
        description="One record per route. The frontend's generateMetadata() reads from here. Routes without a record fall back to per-page static metadata."
        action={
          <Link
            href="/admin/seo/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/seo/${r.id}`}
        newHref="/admin/seo/new"
        emptyTitle="No SEO records yet"
        emptyDescription="Add records for /, /about, /services, /contact, /testimonials and any other route you want to control."
        rowActions={[
          {
            label: "Delete",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await deleteSeo(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
