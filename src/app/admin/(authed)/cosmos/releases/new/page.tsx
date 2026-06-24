import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PageHeader } from "../../../_components/ui";
import ReleaseForm from "../_form";
import { createRelease } from "../actions";

export const dynamic = "force-dynamic";

async function getApps() {
  if (!db) return [];
  try {
    return await db
      .select({ id: schema.appProducts.id, name: schema.appProducts.name, slug: schema.appProducts.slug })
      .from(schema.appProducts)
      .orderBy(asc(schema.appProducts.name));
  } catch {
    return [];
  }
}

export default async function NewReleasePage({
  searchParams,
}: {
  searchParams: Promise<{ appId?: string }>;
}) {
  const [{ appId }, apps] = await Promise.all([searchParams, getApps()]);
  return (
    <div>
      <PageHeader
        title="New release"
        description="Paste a GitHub release asset URL. Cosmos validates it against the allow-list before saving."
      />
      <ReleaseForm action={createRelease} apps={apps} submitLabel="Create release" presetAppId={appId} />
    </div>
  );
}
