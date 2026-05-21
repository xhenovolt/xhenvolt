/**
 * Importing this module triggers every section's `defineSection(...)` call,
 * which populates the registry. Anywhere that needs the registry (admin
 * pages, /api/cms, render-side helpers) must import from here, not from
 * the individual section files, to guarantee registration.
 */
import "./homepage-hero.section";
import "./testimonials.section";

export { listSections, getSection, sectionsForRoute, resolveSection } from "../registry";
