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
import { SlugInput, StatusPicker } from "../_components/fields";

interface FormValues {
  slug?: string | null;
  title?: string | null;
  category?: string | null;
  source?: string | null;
  summary?: string | null;
  content?: string | null;
  keywords?: unknown;
  sortOrder?: number | null;
  published?: boolean | null;
  tokenEstimate?: number | null;
  embedding?: unknown;
}

const CATEGORIES = [
  "company",
  "product",
  "pricing",
  "results",
  "clients",
  "contact",
  "process",
  "other",
];

export default function AiDocForm({
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
  const hasEmbedding = Boolean(v.embedding);

  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Title">
            <Input
              name="title"
              required
              defaultValue={v.title ?? ""}
              placeholder="DRAIS — School Management System"
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
          <Field label="Category">
            <Select name="category" defaultValue={v.category ?? "company"}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Source (optional)" hint="Where this content came from — e.g. 'website-2026' or 'sales-deck-v3'.">
            <Input
              name="source"
              defaultValue={v.source ?? ""}
              placeholder="website-2026"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field
            label="Summary"
            hint="One-sentence digest shown when this doc matches a query. Falls back to first 600 chars of content if blank."
          >
            <Textarea
              name="summary"
              rows={2}
              defaultValue={v.summary ?? ""}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field
            label="Content"
            hint="The full knowledge text. Xhenvolt AI scores queries against title + summary + content."
          >
            <Textarea
              name="content"
              required
              rows={12}
              defaultValue={v.content ?? ""}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field
            label="Keywords"
            hint="Comma- or newline-separated. Boost retrieval for these terms."
          >
            <Textarea
              name="keywordsText"
              rows={2}
              defaultValue={keywordsText}
              placeholder="drais, school, attendance, biometric"
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
          <Field label="Estimated tokens">
            <div className="px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded-lg border border-slate-200">
              {v.tokenEstimate ?? 0} tokens
              <span className="ml-2 text-xs text-slate-400">
                (recomputed on save)
              </span>
            </div>
          </Field>
        </div>
        <div className="mt-4 text-xs text-slate-500">
          Embedding status:{" "}
          {hasEmbedding ? (
            <span className="text-green-700">stored</span>
          ) : (
            <span className="text-slate-400">
              not generated yet — retrieval uses keyword scoring until an ingest job runs
            </span>
          )}
          . Saving any change resets the embedding so it regenerates.
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/ai-docs">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
