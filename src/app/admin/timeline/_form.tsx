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
import { ListField, BoolField, StatusPicker } from "../_components/fields";

interface FormValues {
  title?: string | null;
  description?: string | null;
  occurredOn?: string | null;
  label?: string | null;
  icon?: string | null;
  accentColor?: string | null;
  highlight?: unknown;
  events?: unknown;
  sortOrder?: number | null;
  published?: boolean | null;
}

const ICONS = ["rocket", "school", "globe", "fingerprint", "users", "star", "calendar"];

function dateString(value: string | null | undefined): string {
  if (!value) return "";
  // Drizzle returns 'YYYY-MM-DD' or full ISO; trim to date.
  return String(value).slice(0, 10);
}

export default function TimelineForm({
  action,
  initial,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  initial?: FormValues;
  submitLabel: string;
}) {
  const v = initial ?? {};
  const events = Array.isArray(v.events)
    ? (v.events as string[]).map((s) => ({ label: s }))
    : [];

  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Title">
            <Input
              name="title"
              required
              defaultValue={v.title ?? ""}
              placeholder="Foundation & First Clients"
            />
          </Field>
          <Field label="Label" hint="Short period chip — e.g. 'June 2025'.">
            <Input
              name="label"
              defaultValue={v.label ?? ""}
              placeholder="June 2025"
            />
          </Field>
          <Field label="Occurred on">
            <Input
              name="occurredOn"
              type="date"
              required
              defaultValue={dateString(v.occurredOn)}
            />
          </Field>
          <Field label="Icon (lucide)">
            <Select name="icon" defaultValue={v.icon ?? "calendar"}>
              {ICONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Accent color (hex)">
            <Input
              name="accentColor"
              defaultValue={v.accentColor ?? ""}
              placeholder="#3b82f6"
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
          <Field label="Description">
            <Textarea
              name="description"
              required
              rows={3}
              defaultValue={v.description ?? ""}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <ListField
          name="eventsJson"
          label="Events / bullet items"
          hint="Each becomes a bullet under the milestone."
          defaultItems={events}
          itemSchema={[
            {
              key: "label",
              label: "Event",
              type: "text",
              placeholder: "Northgate Schools onboarded",
            },
          ]}
          newItem={() => ({ label: "" })}
          maxItems={20}
        />
      </Card>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatusPicker name="status" defaultValue={v.published ?? true} />
          <div className="flex items-end">
            <BoolField
              name="highlight"
              label="Key milestone"
              hint="Highlights show a badge and stronger border."
              defaultChecked={Boolean(v.highlight)}
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/timeline">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
