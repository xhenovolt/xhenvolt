import Link from "next/link";
import {
  Card,
  Field,
  Input,
  PrimaryButton,
  SecondaryButton,
  Select,
  Textarea,
} from "../_components/ui";
import { SlugInput, BoolField, StatusPicker } from "../_components/fields";

interface FormValues {
  slug?: string | null;
  name?: string | null;
  kind?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  featured?: boolean | null;
  sortOrder?: number | null;
  published?: boolean | null;
}

const KINDS = ["school", "sacco", "business", "ngo", "government", "other"];

export default function ClientForm({
  action,
  initial,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  initial?: FormValues;
  submitLabel: string;
}) {
  const v = initial ?? {};
  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name">
            <Input
              name="name"
              required
              defaultValue={v.name ?? ""}
              placeholder="Northgate Schools"
            />
          </Field>
          <Field label="Slug" hint="Auto-fills from name on new records.">
            <SlugInput
              name="slug"
              required
              defaultValue={v.slug ?? ""}
              sourceFieldName={v.slug ? undefined : "name"}
            />
          </Field>
          <Field label="Kind">
            <Select name="kind" defaultValue={v.kind ?? "school"}>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Location">
            <Input
              name="location"
              defaultValue={v.location ?? ""}
              placeholder="Iganga, Uganda"
            />
          </Field>
          <Field label="Logo URL">
            <Input
              name="logoUrl"
              defaultValue={v.logoUrl ?? ""}
              placeholder="/client_logos/northgate-school.svg"
            />
          </Field>
          <Field label="Website (optional)">
            <Input
              name="website"
              defaultValue={v.website ?? ""}
              placeholder="https://northgateschools.ug"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description (optional)">
            <Textarea
              name="description"
              rows={2}
              defaultValue={v.description ?? ""}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatusPicker name="status" defaultValue={v.published ?? true} />
          <Field label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              defaultValue={String(v.sortOrder ?? 0)}
            />
          </Field>
          <div className="flex items-end">
            <BoolField
              name="featured"
              label="Featured"
              hint="Featured clients appear first in carousels."
              defaultChecked={Boolean(v.featured)}
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/clients">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
