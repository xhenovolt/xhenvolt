import Link from "next/link";
import {
  Card,
  Field,
  Input,
  PrimaryButton,
  SecondaryButton,
  Textarea,
} from "../_components/ui";
import { StatusPicker } from "../_components/fields";

interface FormValues {
  scope?: string | null;
  eyebrow?: string | null;
  headline?: string | null;
  subheadline?: string | null;
  ctaPrimaryLabel?: string | null;
  ctaPrimaryHref?: string | null;
  ctaSecondaryLabel?: string | null;
  ctaSecondaryHref?: string | null;
  backgroundUrl?: string | null;
  media?: unknown;
  sortOrder?: number | null;
  published?: boolean | null;
}

export default function HeroForm({
  action,
  initial,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  initial?: FormValues;
  submitLabel: string;
}) {
  const v = initial ?? {};
  const media = (v.media ?? {}) as { tags?: string[] };
  const tagsText = Array.isArray(media.tags) ? media.tags.join(", ") : "";

  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Scope" hint="Which page this hero appears on. Use 'home' for the homepage.">
            <Input
              name="scope"
              required
              defaultValue={v.scope ?? "home"}
              placeholder="home"
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
        <div className="mt-4">
          <Field
            label="Eyebrow / badge"
            hint="Small label above the headline. Use ' · ' to split into two pill badges."
          >
            <Input
              name="eyebrow"
              defaultValue={v.eyebrow ?? ""}
              placeholder="Uganda's #1 School Management System · Trusted by 37+ Institutions"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Headline">
            <Input
              name="headline"
              required
              defaultValue={v.headline ?? ""}
              placeholder="School Management & Attendance Tracking for Uganda"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Subheadline">
            <Textarea
              name="subheadline"
              rows={3}
              defaultValue={v.subheadline ?? ""}
              placeholder="DRAIS is Uganda's leading school management system…"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Tags / pill labels" hint="Comma- or newline-separated. Shown below the subheadline.">
            <Textarea
              name="tagsText"
              rows={2}
              defaultValue={tagsText}
              placeholder="Biometric Attendance, Real-time Monitoring, School Analytics, Parent Alerts"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Primary CTA label">
            <Input
              name="ctaPrimaryLabel"
              defaultValue={v.ctaPrimaryLabel ?? ""}
              placeholder="Explore DRAIS"
            />
          </Field>
          <Field label="Primary CTA link">
            <Input
              name="ctaPrimaryHref"
              defaultValue={v.ctaPrimaryHref ?? ""}
              placeholder="https://drais.pro"
            />
          </Field>
          <Field label="Secondary CTA label">
            <Input
              name="ctaSecondaryLabel"
              defaultValue={v.ctaSecondaryLabel ?? ""}
              placeholder="Book a Free Demo"
            />
          </Field>
          <Field label="Secondary CTA link">
            <Input
              name="ctaSecondaryHref"
              defaultValue={v.ctaSecondaryHref ?? ""}
              placeholder="/contact"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Background image URL (optional)">
            <Input name="backgroundUrl" defaultValue={v.backgroundUrl ?? ""} />
          </Field>
        </div>
      </Card>

      <Card>
        <StatusPicker name="status" defaultValue={v.published ?? true} />
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/hero">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
