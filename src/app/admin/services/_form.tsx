import Link from "next/link";
import {
  Card,
  Field,
  Input,
  PrimaryButton,
  SecondaryButton,
  Textarea,
} from "../_components/ui";
import { SlugInput, StatusPicker } from "../_components/fields";

interface FormValues {
  slug?: string | null;
  title?: string | null;
  tagline?: string | null;
  description?: string | null;
  icon?: string | null;
  accentColor?: string | null;
  audience?: string | null;
  priceFrom?: string | null;
  sortOrder?: number | null;
  published?: boolean | null;
}

export default function ServiceForm({
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
          <Field label="Title">
            <Input
              name="title"
              required
              defaultValue={v.title ?? ""}
              placeholder="Custom Software Development"
            />
          </Field>
          <Field label="Slug" hint="Auto-fills from title on new records.">
            <SlugInput
              name="slug"
              required
              defaultValue={v.slug ?? ""}
              sourceFieldName={v.slug ? undefined : "title"}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Tagline">
            <Input
              name="tagline"
              defaultValue={v.tagline ?? ""}
              placeholder="One-liner that hooks the reader"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description">
            <Textarea
              name="description"
              required
              rows={4}
              defaultValue={v.description ?? ""}
            />
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Icon name (lucide)">
            <Input name="icon" defaultValue={v.icon ?? ""} placeholder="code" />
          </Field>
          <Field label="Accent (hex)">
            <Input name="accentColor" defaultValue={v.accentColor ?? ""} placeholder="#2563EB" />
          </Field>
          <Field label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              defaultValue={String(v.sortOrder ?? 0)}
            />
          </Field>
          <Field label="Target audience">
            <Input
              name="audience"
              defaultValue={v.audience ?? ""}
              placeholder="Schools, SACCOs, SMEs"
            />
          </Field>
          <Field label="Price from">
            <Input
              name="priceFrom"
              defaultValue={v.priceFrom ?? ""}
              placeholder="Contact for quote"
            />
          </Field>
          <div />
        </div>
      </Card>

      <Card>
        <StatusPicker name="status" defaultValue={v.published ?? true} />
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/services">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
