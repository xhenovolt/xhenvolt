import { PageHeader } from "../../_components/ui";
import TestimonialForm from "../_form";
import { createTestimonial } from "../actions";

export const dynamic = "force-dynamic";

export default function NewTestimonial() {
  return (
    <div>
      <PageHeader title="New testimonial" description="Adds a row to the testimonials table." />
      <TestimonialForm action={createTestimonial} submitLabel="Create" />
    </div>
  );
}
