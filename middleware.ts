import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "./src/lib/auth/session";

export const config = {
  // Run on every route except static assets, so we can inject the pathname header
  // and protect /admin/*.
  matcher: ["/((?!_next/|favicon|.*\\..*).*)"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Forward the pathname so server layouts/components can read it.
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-xhv-path", pathname);

  if (pathname === "/admin/login") {
    return NextResponse.next({ request: { headers: reqHeaders } });
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({ request: { headers: reqHeaders } });
}
