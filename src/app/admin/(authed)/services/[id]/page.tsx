import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import ServiceForm from "../_form";
import { updateService } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditService({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.services)
    .where(eq(schema.services.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updateService.bind(null, id);
  return (
    <div>
      <PageHeader title={`Edit ${row.title}`} description={`Slug: ${row.slug}`} />
      <ServiceForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
