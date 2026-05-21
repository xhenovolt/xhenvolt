# Content Engine

## Idea

A page on the public site is a list of **sections**. Each section has a
**kind** (hero, stat-grid, system-grid, …) and a **content** payload.
The kind tells the engine which renderer to use; the payload feeds the
renderer's props.

Pages and sections live in Neon. Adding a hero to `/about` means
inserting a `sections` row, not editing JSX.

## Data shape

```
pages
├── id (uuid, pk)
├── route          ("/", "/about", "/services", …)
├── slug
├── title
├── status         (draft | review | published | archived)
├── published      (bool)
└── deleted_at

sections
├── id (uuid, pk)
├── page_id        → pages.id (cascade)
├── key            stable identifier inside a page ("homepage_hero")
├── kind           "hero" | "stat-grid" | "system-grid" | …
├── title          per-section heading (optional)
├── subtitle       per-section subtitle (optional)
├── body           free-form text (optional)
├── content        JSONB — kind-specific payload
├── sort_order     int
├── published      bool
└── deleted_at
```

## Pipeline

```
Request /about
   ↓
Server component renders <DynamicPage route="/about" />
   ↓
DynamicPage queries pages WHERE route=? AND published
   ↓
DynamicPage queries sections WHERE page_id=? AND published ORDER BY sort_order
   ↓
For each row: getRenderer(kind)({ title, subtitle, body, content })
   ↓
Renderer fetches any auxiliary data via repositories (safeQuery + cache)
   ↓
HTML to the browser
```

Source: [src/lib/cms/render/](../src/lib/cms/render/)

## Adding a new section kind

1. Create `src/lib/cms/render/renderers/<Name>.tsx`. It's a server
   component that accepts `SectionRenderProps`.
2. Register it in `src/lib/cms/render/renderers/index.ts`:

   ```ts
   import MyKind from "./MyKind";
   registerRenderer("my-kind", MyKind);
   ```

3. Insert section rows with `kind = "my-kind"` and the payload your
   renderer expects in `content`.

That's the whole contract. Each renderer is responsible for its own
data fetching, fallbacks, and styling.

## Renderers currently registered

| Kind | What it renders | Auxiliary data |
|---|---|---|
| `hero` | Headline, subtitle, eyebrow, tag pills, two CTA buttons | none (uses `content` only) |
| `stat-grid` | Numeric stats in a 4-col grid | reads `statistics` table, filterable by scope + key list |
| `system-grid` | Product cards with feature bullets | reads `systems` + `system_features` |

## `content` payload shapes

```ts
// kind = "hero"
{
  eyebrow?: string;
  tags?: string[];
  ctaPrimary?:   { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  backgroundUrl?: string;
}

// kind = "stat-grid"
{
  scope?: string;     // "global" | "impact" | "drais" | …
  keys?: string[];    // explicit ordered list of stat keys
}

// kind = "system-grid"
{
  flagshipOnly?: boolean;
  limit?: number;
}
```

## Why not just render everything from JSX?

The site shipped before Phase 6 already had JSX-driven pages. Those
still work and remain the source of truth for routes the renderer
doesn't yet cover. The point of the engine is **incremental migration**:

1. Today: hardcoded JSX renders the homepage. Admins edit per-content
   tables (testimonials, stats, systems, …) via the CRUDs.
2. Phase 7: select pages move to `<DynamicPage>` composition. Section
   ordering becomes editable.
3. Phase 8: a page builder UI lets admins drag-reorder sections, add
   new ones, and preview drafts.

The data model and engine are in place now. Migration is a per-page
decision, not a big-bang rewrite.

## Status semantics (draft / published)

The admin treats `published = false` as **draft**. Draft pages and draft
sections are visible only in the admin; the public site filters on
`published = true` everywhere. The `pages.status` column adds three more
states (`review`, `archived`) for richer workflows. Soft deletes use
`deleted_at`.

## Cache invalidation

Each renderer can declare cache tags via the repositories it uses. When
an admin mutation runs, the relevant `revalidateTag(...)` in its
server action wipes the cached fragment. No deploys, no manual purges.
See [ADMIN_OPERATIONS.md](./ADMIN_OPERATIONS.md) for the full tag list.

## Editable wrapper

`src/lib/cms/Editable.tsx` is a placeholder for live inline editing. It
already detects the admin session and emits `data-cms-section` /
`data-cms-edit-href` attributes. Wrap sections with it today; the
overlay UI ships in Phase 7 without any further wrapping work.
