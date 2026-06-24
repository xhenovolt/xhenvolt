import Link from "next/link";
import { desc, isNull } from "drizzle-orm";
import { Plus, Info, CheckCircle2 } from "lucide-react";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../_components/ui";
import { isCloudinaryConfigured } from "@/lib/media/cloudinary";
import { deleteMedia } from "./actions";
import { UploadButton } from "./UploadButton";

export const dynamic = "force-dynamic";

type Row = typeof schema.mediaAssets.$inferSelect;

async function getRows(): Promise<Row[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.mediaAssets)
      .where(isNull(schema.mediaAssets.deletedAt))
      .orderBy(desc(schema.mediaAssets.createdAt))
      .limit(200);
  } catch {
    return [];
  }
}

export default async function MediaPage() {
  const rows = await getRows();
  const uploadReady = isCloudinaryConfigured();

  return (
    <div>
      <PageHeader
        title="Media Library"
        description={`${rows.length} asset${rows.length === 1 ? "" : "s"} · referenced by content forms`}
        action={
          <div className="flex items-center gap-2">
            {uploadReady && <UploadButton />}
            <Link
              href="/admin/media/new"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              Add by URL
            </Link>
          </div>
        }
      />

      {uploadReady ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <strong>Uploads enabled via Cloudinary.</strong> Use <em>Upload file</em> to send an
            image/video straight from your device — it&apos;s stored on Cloudinary and registered
            here automatically. You can also still <em>Add by URL</em> for already-hosted assets.
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <strong>Device upload requires storage env.</strong> Set{" "}
            <code className="font-mono text-xs">CLOUDINARY_CLOUD_NAME</code>,{" "}
            <code className="font-mono text-xs">CLOUDINARY_API_KEY</code>,{" "}
            <code className="font-mono text-xs">CLOUDINARY_API_SECRET</code> to enable uploads.
            Until then, register assets by hosted URL with <em>Add by URL</em>.
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No media yet. Click <strong>Add media</strong> to register your first hosted asset.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex aspect-video items-center justify-center bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url}
                  alt={m.alt}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <div className="truncate text-xs font-medium text-slate-700" title={m.title ?? m.url}>
                  {m.title || m.url.split("/").pop()}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-slate-400" title={m.url}>
                  {m.url}
                </div>
                {(m.width || m.height) && (
                  <div className="mt-1 text-[11px] text-slate-400">
                    {m.width ?? "?"} × {m.height ?? "?"}
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-600 hover:text-blue-600"
                  >
                    Open
                  </a>
                  <form
                    action={async () => {
                      "use server";
                      await deleteMedia(m.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
