import { MetadataRoute } from "next";

const BASE_URL = "https://xhenvolt.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: "/", priority: 1.0, changeFreq: "weekly" },
    { url: "/about", priority: 0.8, changeFreq: "monthly" },
    { url: "/services", priority: 0.9, changeFreq: "monthly" },
    { url: "/contact", priority: 0.8, changeFreq: "monthly" },
    { url: "/blog", priority: 0.9, changeFreq: "daily" },
    { url: "/case-studies", priority: 0.9, changeFreq: "weekly" },
    { url: "/testimonials", priority: 0.8, changeFreq: "weekly" },
    { url: "/faq", priority: 0.8, changeFreq: "monthly" },
    { url: "/privacy-policy", priority: 0.3, changeFreq: "yearly" },
    { url: "/terms-of-service", priority: 0.3, changeFreq: "yearly" },
    // Primary SEO landing pages
    { url: "/school-attendance-system-uganda", priority: 1.0, changeFreq: "weekly" },
    { url: "/biometric-attendance-uganda", priority: 1.0, changeFreq: "weekly" },
    { url: "/school-management-system-uganda", priority: 1.0, changeFreq: "weekly" },
    { url: "/drais-attendance-system", priority: 1.0, changeFreq: "weekly" },
    { url: "/top-tech-company-uganda", priority: 0.9, changeFreq: "monthly" },
    // Programmatic location pages
    { url: "/attendance-system-kampala", priority: 0.8, changeFreq: "weekly" },
    { url: "/attendance-system-wakiso", priority: 0.8, changeFreq: "weekly" },
    { url: "/attendance-system-jinja", priority: 0.8, changeFreq: "weekly" },
    { url: "/attendance-system-mbarara", priority: 0.8, changeFreq: "weekly" },
    { url: "/attendance-system-gulu", priority: 0.8, changeFreq: "weekly" },
    { url: "/attendance-system-mbale", priority: 0.8, changeFreq: "weekly" },
    { url: "/attendance-system-entebbe", priority: 0.8, changeFreq: "weekly" },
    // Blog articles
    { url: "/blog/why-ugandan-schools-are-switching-to-digital-attendance", priority: 0.9, changeFreq: "monthly" },
    { url: "/blog/best-attendance-system-for-schools-in-uganda-2026", priority: 0.9, changeFreq: "monthly" },
    { url: "/blog/how-biometric-attendance-transforms-african-schools", priority: 0.9, changeFreq: "monthly" },
    { url: "/blog/manual-vs-digital-attendance-cost-analysis", priority: 0.9, changeFreq: "monthly" },
    { url: "/blog/top-school-management-systems-uganda", priority: 0.9, changeFreq: "monthly" },
    { url: "/blog/how-to-automate-student-attendance-tracking", priority: 0.9, changeFreq: "monthly" },
    { url: "/blog/school-erp-uganda-complete-guide", priority: 0.9, changeFreq: "monthly" },
    { url: "/blog/fingerprint-attendance-school-security-uganda", priority: 0.8, changeFreq: "monthly" },
    { url: "/blog/reduce-absenteeism-schools-uganda", priority: 0.8, changeFreq: "monthly" },
    { url: "/blog/drais-vs-manual-attendance-comparison", priority: 0.8, changeFreq: "monthly" },
  ];

  return staticPages.map(({ url, priority, changeFreq }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: now,
    changeFrequency: changeFreq as MetadataRoute.Sitemap[0]["changeFrequency"],
    priority,
  }));
}
