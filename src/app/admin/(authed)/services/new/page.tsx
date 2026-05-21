import { PageHeader } from "../../_components/ui";
import ServiceForm from "../_form";
import { createService } from "../actions";

export const dynamic = "force-dynamic";

export default function NewService() {
  return (
    <div>
      <PageHeader title="New service" />
      <ServiceForm action={createService} submitLabel="Create" />
    </div>
  );
}
