import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import StatForm from "../_form";
import { updateStat } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditStat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.statistics)
    .where(eq(schema.statistics.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updateStat.bind(null, id);
  return (
    <div>
      <PageHeader title={`Edit ${row.label}`} description={`Key: ${row.key}`} />
      <StatForm action={action} initial={row} submitLabel="Save changes" lockKey />
    </div>
  );
}
