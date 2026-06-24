import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../../_components/ui";
import ReleaseForm from "../_form";
import { updateRelease, deleteRelease } from "../actions";

export const dynamic = "force-dynamic";

async function getApps() {
  if (!db) return [];
  try {
    return await db
      .select({ id: schema.appProducts.id, name: schema.appProducts.name, slug: schema.appProducts.slug })
      .from(schema.appProducts)
      .orderBy(asc(schema.appProducts.name));
  } catch {
    return [];
  }
}

export default async function EditReleasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [release] = await db
    .select()
    .from(schema.appReleases)
    .where(eq(schema.appReleases.id, id))
    .limit(1);
  if (!release) notFound();
  const apps = await getApps();
  const app = apps.find((a) => a.id === release.appProductId);

  const action = updateRelease.bind(null, id);
  const del = deleteRelease.bind(null, id);

  return (
    <div>
      <PageHeader
        title={`Edit release v${release.version}`}
        description={app ? `${app.name} · ${release.platform}` : release.platform}
        action={
          app && (
            <Link
              href={`/download/${app.slug}/${release.platform}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Test download route
            </Link>
          )
        }
      />
      <ReleaseForm action={action} apps={apps} initial={release} submitLabel="Save changes" />

      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-red-800">Delete this release</div>
            <div className="text-xs text-red-600">Permanently removes the build. Consider archiving instead.</div>
          </div>
          <form action={del}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
