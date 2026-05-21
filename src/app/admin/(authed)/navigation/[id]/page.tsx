import NavigationForm from "@/app/admin/(authed)/navigation/_form";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { updateNavigation } from "@/app/admin/(authed)/navigation/actions";

export default async function EditNavigationLink({ params }: { params: { id: string } }) {
  const row = await db
    .select()
    .from(schema.navigationLinks)
    .where(eq(schema.navigationLinks.id, params.id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!row) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Navigation link not found</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit navigation link</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update the menu item and its publish state.
        </p>
      </div>
      <NavigationForm
        action={async (fd: FormData) => await updateNavigation(params.id, fd)}
        initial={row}
        submitLabel="Save changes"
      />
    </div>
  );
}
