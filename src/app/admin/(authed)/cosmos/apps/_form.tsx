import Link from "next/link";
import {
  Card,
  Field,
  Input,
  PrimaryButton,
  SecondaryButton,
  Select,
  Textarea,
} from "../../_components/ui";
import { SlugInput, BoolField } from "../../_components/fields";
import { MediaPicker } from "../../_components/MediaPicker";

interface FormValues {
  id?: string;
  slug?: string | null;
  name?: string | null;
  tagline?: string | null;
  description?: string | null;
  longDescription?: string | null;
  category?: string | null;
  icon?: string | null;
  iconUrl?: string | null;
  brandColor?: string | null;
  status?: string | null;
  featured?: boolean | null;
  sortOrder?: number | null;
}

const CATEGORIES = [
  "Desktop App",
  "Mobile App",
  "Operating System",
  "Developer Tool",
  "Utility",
  "Server",
  "Other",
];

const ICON_NAMES = "monitor, smartphone, cpu, package, database, boxes, app, harddrive, layers, rocket, shield, terminal, gauge, box";

export default function AppForm({
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input name="name" required defaultValue={v.name ?? ""} placeholder="DRAIS Desktop" />
          </Field>
          <Field label="Slug" hint="URL identifier — used in /cosmos/[slug] and /download/[slug].">
            <SlugInput
              name="slug"
              required
              defaultValue={v.slug ?? ""}
              sourceFieldName={v.slug ? undefined : "name"}
            />
          </Field>
          <Field label="Tagline" hint="One line shown on the store card.">
            <Input
              name="tagline"
              defaultValue={v.tagline ?? ""}
              placeholder="The desktop companion for DRAIS school management."
            />
          </Field>
          <Field label="Category">
            <Select name="category" defaultValue={v.category ?? "Desktop App"}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Short description" hint="Shown on the app detail page if no long description is set.">
            <Textarea
              name="description"
              required
              rows={3}
              defaultValue={v.description ?? ""}
              placeholder="What this app does and who it's for."
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Long description" hint="Full marketing copy for the detail page. Supports line breaks.">
            <Textarea
              name="longDescription"
              rows={6}
              defaultValue={v.longDescription ?? ""}
              placeholder="Detailed overview, feature highlights, requirements…"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Icon name" hint={`Lucide icon: ${ICON_NAMES}`}>
            <Input name="icon" defaultValue={v.icon ?? ""} placeholder="monitor" />
          </Field>
          <Field label="Icon image URL" hint="Optional. Overrides the icon name if set. Pick from the Media Library.">
            <MediaPicker name="iconUrl" defaultValue={v.iconUrl ?? ""} placeholder="https://…/icon.png" />
          </Field>
          <Field label="Brand color (hex)">
            <Input name="brandColor" defaultValue={v.brandColor ?? ""} placeholder="#6366F1" />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first.">
            <Input name="sortOrder" type="number" defaultValue={String(v.sortOrder ?? 0)} />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status" hint="Only 'Published' apps appear publicly on /cosmos.">
            <Select name="status" defaultValue={v.status ?? "draft"}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <div className="flex items-end">
            <BoolField
              name="featured"
              label="Featured product"
              hint="Featured apps are highlighted at the top of the store."
              defaultChecked={Boolean(v.featured)}
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/cosmos/apps">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
