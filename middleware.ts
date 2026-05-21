import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "./src/lib/auth/session";

/**
 * Middleware role: protect every route under (authed).
 *
 * Layout isolation is now done via route groups:
 *   src/app/admin/login        → bare layout (no auth)
 *   src/app/admin/(authed)/*   → admin shell + auth check
 *
 * So middleware only redirects to /admin/login when the user lacks a
 * session AND is trying to reach a protected page. /admin/login itself
 * bypasses the auth check (it's not inside the matcher's redirect path).
 *
 * NOTE: the matcher MUST include both /admin and /admin/:path* — bare
 * /admin doesn't match :path* in Next.js 16.
 */
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin/login is the only admin URL that does NOT require auth.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
