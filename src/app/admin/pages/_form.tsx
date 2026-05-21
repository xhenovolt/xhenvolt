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
import { SlugInput } from "../_components/fields";

interface FormValues {
  slug?: string | null;
  title?: string | null;
  route?: string | null;
  summary?: string | null;
  status?: string | null;
}

export default function PageForm({
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
              placeholder="Homepage"
            />
          </Field>
          <Field label="Slug">
            <SlugInput
              name="slug"
              required
              defaultValue={v.slug ?? ""}
              sourceFieldName={v.slug ? undefined : "title"}
            />
          </Field>
          <Field label="Route" hint="URL path where this page lives, e.g. / or /about.">
            <Input
              name="route"
              required
              defaultValue={v.route ?? ""}
              placeholder="/about"
            />
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={v.status ?? "published"}>
              <option value="draft">Draft</option>
              <option value="review">In review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Summary" hint="Internal note shown in the pages list.">
            <Textarea
              name="summary"
              rows={2}
              defaultValue={v.summary ?? ""}
            />
          </Field>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <strong>Section composition is coming in Phase 7.</strong> Today, page metadata is
        editable here, but the actual section list (hero, services, testimonials, etc.) is
        rendered by code in <span className="font-mono">app/(website)/&lt;route&gt;/page.tsx</span>.
        Use the per-content-type admin pages (Hero, Systems, Services…) to edit what shows up.
      </div>

      <div className="flex items-center justify-between">
        <Link href="/admin/pages">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
