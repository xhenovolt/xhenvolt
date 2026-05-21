import { PageHeader } from "../../_components/ui";
import AiDocForm from "../_form";
import { createAiDoc } from "../actions";

export const dynamic = "force-dynamic";

export default function NewAiDoc() {
  return (
    <div>
      <PageHeader title="New AI training document" />
      <AiDocForm action={createAiDoc} submitLabel="Create" />
    </div>
  );
}
