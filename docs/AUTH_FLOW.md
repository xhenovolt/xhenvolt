# Authentication Flow

Step-by-step trace of a sign-in, with the failure mode each step can
contribute.

## The happy path (6 steps)

```
1. User submits email + password to POST /api/admin/login
2. Rate limiter accepts (per-IP, in-memory, 8/min)
3. Zod validates the payload
4. hasDb() reports the DB client is initialized
5. authenticateAdmin(email, password)
     ↳ findAdminByEmail   (SELECT FROM admin_users WHERE email = ?)
     ↳ verifyPassword     (PBKDF2-SHA256 timing-safe compare)
     ↳ touch last_login_at (best-effort UPDATE)
6. createSession(userId, ipHash, userAgent)
     ↳ generates 32-byte random token
     ↳ INSERT INTO admin_sessions (token, user_id, expires_at, …)
7. Response sets cookie xhv_admin_session, returns { ok: true, next: "/admin" }
8. Client router.push(next); router.refresh()
9. Browser GETs /admin
10. middleware reads cookie, calls verifySession(token):
     SELECT … FROM admin_sessions JOIN admin_users
     WHERE token = ? AND expires_at > now()
11. Session resolves → admin/layout.tsx renders the dashboard shell
```

Every numbered step can fail. The job of the auth system is to label
each failure correctly. See [ERROR_CLASSIFICATION.md](./ERROR_CLASSIFICATION.md).

## Failure modes & where they surface

| # | Failure | API status | Code | UI banner |
|---|---|---|---|---|
| 2 | More than 8 attempts in 60s from same IP | 429 | `rate_limited` | Amber: "Too many attempts" |
| 3 | Missing email/password, bad JSON | 400 | `validation_failed` | Amber: "Check your input" |
| 4 | `DATABASE_URL` not loaded, `hasDb() === false` | 503 | `database_unavailable` | Orange: "Service unavailable" |
| 5 | DB SELECT throws (network, SSL, etc.) | 503 | `database_query_failed` | Orange: "Service unavailable" |
| 5 | User row doesn't exist for that email | 401 | `invalid_credentials` | Red: "Incorrect email or password" |
| 5 | Password hash doesn't match | 401 | `invalid_credentials` | Red: "Incorrect email or password" |
| 6 | INSERT into admin_sessions throws | 500 | `session_create_failed` | Orange: "Session creation failed" |
| 10 | Cookie missing on subsequent request | — | redirect to login | (no error — just bounce) |
| 10 | Session row expired or doesn't exist | — | redirect to login | (no error — just bounce) |

**The cardinal rule** (enforced at step 4): never say "invalid email or
password" when the DB is unreachable. That misclassification has cost
operators hours of debugging in the past.

## Component map

```
/admin/login              client component
  └─ POST /api/admin/login          Node runtime
        ├─ z.parse                  validation
        ├─ rateLimit                in-memory Map
        ├─ hasDb()                  src/lib/db
        ├─ authenticateAdmin        src/lib/auth/users
        │     └─ verifyPassword     src/lib/auth/password (PBKDF2)
        └─ createSession            src/lib/auth/session (INSERT)

middleware.ts             edge runtime
  └─ verifySession        src/lib/auth/session (SELECT … WHERE token = ?)
                          └─ falls back to redirect /admin/login
```

## Cookie

| Attribute | Value | Why |
|---|---|---|
| Name | `xhv_admin_session` | Namespaced; not just `session` |
| Value | 32-byte random, base64url, no signing | Opaque token; DB is source of truth |
| `httpOnly` | true | Inaccessible to JS — defends against XSS |
| `sameSite` | lax | Allows top-level nav from links + works on localhost |
| `secure` | true in production, false in dev | Localhost http would otherwise drop the cookie |
| `path` | `/` | Sent on every admin request |
| `maxAge` | 8 hours | Session TTL; sliding `last_active_at` on each verify |

## Authorization layer (after authentication succeeds)

Every server action calls one of:
- `requireAdmin()` — any signed-in user
- `requireRole("editor")` — minimum rank (ranks: admin > editor > viewer)

These are defense-in-depth on top of middleware. If middleware is
bypassed (misconfigured matcher, etc.), the action layer still blocks
unauthorized mutations.

See [`src/lib/auth/guard.ts`](../src/lib/auth/guard.ts).

## Logout

```
POST /api/admin/logout
  ↳ destroySession(token)      DELETE FROM admin_sessions WHERE token = ?
  ↳ clear cookie (maxAge = 0)
```

Idempotent — sending logout twice is safe.

## Password reset & user creation

CLI only today:

```bash
npm run db:create-admin -- email@example.com 'new-password' 'Display Name'
```

Idempotent. If the email exists, the password is reset AND every
existing session for that user is deleted, forcing re-login.
