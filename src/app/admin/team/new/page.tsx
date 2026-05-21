import { PageHeader } from "../../_components/ui";
import TeamForm from "../_form";
import { createMember } from "../actions";

export const dynamic = "force-dynamic";

export default function NewMember() {
  return (
    <div>
      <PageHeader title="New team member" />
      <TeamForm action={createMember} submitLabel="Create" />
    </div>
  );
}
