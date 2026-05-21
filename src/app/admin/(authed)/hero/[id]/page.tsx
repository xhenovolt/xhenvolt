import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import HeroForm from "../_form";
import { updateHero } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditHero({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.heroSlides)
    .where(eq(schema.heroSlides.id, id))
    .limit(1);
  if (!row) notFound();
  const action = updateHero.bind(null, id);
  return (
    <div>
      <PageHeader title="Edit hero slide" description={`Scope: ${row.scope}`} />
      <HeroForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
