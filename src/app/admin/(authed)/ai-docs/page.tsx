import Link from "next/link";
import { asc, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../_components/ui";
import { AdminTable, type TableColumn } from "../_components/AdminTable";
import { toggleAiDocPublished, softDeleteAiDoc } from "./actions";

export const dynamic = "force-dynamic";

type Row = typeof schema.aiTrainingDocuments.$inferSelect;

async function getList(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.aiTrainingDocuments)
      .where(isNull(schema.aiTrainingDocuments.deletedAt))
      .orderBy(asc(schema.aiTrainingDocuments.category), asc(schema.aiTrainingDocuments.sortOrder));
  } catch {
    return [];
  }
}

export default async function AiDocsList() {
  const rows = await getList();
  const columns: TableColumn<Row>[] = [
    {
      key: "title",
      header: "Title",
      render: (r) => (
        <>
          <div>{r.title}</div>
          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {r.summary ?? r.content.slice(0, 120)}
          </div>
        </>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (r) => (
        <span className="text-xs uppercase tracking-wide text-slate-500">
          {r.category ?? "—"}
        </span>
      ),
    },
    {
      key: "tokens",
      header: "Tokens",
      render: (r) => (
        <span className="font-mono text-xs text-slate-700">
          {r.tokenEstimate ?? 0}
        </span>
      ),
    },
    {
      key: "embedding",
      header: "Embedding",
      render: (r) =>
        r.embedding ? (
          <span className="text-xs text-green-700">stored</span>
        ) : (
          <span className="text-xs text-slate-400">pending</span>
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
        title="AI training documents"
        description="Source-of-truth knowledge for Xhenvolt AI. Every chat turn scores published docs by keyword overlap; saved content also feeds embeddings retrieval once that pipeline runs."
        action={
          <Link
            href="/admin/ai-docs/new"
            className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
          >
            + New
          </Link>
        }
      />
      <AdminTable
        rows={rows}
        columns={columns}
        rowHref={(r) => `/admin/ai-docs/${r.id}`}
        newHref="/admin/ai-docs/new"
        rowActions={[
          {
            label: "",
            action: (r) => async () => {
              "use server";
              await toggleAiDocPublished(r.id, !r.published);
            },
          },
          {
            label: "Delete",
            variant: "danger",
            action: (r) => async () => {
              "use server";
              await softDeleteAiDoc(r.id);
            },
          },
        ]}
      />
    </div>
  );
}
