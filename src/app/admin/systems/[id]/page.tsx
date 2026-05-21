import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import SystemForm from "../_form";
import { updateSystem } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditSystem({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db.select().from(schema.systems).where(eq(schema.systems.id, id)).limit(1);
  if (!row) notFound();
  const action = updateSystem.bind(null, id);
  return (
    <div>
      <PageHeader title={`Edit ${row.name}`} description={`Slug: ${row.slug}`} />
      <SystemForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
