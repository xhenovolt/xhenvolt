import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import AiDocForm from "../_form";
import { updateAiDoc } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditAiDoc({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.aiTrainingDocuments)
    .where(eq(schema.aiTrainingDocuments.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updateAiDoc.bind(null, id);
  return (
    <div>
      <PageHeader title={`Edit ${row.title}`} description={`Slug: ${row.slug}`} />
      <AiDocForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
