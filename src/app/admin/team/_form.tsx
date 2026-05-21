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
  name?: string | null;
  role?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  location?: string | null;
  specialties?: unknown;
  socials?: unknown;
  sortOrder?: number | null;
  published?: boolean | null;
}

export default function TeamForm({
  action,
  initial,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  initial?: FormValues;
  submitLabel: string;
}) {
  const v = initial ?? {};
  const specialtiesText = Array.isArray(v.specialties) ? (v.specialties as string[]).join(", ") : "";
  const socials = (v.socials ?? {}) as Record<string, string | undefined>;

  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name">
            <Input
              name="name"
              required
              defaultValue={v.name ?? ""}
              placeholder="Hamuza Ibrahim"
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
          <Field label="Role / title">
            <Input
              name="role"
              required
              defaultValue={v.role ?? ""}
              placeholder="Founder & CEO"
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
          <Field label="Bio">
            <Textarea name="bio" rows={4} defaultValue={v.bio ?? ""} />
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email (optional)">
            <Input
              name="email"
              type="email"
              defaultValue={v.email ?? ""}
              placeholder="name@xhenvolt.com"
            />
          </Field>
          <Field label="Avatar URL (optional)">
            <Input name="avatarUrl" defaultValue={v.avatarUrl ?? ""} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Specialties" hint="Comma- or newline-separated.">
            <Textarea
              name="specialtiesText"
              rows={2}
              defaultValue={specialtiesText}
              placeholder="Digital Marketing, Growth Strategy, Content Creation"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="LinkedIn URL">
            <Input name="linkedin" defaultValue={socials.linkedin ?? ""} />
          </Field>
          <Field label="Twitter URL">
            <Input name="twitter" defaultValue={socials.twitter ?? ""} />
          </Field>
          <Field label="GitHub URL">
            <Input name="github" defaultValue={socials.github ?? ""} />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatusPicker name="status" defaultValue={v.published ?? true} />
          <Field label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              defaultValue={String(v.sortOrder ?? 0)}
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/team">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
