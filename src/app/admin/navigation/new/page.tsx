import NavigationForm from "@/app/admin/navigation/_form";
import { createNavigation } from "@/app/admin/navigation/actions";

export default function NewNavigationLink() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create navigation link</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a new primary or dropdown navigation item for the live site.
        </p>
      </div>
      <NavigationForm action={createNavigation} submitLabel="Create link" />
    </div>
  );
}
