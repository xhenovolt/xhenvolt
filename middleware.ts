import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "./src/lib/auth/cookie";

/**
 * Edge middleware. Cookie presence check ONLY — the real session lookup
 * (which hits TiDB via mysql2) runs in (authed)/layout.tsx because mysql2
 * cannot run on the Edge runtime.
 *
 *   src/app/admin/login        → bare layout (no auth)
 *   src/app/admin/(authed)/*   → admin shell + DB-backed auth check
 *
 * If the cookie is missing we redirect here so the layout never even
 * has to render. If the cookie exists but the session is expired/invalid,
 * the layout's verifySession() call catches it on the next render.
 */
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
