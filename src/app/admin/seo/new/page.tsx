import { PageHeader } from "../../_components/ui";
import SeoForm from "../_form";
import { createSeo } from "../actions";

export const dynamic = "force-dynamic";

export default function NewSeo() {
  return (
    <div>
      <PageHeader title="New SEO record" description="Per-route SEO metadata." />
      <SeoForm action={createSeo} submitLabel="Create" />
    </div>
  );
}
