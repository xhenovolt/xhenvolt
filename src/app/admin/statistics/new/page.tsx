import { PageHeader } from "../../_components/ui";
import StatForm from "../_form";
import { createStat } from "../actions";

export const dynamic = "force-dynamic";

export default function NewStat() {
  return (
    <div>
      <PageHeader title="New statistic" description="Frontend looks up stats by their `key`." />
      <StatForm action={createStat} submitLabel="Create" />
    </div>
  );
}
