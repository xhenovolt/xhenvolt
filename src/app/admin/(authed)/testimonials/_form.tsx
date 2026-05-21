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

interface FormValues {
  authorName?: string | null;
  authorRole?: string | null;
  organization?: string | null;
  location?: string | null;
  quote?: string | null;
  rating?: number | null;
  featured?: boolean | null;
  published?: boolean | null;
  sortOrder?: number | null;
}

export default function TestimonialForm({
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
          <Field label="Author name">
            <Input
              name="authorName"
              required
              defaultValue={v.authorName ?? ""}
              placeholder="Sheikh Isabirye Bilaal"
            />
          </Field>
          <Field label="Role / title">
            <Input
              name="authorRole"
              defaultValue={v.authorRole ?? ""}
              placeholder="School Director"
            />
          </Field>
          <Field label="Organization">
            <Input
              name="organization"
              defaultValue={v.organization ?? ""}
              placeholder="City Parents School"
            />
          </Field>
          <Field label="Location">
            <Input
              name="location"
              defaultValue={v.location ?? ""}
              placeholder="Iganga, Uganda"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Quote" hint="Shown as a blockquote on the testimonials page.">
            <Textarea
              name="quote"
              required
              defaultValue={v.quote ?? ""}
              rows={5}
              placeholder="Before DRAIS…"
            />
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Rating">
            <Select name="rating" defaultValue={String(v.rating ?? 5)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              defaultValue={String(v.sortOrder ?? 0)}
            />
          </Field>
          <div className="flex items-end gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={Boolean(v.featured)}
                className="rounded border-slate-300"
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="published"
                defaultChecked={v.published ?? true}
                className="rounded border-slate-300"
              />
              Published
            </label>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/testimonials">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
