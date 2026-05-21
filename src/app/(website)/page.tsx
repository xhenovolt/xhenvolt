import HomeClient, { type HomeTestimonial } from "./HomeClient";
import type { MilestoneItem } from "@/components/OurJourney";
import {
  listTestimonials,
  listTimeline,
  getSeoMetadata,
} from "@/lib/repositories";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/");
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ?? undefined,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      type: (seo.ogType as "website") ?? "website",
    },
  };
}

function logoBasename(url: string | null): string | null {
  if (!url) return null;
  const parts = url.split("/");
  return parts[parts.length - 1] || null;
}

export default async function Page() {
  const [rows, timelineRows] = await Promise.all([
    listTestimonials({ limit: 50 }),
    listTimeline(),
  ]);
  const testimonials: HomeTestimonial[] = rows.map((t) => ({
    name: t.authorName,
    position: t.authorRole ?? "",
    institution: t.organization ?? "",
    quote: t.quote,
    logo: logoBasename(t.avatarUrl),
    category: "drais",
    featured: t.featured,
  }));
  const milestones: MilestoneItem[] = timelineRows.map((m) => ({
    title: m.title,
    description: m.description,
    label: m.label ?? "",
    icon: m.icon ?? "calendar",
    accentColor: m.accentColor ?? "#3b82f6",
    events: Array.isArray(m.events) ? (m.events as string[]) : [],
    highlight: Boolean(m.highlight),
  }));
  return <HomeClient testimonials={testimonials} milestones={milestones} />;
}
