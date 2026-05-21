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
  slug?: string | null;
  question?: string | null;
  answer?: string | null;
  category?: string | null;
  keywords?: unknown;
  scope?: string | null;
  published?: boolean | null;
  sortOrder?: number | null;
}

export default function FaqForm({
  action,
  initial,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  initial?: FormValues;
  submitLabel: string;
}) {
  const v = initial ?? {};
  const keywordsText = Array.isArray(v.keywords) ? (v.keywords as string[]).join(", ") : "";
  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Slug" hint="lowercase, digits, hyphens only">
            <Input
              name="slug"
              required
              defaultValue={v.slug ?? ""}
              placeholder="what-is-drais"
            />
          </Field>
          <Field label="Category">
            <Input
              name="category"
              defaultValue={v.category ?? ""}
              placeholder="product"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Question">
            <Input
              name="question"
              required
              defaultValue={v.question ?? ""}
              placeholder="What is DRAIS?"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Answer" hint="Used by Xhenvolt AI when this FAQ matches the visitor's question.">
            <Textarea
              name="answer"
              required
              rows={7}
              defaultValue={v.answer ?? ""}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field
            label="Keywords"
            hint="Comma- or newline-separated. Boosts retrieval accuracy."
          >
            <Textarea
              name="keywordsText"
              rows={2}
              defaultValue={keywordsText}
              placeholder="drais, school, attendance"
            />
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Scope">
            <Select name="scope" defaultValue={v.scope ?? "public"}>
              <option value="public">Public</option>
              <option value="internal">Internal</option>
            </Select>
          </Field>
          <Field label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              defaultValue={String(v.sortOrder ?? 0)}
            />
          </Field>
          <div className="flex items-end">
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
        <Link href="/admin/faqs">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
