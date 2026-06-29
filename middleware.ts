import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from "next/server";
import { SESSION_COOKIE } from "./src/lib/auth/cookie";
import { classifyUserAgent } from "./src/lib/analytics/bots";

/**
 * Edge middleware. Two jobs:
 *
 *  1. Admin auth gate (cookie presence ONLY — the real session lookup runs in
 *     (authed)/layout.tsx because mysql2 can't run on the Edge runtime).
 *       src/app/admin/login        → bare layout (no auth)
 *       src/app/admin/(authed)/*   → admin shell + DB-backed auth check
 *
 *  2. Bot / AI-crawler analytics. Crawlers don't execute the client tracker,
 *     so we detect them from the User-Agent here and fire a non-blocking
 *     internal request (event.waitUntil) to /api/analytics/bot-hit, which logs
 *     the visit server-side on the Node runtime. Public pages stay static —
 *     no DB work and no forced dynamic rendering happen in the request path.
 *
 * The matcher excludes /api, _next and static assets, so this never runs on
 * the logging endpoint itself (no recursion) or on asset requests.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.[\\w]+$).*)",
  ],
};

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  // --- 1. Admin gate -------------------------------------------------------
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname !== "/admin/login") {
      const token = req.cookies.get(SESSION_COOKIE)?.value;
      if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // --- 2. Bot / AI-crawler logging (public routes only) --------------------
  if (req.method === "GET") {
    const ua = req.headers.get("user-agent");
    const bot = classifyUserAgent(ua);
    if (bot.isBot) {
      const origin = req.nextUrl.origin;
      event.waitUntil(
        fetch(`${origin}/api/analytics/bot-hit`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-analytics-ua": ua ?? "",
            "x-analytics-ip": req.headers.get("x-forwarded-for") ?? "",
            "x-analytics-country": req.headers.get("x-vercel-ip-country") ?? "",
            "x-analytics-city": req.headers.get("x-vercel-ip-city") ?? "",
            "x-analytics-token": process.env.ANALYTICS_INTERNAL_TOKEN ?? "internal",
          },
          body: JSON.stringify({
            path: pathname,
            referrer: req.headers.get("referer") ?? null,
          }),
        }).catch(() => {}),
      );
    }
  }

  return NextResponse.next();
}
