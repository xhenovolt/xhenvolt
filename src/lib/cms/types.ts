/**
 * CMS type system.
 *
 * A "Section" is a unit of editable content on a page (e.g. the homepage
 * hero, the services grid, a testimonials block). Each section has:
 *
 *  - a stable key (used as the database identity and the editor URL)
 *  - a kind (semantic type: hero, list, gallery, faq, etc.)
 *  - one or more EditableFields describing what an admin can change
 *  - a resolver that loads the section's current content (often from a
 *    repository), and
 *  - a fallback that's used if the resolver returns nothing.
 *
 * Storage is abstracted: a Section's resolver can pull from any
 * repository (testimonials, statistics, settings, ai docs, …) without
 * the registry caring how the bytes are persisted.
 */

export type FieldType =
  | "text"
  | "richtext"
  | "image"
  | "link"
  | "number"
  | "boolean"
  | "select"
  | "list"
  | "relation"
  | "color"
  | "json";

export interface EditableField {
  /** Stable identifier inside the section (e.g. "headline"). */
  key: string;
  /** Human label shown in the admin form. */
  label: string;
  /** Editor widget to use. */
  type: FieldType;
  /** Optional help text shown in the admin form. */
  hint?: string;
  /** Whether the value must be present to publish. */
  required?: boolean;
  /** For `select` fields. */
  options?: Array<{ label: string; value: string }>;
  /** Max length for text/richtext. */
  maxLength?: number;
  /** For `relation` fields: which entity is referenced (e.g. "systems"). */
  relation?: string;
  /** For `list` fields: the item shape. */
  itemFields?: EditableField[];
}

export type SectionKind =
  | "hero"
  | "stat-grid"
  | "system-grid"
  | "testimonial-list"
  | "client-logos"
  | "timeline"
  | "team-grid"
  | "service-grid"
  | "faq-list"
  | "cta"
  | "rich-content"
  | "navigation"
  | "footer"
  | "social"
  | "settings"
  | "seo";

export interface SectionDefinition<TContent = unknown> {
  /** Stable identifier — primary key in admin URLs and DB lookups. */
  key: string;
  /** Visible name in the admin sidebar / list. */
  label: string;
  /** Semantic kind — drives the renderer + form preset. */
  kind: SectionKind;
  /** Route(s) where this section appears. Used for "where is this used?". */
  routes: string[];
  /** Short description shown in the admin. */
  description?: string;
  /** Field schema for the admin form. */
  fields: EditableField[];
  /** Loads the current content (typed). */
  resolve: () => Promise<TContent | null>;
  /** Returned when resolve() yields null / throws. */
  fallback: TContent;
  /** Cache tags to bust on edit. */
  cacheTags?: string[];
}

export interface SectionRecord<TContent = unknown> {
  definition: SectionDefinition<TContent>;
  content: TContent;
  isFallback: boolean;
}
