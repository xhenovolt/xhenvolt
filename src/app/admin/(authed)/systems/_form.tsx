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
import { SlugInput, ListField, BoolField, StatusPicker } from "../_components/fields";

interface FormValues {
  slug?: string | null;
  name?: string | null;
  tagline?: string | null;
  description?: string | null;
  category?: string | null;
  externalUrl?: string | null;
  accentColor?: string | null;
  deployments?: number | null;
  isFlagship?: unknown;
  sortOrder?: number | null;
  highlights?: unknown;
  published?: boolean | null;
}

const CATEGORIES = [
  "Education",
  "Finance",
  "Construction",
  "Microfinance",
  "Retail",
  "Healthcare",
  "Other",
];

export default function SystemForm({
  action,
  initial,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  initial?: FormValues;
  submitLabel: string;
}) {
  const v = initial ?? {};
  const highlights = Array.isArray(v.highlights)
    ? (v.highlights as string[]).map((s) => ({ label: s }))
    : [];

  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name">
            <Input
              name="name"
              required
              defaultValue={v.name ?? ""}
              placeholder="DRAIS"
            />
          </Field>
          <Field label="Slug" hint="URL-safe identifier. Auto-fills from name on new records.">
            <SlugInput
              name="slug"
              required
              defaultValue={v.slug ?? ""}
              sourceFieldName={v.slug ? undefined : "name"}
            />
          </Field>
          <Field label="Tagline">
            <Input
              name="tagline"
              defaultValue={v.tagline ?? ""}
              placeholder="School Management & Biometric Attendance"
            />
          </Field>
          <Field label="Category">
            <Select name="category" defaultValue={v.category ?? "Education"}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description">
            <Textarea
              name="description"
              required
              rows={4}
              defaultValue={v.description ?? ""}
              placeholder="Two sentences explaining what this product does and who it's for."
            />
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="External URL" hint="Where the 'Visit product' CTA points.">
            <Input
              name="externalUrl"
              type="url"
              defaultValue={v.externalUrl ?? ""}
              placeholder="https://drais.pro"
            />
          </Field>
          <Field label="Accent color (hex)">
            <Input
              name="accentColor"
              defaultValue={v.accentColor ?? ""}
              placeholder="#2563EB"
            />
          </Field>
          <Field label="Deployments">
            <Input
              name="deployments"
              type="number"
              min={0}
              defaultValue={String(v.deployments ?? 0)}
            />
          </Field>
          <Field label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              defaultValue={String(v.sortOrder ?? 0)}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <ListField
          name="highlightsJson"
          label="Feature highlights"
          hint="Short bullet points shown under the product. 3–5 works best."
          defaultItems={highlights}
          itemSchema={[
            {
              key: "label",
              label: "Feature",
              type: "text",
              placeholder: "Biometric fingerprint & face recognition attendance",
            },
          ]}
          newItem={() => ({ label: "" })}
          maxItems={12}
        />
      </Card>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatusPicker name="status" defaultValue={v.published ?? true} />
          <div className="flex items-end">
            <BoolField
              name="isFlagship"
              label="Flagship product"
              hint="Flagship systems appear first on /services."
              defaultChecked={Boolean(v.isFlagship)}
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/systems">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
