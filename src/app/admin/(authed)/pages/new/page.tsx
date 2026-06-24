import { PageHeader } from "../../_components/ui";
import PageForm from "../_form";
import { createPage } from "../actions";

export const dynamic = "force-dynamic";

export default function NewPage() {
  return (
    <div>
      <PageHeader
        title="Create page"
        description="Registers a route + metadata in the pages table. Section content is edited via the per-type admin pages."
      />
      <PageForm action={createPage} submitLabel="Create page" />
    </div>
  );
}
