import type { Metadata } from "next";
import { listFaqs } from "@/lib/repositories";
import FaqClient, { type FaqGroup } from "./FaqClient";

const BASE_URL = "https://xhenvolt.com";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Xhenvolt's services, project process, support, and pricing.",
  alternates: { canonical: `${BASE_URL}/faq` },
};

export const dynamic = "force-dynamic";

/**
 * FAQ page — CMS-driven.
 *
 * Pulls published FAQs from the CMS (admin: /admin/faqs), groups them by
 * category, and renders the interactive client view. When the CMS has no
 * published FAQs (DB offline or not yet seeded), FaqClient falls back to a
 * curated default set so the page is never empty.
 */
export default async function FAQPage() {
  const rows = await listFaqs("public");

  const byCategory = new Map<string, { q: string; a: string }[]>();
  for (const r of rows) {
    const category = r.category?.trim() || "General";
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category)!.push({ q: r.question, a: r.answer });
  }
  const groups: FaqGroup[] = Array.from(byCategory.entries()).map(
    ([category, questions]) => ({ category, questions }),
  );

  return <FaqClient groups={groups} />;
}
