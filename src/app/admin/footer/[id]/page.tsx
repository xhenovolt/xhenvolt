import FooterForm from "@/app/admin/footer/_form";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { updateFooterLink } from "@/app/admin/footer/actions";

export default async function EditFooterLink({ params }: { params: { id: string } }) {
  const row = await db
    .select()
    .from(schema.footerLinks)
    .where(eq(schema.footerLinks.id, params.id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!row) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Footer link not found</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit footer link</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update the footer item and publish state.
        </p>
      </div>
      <FooterForm
        action={async (fd: FormData) => await updateFooterLink(params.id, fd)}
        initial={row}
        submitLabel="Save changes"
      />
    </div>
  );
}
