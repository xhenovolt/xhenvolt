import HomeClient, { type HomeTestimonial } from "./HomeClient";
import type { MilestoneItem } from "@/components/OurJourney";
import {
  listTestimonials,
  listTimeline,
  getSeoMetadata,
} from "@/lib/repositories";
import { resolveCmsSection } from "@/services/cms/section.service";
import type { Metadata } from "next";
import type { HomepageHeroContent } from "@/lib/cms/sections/homepage-hero.section";
import type { TestimonialsContent } from "@/lib/cms/sections/testimonials.section";

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
  const [rows, timelineRows, heroSection, testimonialsSection] = await Promise.all([
    listTestimonials({ limit: 50 }),
    listTimeline(),
    resolveCmsSection<HomepageHeroContent>("homepage_hero"),
    resolveCmsSection<TestimonialsContent>("site_testimonials"),
  ]);

  const hero =
    heroSection?.content ??
    heroSection?.definition?.fallback ?? {
      eyebrow: "Uganda's #1 School Management System",
      headline: "School Management & Attendance Tracking for Uganda",
      subheadline:
        "DRAIS is Uganda's leading school management system — automating attendance tracking, student reporting, and real-time monitoring for schools that demand excellence.",
      ctaPrimaryLabel: "Explore DRAIS",
      ctaPrimaryHref: "https://drais.pro",
      ctaSecondaryLabel: "Book a Free Demo",
      ctaSecondaryHref: "/contact",
      tags: ["Biometric Attendance", "Real-time Monitoring", "School Analytics", "Parent Alerts"],
      backgroundUrl: null,
    };

  const testimonialsSource = testimonialsSection?.content?.items ?? [];
  const testimonials: HomeTestimonial[] =
    testimonialsSource.length > 0
      ? testimonialsSource.map((t) => ({
          name: t.authorName,
          position: t.authorRole ?? "",
          institution: t.organization ?? "",
          quote: t.quote,
          logo: null,
          category: "drais",
          featured: t.featured,
        }))
      : rows.map((t) => ({
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

  return <HomeClient hero={hero} testimonials={testimonials} milestones={milestones} />;
}
