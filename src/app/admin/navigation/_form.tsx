import Link from "next/link";
import { Card, Field, Input, PrimaryButton, SecondaryButton, Select } from "@/app/admin/_components/ui";
import { StatusPicker } from "@/app/admin/_components/fields";
import type { NavItem } from "@/app/admin/navigation/page";

interface NavigationFormProps {
  action: (fd: FormData) => void | Promise<void>;
  initial?: Partial<NavItem>;
  parentOptions?: Array<{ id: string; label: string }>;
  submitLabel: string;
}

export default function NavigationForm({
  action,
  initial,
  parentOptions = [],
  submitLabel,
}: NavigationFormProps) {
  const v = initial ?? {};

  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Label">
            <Input name="label" required defaultValue={v.label ?? ""} placeholder="About" />
          </Field>
          <Field label="Href">
            <Input
              name="href"
              required
              defaultValue={v.href ?? ""}
              placeholder="/about"
            />
          </Field>
          <Field label="Location" hint="Where this link appears on the site.">
            <Input
              name="location"
              defaultValue={v.location ?? "primary"}
              placeholder="primary"
            />
          </Field>
          <Field label="Target">
            <Select name="target" defaultValue={v.target ?? "_self"}>
              <option value="_self">Same window</option>
              <option value="_blank">New tab</option>
            </Select>
          </Field>
          <Field label="Parent link" hint="Choose a parent to create a dropdown item.">
            <select
              name="parentId"
              defaultValue={v.parentId ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900"
            >
              <option value="">None</option>
              {parentOptions.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="External link" hint="Check this if the URL goes to another domain.">
            <input
              type="checkbox"
              name="isExternal"
              defaultChecked={Boolean(v.isExternal)}
              className="rounded border-slate-300 text-slate-900"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description" hint="Optional label used only in the admin." >
            <Input
              name="description"
              defaultValue={v.description ?? ""}
              placeholder="Drop-down group for service pages"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              defaultValue={String(v.sortOrder ?? 0)}
            />
          </Field>
          <StatusPicker name="status" defaultValue={v.published ?? true} />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/navigation">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
