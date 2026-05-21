import { PageHeader } from "../../_components/ui";
import FaqForm from "../_form";
import { createFaq } from "../actions";

export const dynamic = "force-dynamic";

export default function NewFaq() {
  return (
    <div>
      <PageHeader title="New FAQ" description="Question/answer pair used by Xhenvolt AI." />
      <FaqForm action={createFaq} submitLabel="Create" />
    </div>
  );
}
