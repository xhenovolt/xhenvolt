import { PageHeader } from "../../../_components/ui";
import AppForm from "../_form";
import { createApp } from "../actions";

export const dynamic = "force-dynamic";

export default function NewAppPage() {
  return (
    <div>
      <PageHeader title="New app" description="Create a downloadable Xhenvolt product. Add releases after saving." />
      <AppForm action={createApp} submitLabel="Create app" />
    </div>
  );
}
