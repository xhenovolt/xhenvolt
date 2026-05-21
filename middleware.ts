import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "./src/lib/auth/session";

/**
 * Middleware role: protect /admin/* and inject a lightweight pathname
 * header (used by the admin shell for active-state highlighting and
 * breadcrumbs). With route-group layout isolation in place, the header
 * is NOT used to hide public chrome — that's handled at the layout
 * boundary in app/(website)/layout.tsx vs app/admin/layout.tsx.
 */
export const config = {
  // Match /admin itself AND every subpath. The two-pattern form is
  // required: "/admin/:path*" alone does not match bare "/admin" in
  // Next.js 16, so middleware would silently skip it and let the
  // layout render without authorization checks.
  matcher: ["/admin", "/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-xhv-path", pathname);

  if (pathname === "/admin/login") {
    return NextResponse.next({ request: { headers: reqHeaders } });
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request: { headers: reqHeaders } });
}
