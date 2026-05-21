import { PageHeader } from "@/app/admin/_components/ui";

export default function SeoIndex() {
  return (
    <div>
      <PageHeader
        title="SEO"
        description="Global SEO settings and defaults for title templates, meta descriptions, social previews, and robots control."
      />
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
        SEO settings will be managed here soon. This page is scaffolded for the CMS admin experience.
      </div>
    </div>
  );
}
