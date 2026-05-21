import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import TeamForm from "../_form";
import { updateMember } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditMember({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.teamMembers)
    .where(eq(schema.teamMembers.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updateMember.bind(null, id);
  return (
    <div>
      <PageHeader title={`Edit ${row.name}`} description={row.role} />
      <TeamForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
