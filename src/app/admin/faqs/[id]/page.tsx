import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import FaqForm from "../_form";
import { updateFaq } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditFaq({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.faqs)
    .where(eq(schema.faqs.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updateFaq.bind(null, id);
  return (
    <div>
      <PageHeader title="Edit FAQ" description={`Slug: ${row.slug}`} />
      <FaqForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
