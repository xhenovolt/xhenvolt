import Link from "next/link";
import {
  PageHeader,
  Card,
  Field,
  Input,
  PrimaryButton,
  SecondaryButton,
} from "../../_components/ui";
import { createMedia } from "../actions";

export const dynamic = "force-dynamic";

export default function NewMedia() {
  return (
    <div>
      <PageHeader
        title="Add media"
        description="Register a hosted image/asset by URL so it can be picked in content forms."
      />
      <form action={createMedia} className="space-y-6">
        <Card>
          <Field label="Asset URL" hint="Public http(s) URL of the image or file.">
            <Input
              name="url"
              type="url"
              required
              placeholder="https://cdn.example.com/banner.png"
            />
          </Field>
          <div className="mt-4">
            <Field label="Alt text" hint="Describes the image for accessibility & SEO.">
              <Input name="alt" placeholder="DRAIS dashboard screenshot" />
            </Field>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Title (optional)">
              <Input name="title" placeholder="Dashboard hero" />
            </Field>
            <Field label="MIME type (optional)">
              <Input name="mimeType" placeholder="image/png" />
            </Field>
            <Field label="Width px (optional)">
              <Input name="width" type="number" min={0} placeholder="1200" />
            </Field>
            <Field label="Height px (optional)">
              <Input name="height" type="number" min={0} placeholder="630" />
            </Field>
          </div>
        </Card>
        <div className="flex items-center justify-between">
          <Link href="/admin/media">
            <SecondaryButton>← Cancel</SecondaryButton>
          </Link>
          <PrimaryButton>Add to library</PrimaryButton>
        </div>
      </form>
    </div>
  );
}
