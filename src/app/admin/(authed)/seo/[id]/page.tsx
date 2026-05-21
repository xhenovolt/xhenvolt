import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import SeoForm from "../_form";
import { updateSeo } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditSeo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.seoMetadata)
    .where(eq(schema.seoMetadata.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updateSeo.bind(null, id);
  return (
    <div>
      <PageHeader title={`Edit SEO: ${row.route}`} />
      <SeoForm action={action} initial={row} submitLabel="Save changes" lockRoute />
    </div>
  );
}
