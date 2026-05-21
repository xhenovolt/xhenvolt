import { PageHeader } from "../../_components/ui";
import HeroForm from "../_form";
import { createHero } from "../actions";

export const dynamic = "force-dynamic";

export default function NewHero() {
  return (
    <div>
      <PageHeader title="New hero slide" />
      <HeroForm action={createHero} submitLabel="Create" />
    </div>
  );
}
