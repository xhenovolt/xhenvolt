import { PageHeader } from "../../_components/ui";
import ClientForm from "../_form";
import { createClient } from "../actions";

export const dynamic = "force-dynamic";

export default function NewClient() {
  return (
    <div>
      <PageHeader title="New client" />
      <ClientForm action={createClient} submitLabel="Create" />
    </div>
  );
}
