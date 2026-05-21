import FooterForm from "@/app/admin/(authed)/footer/_form";
import { createFooterLink } from "@/app/admin/(authed)/footer/actions";

export default function NewFooterLink() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create footer link</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a link to the footer columns that appear on the public site.
        </p>
      </div>
      <FooterForm action={createFooterLink} submitLabel="Create link" />
    </div>
  );
}
