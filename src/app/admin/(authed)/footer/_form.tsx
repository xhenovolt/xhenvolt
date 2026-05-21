import Link from "next/link";
import { Card, Field, Input, PrimaryButton, SecondaryButton, Select } from "@/app/admin/(authed)/_components/ui";
import { StatusPicker } from "@/app/admin/(authed)/_components/fields";
import type { FooterLinkItem } from "@/app/admin/(authed)/footer/page";

interface FooterFormProps {
  action: (fd: FormData) => void | Promise<void>;
  initial?: Partial<FooterLinkItem>;
  submitLabel: string;
}

export default function FooterForm({ action, initial, submitLabel }: FooterFormProps) {
  const v = initial ?? {};

  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Label">
            <Input name="label" required defaultValue={v.label ?? ""} placeholder="Privacy Policy" />
          </Field>
          <Field label="Href">
            <Input name="href" required defaultValue={v.href ?? ""} placeholder="/privacy-policy" />
          </Field>
          <Field label="Column">
            <Input name="column" defaultValue={v.column ?? "Company"} placeholder="Company" />
          </Field>
          <Field label="External link">
            <input
              type="checkbox"
              name="isExternal"
              defaultChecked={Boolean(v.isExternal)}
              className="rounded border-slate-300 text-slate-900"
            />
          </Field>
          <Field label="Sort order">
            <Input name="sortOrder" type="number" defaultValue={String(v.sortOrder ?? 0)} />
          </Field>
          <StatusPicker name="status" defaultValue={v.published ?? true} />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/footer">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
