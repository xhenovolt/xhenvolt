import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../_components/ui";
import TestimonialForm from "../_form";
import { updateTestimonial } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditTestimonial({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();
  const [row] = await db
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.id, id))
    .limit(1);
  if (!row) notFound();

  const action = updateTestimonial.bind(null, id);

  return (
    <div>
      <PageHeader
        title="Edit testimonial"
        description={`UUID ${row.id}`}
      />
      <TestimonialForm action={action} initial={row} submitLabel="Save changes" />
    </div>
  );
}
