import { defineSection } from "../registry";
import { listTestimonials } from "@/lib/repositories";
import { CACHE_TAGS } from "@/lib/cache/safe";

export interface TestimonialItemContent {
  id: string;
  authorName: string;
  authorRole: string | null;
  organization: string | null;
  quote: string;
  rating: number;
  featured: boolean;
}

export interface TestimonialsContent {
  items: TestimonialItemContent[];
}

export const testimonialsBlock = defineSection<TestimonialsContent>({
  key: "site_testimonials",
  label: "Testimonials",
  kind: "testimonial-list",
  routes: ["/", "/testimonials"],
  description: "All published testimonials. Featured ones surface in homepage + testimonials page.",
  cacheTags: [CACHE_TAGS.testimonials],
  fields: [
    {
      key: "items",
      label: "Testimonials",
      type: "list",
      itemFields: [
        { key: "authorName", label: "Author", type: "text", required: true, maxLength: 160 },
        { key: "authorRole", label: "Role", type: "text", maxLength: 200 },
        { key: "organization", label: "Organization", type: "text", maxLength: 200 },
        { key: "quote", label: "Quote", type: "richtext", required: true, maxLength: 4000 },
        { key: "rating", label: "Rating (1–5)", type: "number" },
        { key: "featured", label: "Featured", type: "boolean" },
      ],
    },
  ],
  async resolve() {
    const rows = await listTestimonials({ limit: 100 });
    return {
      items: rows.map((t) => ({
        id: t.id,
        authorName: t.authorName,
        authorRole: t.authorRole,
        organization: t.organization,
        quote: t.quote,
        rating: t.rating,
        featured: t.featured,
      })),
    };
  },
  fallback: { items: [] },
});
