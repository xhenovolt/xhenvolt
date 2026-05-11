import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "node:crypto";
import { authenticateAdmin } from "@/lib/auth/users";
import { createSession, SESSION_COOKIE } from "@/lib/auth/session";

export const runtime = "nodejs";

const loginInput = z.object({
  email: z.string().trim().email().max(240),
  password: z.string().min(1).max(200),
  next: z.string().max(200).optional(),
});

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const b = loginAttempts.get(key);
  if (!b || b.resetAt < now) {
    loginAttempts.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (b.count >= 8) return false;
  b.count += 1;
  return true;
}

function hashIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0].trim() || "0.0.0.0";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  const ipHash = hashIp(req);
  if (!rateLimit(ipHash)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many login attempts. Wait a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = loginInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const user = await authenticateAdmin(parsed.data.email, parsed.data.password);
  if (!user) {
    await new Promise((r) => setTimeout(r, 200));
    return NextResponse.json(
      { error: "invalid_credentials", message: "Wrong email or password." },
      { status: 401 },
    );
  }

  let session;
  try {
    session = await createSession({
      userId: user.id,
      ipHash,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "session_create_failed", message: "Sign-in service is offline. Try again shortly." },
      { status: 503 },
    );
  }

  const res = NextResponse.json({
    ok: true,
    next: parsed.data.next ?? "/admin",
    user: { email: user.email, name: user.name, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  return res;
}
