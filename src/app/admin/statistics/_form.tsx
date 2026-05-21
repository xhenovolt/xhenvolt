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
import { StatusPicker } from "../_components/fields";

interface FormValues {
  key?: string | null;
  label?: string | null;
  value?: string | null;
  suffix?: string | null;
  description?: string | null;
  icon?: string | null;
  scope?: string | null;
  sortOrder?: number | null;
  published?: boolean | null;
}

const SCOPES = ["global", "impact", "drais", "xhaira", "jeton", "consty"];

export default function StatForm({
  action,
  initial,
  submitLabel,
  lockKey,
}: {
  action: (fd: FormData) => void | Promise<void>;
  initial?: FormValues;
  submitLabel: string;
  lockKey?: boolean;
}) {
  const v = initial ?? {};
  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Key"
            hint={
              lockKey
                ? "Locked — the frontend looks up stats by this key."
                : "Lowercase, underscores. Cannot be changed after creation."
            }
          >
            <Input
              name="key"
              required
              readOnly={lockKey}
              defaultValue={v.key ?? ""}
              placeholder="schools_drais"
              className={lockKey ? "bg-slate-100" : undefined}
            />
          </Field>
          <Field label="Label">
            <Input
              name="label"
              required
              defaultValue={v.label ?? ""}
              placeholder="Schools Running DRAIS"
            />
          </Field>
          <Field label="Value">
            <Input
              name="value"
              required
              defaultValue={v.value ?? ""}
              placeholder="31"
            />
          </Field>
          <Field label="Suffix" hint="Optional. Shown right after the value.">
            <Input name="suffix" defaultValue={v.suffix ?? ""} placeholder="+" />
          </Field>
          <Field label="Scope">
            <Select name="scope" defaultValue={v.scope ?? "global"}>
              {SCOPES.map((s) => (
                <option key={s} value={s}>
                  {s}
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
          <Field label="Icon name (lucide)">
            <Input name="icon" defaultValue={v.icon ?? ""} placeholder="trending-up" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description (optional)">
            <Textarea
              name="description"
              rows={2}
              defaultValue={v.description ?? ""}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <StatusPicker name="status" defaultValue={v.published ?? true} />
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/statistics">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
