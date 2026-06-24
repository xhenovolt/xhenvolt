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
import { BoolField } from "../../_components/fields";
import {
  RELEASE_CHANNELS,
  PLATFORMS,
  ARCHITECTURES,
  FILE_TYPES,
} from "@/lib/db/schema/cosmos";
import {
  PLATFORM_LABELS,
  CHANNEL_LABELS,
  ARCH_LABELS,
  FILE_TYPE_LABELS,
} from "@/lib/cosmos/format";
import { UrlVerifier } from "./_UrlVerifier";

interface AppOption {
  id: string;
  name: string;
  slug: string;
}

interface FormValues {
  id?: string;
  appProductId?: string | null;
  version?: string | null;
  releaseChannel?: string | null;
  platform?: string | null;
  architecture?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
  githubReleaseUrl?: string | null;
  checksumSha256?: string | null;
  releaseNotes?: string | null;
  isLatest?: boolean | null;
  status?: string | null;
}

export default function ReleaseForm({
  action,
  apps,
  initial,
  submitLabel,
  presetAppId,
}: {
  action: (fd: FormData) => void | Promise<void>;
  apps: AppOption[];
  initial?: FormValues;
  submitLabel: string;
  presetAppId?: string;
}) {
  const v = initial ?? {};
  const selectedApp = v.appProductId ?? presetAppId ?? apps[0]?.id ?? "";

  return (
    <form action={action} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="App">
            <Select name="appProductId" required defaultValue={selectedApp}>
              {apps.length === 0 && <option value="">— create an app first —</option>}
              {apps.map((a) => (
                <option key={a.id} value={a.id}>{a.name} (/{a.slug})</option>
              ))}
            </Select>
          </Field>
          <Field label="Version" hint="e.g. 1.4.2 — no leading 'v'.">
            <Input name="version" required defaultValue={v.version ?? ""} placeholder="1.0.0" />
          </Field>
          <Field label="Platform">
            <Select name="platform" required defaultValue={v.platform ?? "windows"}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Architecture">
            <Select name="architecture" defaultValue={v.architecture ?? "x64"}>
              {ARCHITECTURES.map((a) => (
                <option key={a} value={a}>{ARCH_LABELS[a]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Release channel">
            <Select name="releaseChannel" defaultValue={v.releaseChannel ?? "stable"}>
              {RELEASE_CHANNELS.map((c) => (
                <option key={c} value={c}>{CHANNEL_LABELS[c]}</option>
              ))}
            </Select>
          </Field>
          <Field label="File type">
            <Select name="fileType" required defaultValue={v.fileType ?? "exe"}>
              {FILE_TYPES.map((f) => (
                <option key={f} value={f}>{FILE_TYPE_LABELS[f]}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Card>
        <Field
          label="GitHub release asset URL"
          hint="Paste the direct asset URL from a GitHub release. Must be HTTPS on an approved host (github.com / *.githubusercontent.com)."
        >
          <Input
            name="githubReleaseUrl"
            type="url"
            required
            defaultValue={v.githubReleaseUrl ?? ""}
            placeholder="https://github.com/org/repo/releases/download/v1.0.0/app-setup.exe"
          />
        </Field>
        <div className="mt-3">
          <UrlVerifier />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="File size (bytes)" hint="Optional — shown on the card. Verify URL fills this in for you.">
            <Input name="fileSize" type="number" min={0} defaultValue={v.fileSize != null ? String(v.fileSize) : ""} placeholder="74510336" />
          </Field>
          <Field label="SHA-256 checksum" hint="Optional. 64 hex chars. Enables verification on the public page.">
            <Input name="checksumSha256" defaultValue={v.checksumSha256 ?? ""} placeholder="e3b0c442…" />
          </Field>
        </div>
      </Card>

      <Card>
        <Field label="Release notes" hint="What changed in this version. Supports line breaks.">
          <Textarea name="releaseNotes" rows={5} defaultValue={v.releaseNotes ?? ""} placeholder="• Fixed…\n• Added…" />
        </Field>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status" hint="Only 'Published' releases are downloadable publicly.">
            <Select name="status" defaultValue={v.status ?? "published"}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <div className="flex items-end">
            <BoolField
              name="isLatest"
              label="Mark as latest"
              hint="The latest build for this app + platform + channel. Setting this unsets the previous one."
              defaultChecked={Boolean(v.isLatest)}
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Link href="/admin/cosmos/releases">
          <SecondaryButton>← Cancel</SecondaryButton>
        </Link>
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
