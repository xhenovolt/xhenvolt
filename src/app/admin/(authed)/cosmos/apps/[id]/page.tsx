import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ExternalLink, Download, Plus } from "lucide-react";
import { db, schema } from "@/lib/db";
import { PageHeader, StatusBadge } from "../../../_components/ui";
import { formatFileSize, platformLabel } from "@/lib/cosmos/format";
import AppForm from "../_form";
import { updateApp } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditAppPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [app] = await db
    .select()
    .from(schema.appProducts)
    .where(eq(schema.appProducts.id, id))
    .limit(1);
  if (!app) notFound();

  const releases = await db
    .select()
    .from(schema.appReleases)
    .where(eq(schema.appReleases.appProductId, id))
    .orderBy(desc(schema.appReleases.publishedAt), desc(schema.appReleases.createdAt));

  const action = updateApp.bind(null, id);

  return (
    <div>
      <PageHeader
        title={`Edit ${app.name}`}
        description={`Slug: ${app.slug}`}
        action={
          <div className="flex gap-2">
            <Link
              href={`/cosmos/${app.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Store page
            </Link>
            <Link
              href={`/download/${app.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" /> Test download
            </Link>
          </div>
        }
      />

      <AppForm action={action} initial={app} submitLabel="Save changes" />

      {/* Releases panel */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Releases</h2>
            <p className="text-sm text-slate-500">Builds available for download. Mark one as latest per platform.</p>
          </div>
          <Link
            href={`/admin/cosmos/releases/new?appId=${app.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-3.5 w-3.5" /> Add release
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {releases.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-500">
              No releases yet. Paste a GitHub release asset URL to add the first build.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Version</th>
                  <th className="px-4 py-3 font-medium">Platform</th>
                  <th className="px-4 py-3 font-medium">Channel</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Latest</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {releases.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/cosmos/releases/${r.id}`} className="font-medium text-slate-900 hover:text-blue-600">
                        v{r.version}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{platformLabel(r.platform)} · {r.architecture}</td>
                    <td className="px-4 py-3 text-slate-700">{r.releaseChannel}</td>
                    <td className="px-4 py-3 text-slate-700">{formatFileSize(r.fileSize)}</td>
                    <td className="px-4 py-3">{r.isLatest ? "★" : ""}</td>
                    <td className="px-4 py-3">
                      <StatusBadge active={r.status === "published"}>
                        {r.status[0].toUpperCase() + r.status.slice(1)}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
