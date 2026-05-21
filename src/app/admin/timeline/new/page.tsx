import { PageHeader } from "../../_components/ui";
import TimelineForm from "../_form";
import { createTimeline } from "../actions";

export const dynamic = "force-dynamic";

export default function NewTimeline() {
  return (
    <div>
      <PageHeader title="New timeline entry" />
      <TimelineForm action={createTimeline} submitLabel="Create" />
    </div>
  );
}
