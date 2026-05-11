import type { Metadata } from "next";
import TestimonialsClient, {
  type TestimonialItem,
  type HappiestClient,
  type StatItem,
} from "./TestimonialsClient";
import {
  listTestimonials,
  listStatistics,
  getSeoMetadata,
} from "@/lib/repositories";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/testimonials");
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ?? undefined,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      type: "website",
    },
  };
}

export default async function Page() {
  const [rows, statRows] = await Promise.all([
    listTestimonials({ limit: 50 }),
    listStatistics("global"),
  ]);

  const featuredRow = rows.find((r) => r.featured);

  const testimonials: TestimonialItem[] = rows
    .filter((r) => r.id !== featuredRow?.id)
    .map((t) => ({
      name: t.authorName,
      role: `${t.authorRole ?? ""}${t.organization ? `, ${t.organization}` : ""}`,
      company: t.organization ?? "",
      text: t.quote,
      rating: t.rating,
      project: "",
      location: t.location ?? "Uganda",
    }));

  const happiestClient: HappiestClient | undefined = featuredRow
    ? {
        name: featuredRow.authorName,
        role: `${featuredRow.authorRole ?? ""}${featuredRow.organization ? `, ${featuredRow.organization}` : ""}`,
        company: featuredRow.organization ?? "",
        text: featuredRow.quote,
        rating: featuredRow.rating,
        project: "",
        location: featuredRow.location ?? "Uganda",
        satisfaction: "100%",
        impact: "Transformed 500+ members' financial lives",
      }
    : undefined;

  const stats: StatItem[] = statRows.slice(0, 4).map((s) => ({
    number: `${s.value}${s.suffix ?? ""}`,
    label: s.label,
  }));

  return (
    <TestimonialsClient
      testimonials={testimonials}
      happiestClient={happiestClient}
      stats={stats}
    />
  );
}
