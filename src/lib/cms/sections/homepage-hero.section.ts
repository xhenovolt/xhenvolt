import { defineSection } from "../registry";
import { listHeroSlides } from "@/lib/repositories";
import { CACHE_TAGS } from "@/lib/cache/safe";

export interface HomepageHeroContent {
  eyebrow: string | null;
  headline: string;
  subheadline: string | null;
  ctaPrimaryLabel: string | null;
  ctaPrimaryHref: string | null;
  ctaSecondaryLabel: string | null;
  ctaSecondaryHref: string | null;
  tags: string[];
  backgroundUrl: string | null;
}

export const homepageHero = defineSection<HomepageHeroContent>({
  key: "homepage_hero",
  label: "Homepage Hero",
  kind: "hero",
  routes: ["/"],
  description:
    "The primary hero block on the homepage. Headline, subheadline, badges, and the two CTA buttons.",
  cacheTags: [CACHE_TAGS.hero],
  fields: [
    { key: "eyebrow", label: "Eyebrow / badge text", type: "text", maxLength: 200 },
    { key: "headline", label: "Headline", type: "text", required: true, maxLength: 200 },
    { key: "subheadline", label: "Subheadline", type: "richtext", maxLength: 600 },
    {
      key: "tags",
      label: "Tag pills",
      type: "list",
      hint: "Short pill-shaped labels rendered below the subheadline.",
      itemFields: [{ key: "label", label: "Label", type: "text", maxLength: 60 }],
    },
    { key: "ctaPrimaryLabel", label: "Primary CTA label", type: "text", maxLength: 60 },
    { key: "ctaPrimaryHref", label: "Primary CTA link", type: "link" },
    { key: "ctaSecondaryLabel", label: "Secondary CTA label", type: "text", maxLength: 60 },
    { key: "ctaSecondaryHref", label: "Secondary CTA link", type: "link" },
    { key: "backgroundUrl", label: "Background image", type: "image" },
  ],
  async resolve() {
    const slides = await listHeroSlides("home");
    const s = slides[0];
    if (!s) return null;
    const media = (s.media ?? {}) as { tags?: string[] };
    return {
      eyebrow: s.eyebrow,
      headline: s.headline,
      subheadline: s.subheadline,
      ctaPrimaryLabel: s.ctaPrimaryLabel,
      ctaPrimaryHref: s.ctaPrimaryHref,
      ctaSecondaryLabel: s.ctaSecondaryLabel,
      ctaSecondaryHref: s.ctaSecondaryHref,
      tags: Array.isArray(media.tags) ? media.tags : [],
      backgroundUrl: s.backgroundUrl,
    };
  },
  fallback: {
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
  },
});
