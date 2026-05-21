import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import ClientForm from "../_form";
import { updateClient } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updateClient.bind(null, id);
  return (
    <div>
      <PageHeader title={`Edit ${row.name}`} description={row.location ?? ""} />
      <ClientForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
