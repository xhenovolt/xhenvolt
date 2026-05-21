import { PageHeader } from "../../_components/ui";
import SystemForm from "../_form";
import { createSystem } from "../actions";

export const dynamic = "force-dynamic";

export default function NewSystem() {
  return (
    <div>
      <PageHeader title="New system" description="Adds a row to the systems table." />
      <SystemForm action={createSystem} submitLabel="Create" />
    </div>
  );
}
