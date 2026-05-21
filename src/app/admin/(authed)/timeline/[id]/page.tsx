import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import TimelineForm from "../_form";
import { updateTimeline } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditTimeline({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.timelineEntries)
    .where(eq(schema.timelineEntries.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updateTimeline.bind(null, id);
  return (
    <div>
      <PageHeader title={`Edit ${row.title}`} description={row.label ?? ""} />
      <TimelineForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
