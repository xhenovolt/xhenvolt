import Link from "next/link";
import {
  Card,
  Field,
  Input,
  PrimaryButton,
  SecondaryButton,
  Textarea,
} from "../_components/ui";

interface FormValues {
  route?: string | null;
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  canonical?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogType?: string | null;
  twitterCard?: string | null;
}

export default function SeoForm({
  action,
  initial,
  submitLabel,
  lockRoute,
}: {
  action: (fd: FormData) => void | Promise<void>;
  initial?: FormValues;
  submitLabel: string;
  lockRoute?: boolean;
}) {
  const v = initial ?? {};
  return (
    <form action={action} className="space-y-6">
      <Card>
        <Field
          label="Route"
          hint={
            lockRoute
              ? "Locked — routes uniquely identify SEO records."
              : "URL path. Must start with /. One record per route."
          }
        >
          <Input
            name="route"
            required
            readOnly={lockRoute}
            defaultValue={v.route ?? ""}
            placeholder="/about"
            className={lockRoute ? "bg-slate-100" : undefined}
          />
        </Field>
        <div className="mt-4">
          <Field label="Title" hint="Shown in browser tabs and search engine results.">
            <Input
              name="title"
              required
              defaultValue={v.title ?? ""}
              placeholder="About Xhenvolt Uganda | Tech Company Building Digital Africa"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description" hint="Search engines show this under the title.">
            <Textarea
              name="description"
              required
              rows={3}
              defaultValue={v.description ?? ""}
              placeholder="One- to two-sentence summary of the page (max ~160 chars)."
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Keywords" hint="Comma-separated. Mostly ignored by Google; still used by some engines.">
            <Textarea
              name="keywords"
              rows={2}
              defaultValue={v.keywords ?? ""}
              placeholder="Xhenvolt Uganda, tech company Uganda, DRAIS"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Canonical URL" hint="Use if this page exists under multiple URLs.">
            <Input
              name="canonical"
              defaultValue={v.canonical ?? ""}
              placeholder="https://xhenvolt.com/about"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold text-slate-700 mb-3">Social preview (OpenGraph + Twitter)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="OG title">
            <Input name="ogTitle" defaultValue={v.ogTitle ?? ""} />
          </Field>
          <Field label="OG type">
            <Input name="ogType" defaultValue={v.ogType ?? "website"} placeholder="website" />
          </Field>
          <Field label="OG image URL">
            <Input name="ogImage" defaultValue={v.ogImage ?? ""} placeholder="/og-image.png" />
          </Field>
          <Field label="Twitter card">
            <Input
              name="twitterCard"
              defaultValue={v.twitterCard ?? "summary_large_image"}
              placeholder="summary_large_image"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="OG description">
            <Textarea
              name="ogDescription"
              rows={2}
              defaultValue={v.ogDescription ?? ""}
              placeholder="Defaults to the description above if left empty."
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/seo">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
