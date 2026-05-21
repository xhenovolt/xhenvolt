import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import PageForm from "../_form";
import { updatePage } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updatePage.bind(null, id);
  return (
    <div>
      <PageHeader title={`Edit ${row.title}`} description={row.route} />
      <PageForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
