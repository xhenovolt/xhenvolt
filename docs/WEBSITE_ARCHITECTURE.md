# Website Architecture

_Snapshot after Phase 5 (architectural reset). Keep this current as the
codebase evolves._

## Stack

- **Framework**: Next.js 16.1.6, App Router, React 19, TypeScript
- **Database**: Neon Postgres, accessed via Drizzle ORM (`drizzle-orm/neon-http`)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion 12
- **Build**: Turbopack (`next build --turbopack`)
- **Runtime**: Vercel-compatible (edge + Node runtimes used appropriately)

## Layout isolation

The project uses **App Router route groups** to keep the public site and
the admin dashboard completely separate. There is no conditional
chrome-rendering logic, no `if (path.startsWith("/admin"))` branching
inside layouts. Each area owns its own layout file.

```
src/app/
├── layout.tsx                  ← root: <html>/<body> only, no chrome
├── globals.css
├── sitemap.ts                  ← /sitemap.xml
├── robots.ts                   ← /robots.txt
├── favicon.ico
│
├── (website)/                  ← route group — does NOT appear in URLs
│   ├── layout.tsx              ← public chrome: Navbar, Footer, Chatbot, WhatsApp, gradient bg, SEO defaults
│   ├── page.tsx                ← /
│   ├── HomeClient.tsx
│   ├── about/                  ← /about
│   ├── contact/                ← /contact
│   ├── services/               ← /services
│   ├── testimonials/           ← /testimonials
│   ├── faq/
│   ├── blog/
│   ├── case-studies/
│   ├── newsletter/
│   ├── privacy-policy/
│   ├── terms-of-service/
│   ├── support/
│   ├── security/
│   ├── reliability/
│   ├── training/
│   ├── device-integration/
│   ├── drais-attendance-system/
│   ├── school-attendance-system-uganda/
│   ├── school-management-system-uganda/
│   ├── biometric-attendance-uganda/
│   ├── top-tech-company-uganda/
│   └── attendance-system-{entebbe,gulu,jinja,kampala,mbale,mbarara,wakiso}/
│
├── admin/                      ← admin dashboard (separate layout)
│   ├── layout.tsx              ← admin shell: <Sidebar> + <TopBar>, no public chrome
│   ├── _components/{Sidebar,TopBar,ui}.tsx
│   ├── login/                  ← /admin/login (renders without shell)
│   ├── page.tsx                ← /admin (dashboard)
│   ├── testimonials/           ← CRUD
│   ├── faqs/                   ← CRUD
│   ├── settings/               ← contact/whatsapp/ai_assistant
│   └── messages/               ← inbox
│
└── api/
    ├── admin/{login,logout}/   ← session lifecycle (Node runtime)
    ├── ask/                    ← legacy Xhenvolt AI endpoint
    ├── chat/, chat/health/     ← Xhenvolt AI retrieval
    ├── contact/                ← form submissions
    └── revalidate/             ← tag-based cache busting webhook
```

### Why this matters

The previous structure used a conditional in the root layout that read a
middleware-injected header and decided whether to render the public
chrome. That was a workaround. Route groups are the correct App Router
pattern: each group's `layout.tsx` is the only chrome it ever sees, with
no possibility of inheritance from above.

## Rendering flow

1. **Request** hits `middleware.ts`.
2. For `/admin/*`: middleware verifies the session cookie against
   `admin_sessions` in Neon. Anonymous → redirect to `/admin/login`.
   Authenticated → forward, with `x-xhv-path` header attached for the
   shell to read.
3. **Root layout** runs — emits `<html>`/`<body>` only.
4. The matching group layout runs — either `(website)/layout.tsx` (which
   wraps with Navbar, Footer, gradient background, floating CTAs) or
   `admin/layout.tsx` (which wraps with Sidebar + TopBar).
5. The route's `page.tsx` runs as a server component, fetching from
   repositories via `safeQuery` (timeout + typed fallback + cache).
6. Server components compose existing client islands (`*Client.tsx`,
   `Navbar`, `Footer`, animations) by passing data as props.

## Data access layer

Every read from Neon goes through `src/lib/repositories/*` which call
`safeQuery` from `src/lib/cache/safe.ts`. `safeQuery`:

- Wraps the loader in a 4-second timeout
- Catches errors and returns a typed fallback
- In production, wraps in `unstable_cache` with tag-based revalidation
- Exposes a `CACHE_TAGS` registry that admin mutations bust on save

Mutations are Next.js server actions (`"use server"`) declared next to
the page that consumes them. Every action re-verifies the session against
the DB before touching data.

## Public DB-driven surfaces

These pages read from Neon and render via the server-shell pattern (RSC
fetches → client component renders):

| Route | Layout | DB-driven sections | SEO via DB |
|---|---|---|---|
| `/` | `(website)` | Testimonials, OurJourney timeline | yes |
| `/about` | `(website)` | Team section | yes |
| `/services` | `(website)` | Systems + proof-point stats | yes |
| `/contact` | `(website)` | (form posts to `/api/contact`) | yes |
| `/testimonials` | `(website)` | Testimonials + happiest-client + stats | yes |

Other routes still render their hardcoded content. They will be
migrated incrementally — see [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md).

## Layout chrome (DB-driven)

- **Navbar** (`NavbarServer` → `Navbar`): nav links from
  `navigation_links` (top-level + children grouped by `parent_id`)
- **Footer** (`FooterServer` → `Footer`): columns from `footer_links`,
  contact from `settings.contact`, socials from `social_links`
- **WhatsApp CTA** (`WhatsAppCTAServer` → `WhatsAppCTA`):
  `settings.whatsapp`
- **Chatbot** (`IntelligentChatbot`): UI is client-only, AI backend is
  `/api/chat` powered by `ai_training_documents` + `faqs` retrieval

All client islands accept hardcoded fallbacks as last resort, so the UI
never breaks if Neon is unreachable.
