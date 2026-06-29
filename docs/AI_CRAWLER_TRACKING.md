# AI Crawler Tracking — what it can and cannot tell you

Classifier: `src/lib/analytics/bots.ts`. Logging: Edge middleware →
`/api/analytics/bot-hit`. Dashboard: **Analytics → Bots & AI Crawlers**.

## What we CAN detect
A crawler that fetched a page and **declared itself** in the User-Agent. We
separate two buckets:

- **Likely AI crawlers** — GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
  Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended,
  Applebot-Extended, Meta-ExternalAgent, Bytespider, CCBot (Common Crawl),
  Cohere, Diffbot, YouBot, Amazonbot, ImagesiftBot.
- **Search / social bots** — Googlebot, Bingbot, DuckDuckBot, YandexBot,
  Baiduspider, Applebot, facebookexternalhit, LinkedInBot, Twitterbot,
  WhatsApp, Slackbot, Telegram, Discord, Pinterest, SEO crawlers, etc.

## What we CANNOT guarantee (read this)
- **A crawler visit is not proof an AI trained on or answered from our content.**
  It only means a fetch happened. The dashboard deliberately says *"likely AI
  crawler activity"*, never certainty.
- **User-Agents can be spoofed.** A real browser can claim to be GPTBot, and a
  scraper can claim to be Chrome. UA-based detection is a strong signal, not an
  identity proof.
- **Verified IP ranges are not checked.** Operators like Google/OpenAI publish IP
  ranges you could cross-check for authenticity; we do not (yet). So treat
  counts as indicative, not audited.
- **JS-less bots only appear server-side.** They never run the client tracker, so
  they're captured by middleware. A crawler that doesn't request HTML (or is
  blocked before middleware) won't appear.

## How it's logged (no performance cost to humans)
Middleware runs at the edge on every page request, cheaply regex-checks the UA,
and for bots fires `event.waitUntil(fetch('/api/analytics/bot-hit'))`. Human page
rendering is untouched and stays static.

## Honest framing for the dashboard
Use this data to answer *"are AI/search crawlers fetching our pages, and which
ones?"* — not *"did ChatGPT use our content?"* The latter is not knowable from
server logs alone.
