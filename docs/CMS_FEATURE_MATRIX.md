# Xhenvolt CMS — Feature Matrix

Status key: ✅ Working · 🔧 Fixed this phase · 🟡 Honest stub (flagged, not faked) · ❌ Not built

| # | Module | Admin route | Persists? | Public surface | Status |
|---|---|---|---|---|---|
| 1 | Dashboard | `/admin` | n/a (read counts) | — | 🔧 card links fixed |
| 2 | Pages | `/admin/pages` | ✅ TiDB `pages` | code-rendered routes | 🔧 `new` stub → real form |
| 3 | Homepage sections | `/admin/hero` + section service | ✅ | `/` | ✅ |
| 4 | Hero slides | `/admin/hero` | ✅ `hero_slides` | `/` | ✅ |
| 5 | Services / Products | `/admin/services` | ✅ `services` | `/services` | ✅ |
| 6 | Systems (DRAIS etc.) | `/admin/systems` | ✅ `systems` | `/services`, home | ✅ |
| 7 | About / company | via settings + team | ✅ | `/about` | ✅ |
| 8 | Team members | `/admin/team` | ✅ `team_members` | `/about` | ✅ |
| 9 | Testimonials | `/admin/testimonials` | ✅ `testimonials` | `/`, `/testimonials` | ✅ |
| 10 | Statistics / counters | `/admin/statistics` | ✅ `statistics` | home | ✅ |
| 11 | FAQs | `/admin/faqs` | ✅ `faqs` | `/faq` | 🔧 public page now CMS-driven |
| 12 | CTAs | hero/section content | ✅ | various | ✅ |
| 13 | Navigation | `/admin/navigation` | ✅ `navigation_links` | navbar | ✅ |
| 14 | Footer | `/admin/footer` | ✅ `footer_links` | footer | ✅ |
| 15 | SEO metadata | `/admin/seo` | ✅ `seo_metadata` | per-route `generateMetadata` | ✅ |
| 16 | Site settings | `/admin/settings` | ✅ `settings` (upsert) | site-wide | ✅ |
| 17 | Timeline | `/admin/timeline` | ✅ `timeline_entries` | `/about` | ✅ |
| 18 | Clients | `/admin/clients` | ✅ `clients` | logos | ✅ |
| 19 | Contact / Inquiries | `/admin/messages` | ✅ `contact_messages` | `/contact` form | ✅ |
| 20 | Newsletter / Subscribers | `/admin/subscribers` | ✅ `subscribers` (upsert, CSV export) | `/newsletter`, footer | ✅ dedicated model (P2) |
| 21 | AI Training Docs | `/admin/ai-docs` | ✅ `ai_training_documents` | chatbot | ✅ |
| 22 | Cosmos — Apps | `/admin/cosmos/apps` | ✅ `app_products` | `/cosmos` | ✅ |
| 23 | Cosmos — Releases | `/admin/cosmos/releases` | ✅ `app_releases` | `/cosmos/[slug]` | ✅ |
| 24 | Cosmos — Downloads | `/admin/cosmos/downloads` | ✅ `download_events` | `/download/[slug]` | ✅ |
| 25 | System Health | `/admin/system-health` | read (real probes) | — | ✅ |
| 26 | Audit log | `/admin/audit` | read `admin_audit_logs` | — | ✅ |
| 27 | Media Library | `/admin/media` | ✅ `media_assets` (URL registry + picker) | image fields | 🟡 registry live; device upload needs storage provider |
| 28 | AI Conversation Logs viewer | `/admin/ai-logs` | read `ai_conversation_logs` | — | ✅ session-grouped viewer |
| 29 | Users / Roles (RBAC UI) | — | `admin_users` exists | — | ❌ single-role only |
| 30 | Appearance / theme | — | — | client toggle | ❌ not a CMS module |
| 31 | Page section builder | — | — | code-rendered | ❌ Phase 7 |

**Tally:** 25 ✅ working · 4 🔧 fixed · 1 🟡 honest stub (Media) · 3 ❌ not built.
