import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "node:crypto";
import { authenticateAdmin } from "@/lib/auth/users";
import { createSession, SESSION_COOKIE } from "@/lib/auth/session";
import { hasDb } from "@/lib/db";
import {
  DatabaseError,
  InvalidCredentialsError,
  RateLimitedError,
  SessionError,
  ValidationError,
  normalizeError,
} from "@/lib/errors";

export const runtime = "nodejs";

const loginInput = z.object({
  email: z.string().trim().email().max(240),
  password: z.string().min(1).max(200),
  next: z.string().max(200).optional(),
});

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const b = loginAttempts.get(key);
  if (!b || b.resetAt < now) {
    loginAttempts.set(key, { count: 1, resetAt: now + 60_000 });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= 8) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, retryAfter: 0 };
}

function hashIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0].trim() || "0.0.0.0";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

function errorResponse(err: unknown) {
  const payload = normalizeError(err);
  return NextResponse.json(
    {
      ok: false,
      code: payload.code,
      category: payload.category,
      message: payload.message,
      hint: payload.hint,
    },
    { status: payload.status },
  );
}

export async function POST(req: NextRequest) {
  const ipHash = hashIp(req);

  // Step 1 — rate limit (per IP, in-memory).
  const rl = rateLimit(ipHash);
  if (!rl.ok) return errorResponse(new RateLimitedError(rl.retryAfter));

  // Step 2 — parse + validate request body.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(new ValidationError("Request body is not valid JSON."));
  }
  const parsed = loginInput.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      new ValidationError(
        "Email and password are required.",
        "Check the form fields and try again.",
      ),
    );
  }

  // Step 3 — verify infra BEFORE attempting authentication.
  // This is the rule: never say "wrong password" when the DB is down.
  if (!hasDb()) {
    return errorResponse(
      new DatabaseError({
        message: "Authentication service temporarily unavailable.",
        hint: "The server cannot reach the database. Check /admin/system-health.",
      }),
    );
  }

  // Step 4 — authenticate. authenticateAdmin returns null for wrong creds,
  // or throws when the DB call itself fails.
  let user;
  try {
    user = await authenticateAdmin(parsed.data.email, parsed.data.password);
  } catch (err) {
    return errorResponse(
      new DatabaseError({
        code: "database_query_failed",
        message: "Authentication service temporarily unavailable.",
        hint: "Database query failed during sign-in. Check /admin/system-health.",
        cause: err,
      }),
    );
  }
  if (!user) {
    // Pace this slightly to discourage user enumeration via timing.
    await new Promise((r) => setTimeout(r, 200));
    return errorResponse(new InvalidCredentialsError());
  }

  // Step 5 — create the session row + cookie.
  let session;
  try {
    session = await createSession({
      userId: user.id,
      ipHash,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });
  } catch (err) {
    return errorResponse(
      new SessionError({
        code: "session_create_failed",
        message: "Unable to create a secure session.",
        hint: "Sign-in succeeded but the session could not be persisted. Check /admin/system-health.",
        cause: err,
      }),
    );
  }

  // Step 6 — success.
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
