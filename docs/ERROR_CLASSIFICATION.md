# Error Classification

## The rule

> A user-facing message must reflect what actually went wrong, not what
> is politically easiest to show.

Before Phase 8, the auth route returned "Invalid email or password" for
basically any failure — including database outages. The operator could
spend an hour debugging password issues when the actual problem was
that the dev server hadn't loaded `.env.local`.

Phase 8 fixed this with structured errors that carry a **category** in
addition to a message. The UI renders different colors and copy per
category, so an infrastructure problem and a credential problem are
visually distinct.

## The five categories

| Category | Color | Meaning | Example |
|---|---|---|---|
| `validation` | amber | The user's submitted data is malformed | Email field empty |
| `authentication` | red | Credentials are wrong | "Incorrect email or password" |
| `authorization` | red | Authenticated, but lacks permission | Editor tried to delete a system |
| `infrastructure` | orange | A dependency is down (DB, external API) | Neon unreachable |
| `configuration` | orange | The server is misconfigured (env, build) | `DATABASE_URL` not set |
| `session` | orange | Session lifecycle problem (creation, expiry) | INSERT into `admin_sessions` failed |
| `unknown` | slate | Caught something unclassified | Bug |

Authentication = user's fault. Infrastructure = our fault. Two very
different conversations.

## The structured payload

Every error response from the auth API uses this shape:

```ts
{
  ok: false,
  code: string,           // stable identifier — "invalid_credentials"
  category: ErrorCategory,// see table above
  message: string,        // safe to show the user
  hint?: string           // optional next-step suggestion
}
```

HTTP status mirrors the category (401 for auth, 503 for infra, etc.) so
tools and monitors see the right signal.

## The error classes

[`src/lib/errors.ts`](../src/lib/errors.ts) defines:

```
AppError                  base
├── ValidationError       400 — validation
├── InvalidCredentialsError 401 — authentication
├── UnauthorizedError       401 — authentication
├── ForbiddenError          403 — authorization
├── DatabaseError           503 — infrastructure
├── ConfigurationError      500 — configuration
├── SessionError            500 — session
└── RateLimitedError        429 — validation (with retry-after)
```

Each one has sensible default copy. Throw from service code; the
`normalizeError` helper converts any thrown value into the JSON payload.

## How the login API uses them

[`src/app/api/admin/login/route.ts`](../src/app/api/admin/login/route.ts)
runs through five gates, each with its own typed error:

1. Rate limit → `RateLimitedError`
2. Body parse + Zod → `ValidationError`
3. `hasDb()` check → `DatabaseError` (THIS IS NEW — used to be silent)
4. `authenticateAdmin` throws → `DatabaseError` (DB call failed mid-auth)
5. `authenticateAdmin` returns null → `InvalidCredentialsError`
6. `createSession` throws → `SessionError`

So the operator now gets distinct error codes for: db_unavailable,
database_query_failed, invalid_credentials, session_create_failed.
Each one points at a different remediation.

## How the UI uses them

`/admin/login` reads `category` from the response and chooses:

- A different card background per category (amber/red/orange)
- A different title ("Sign-in failed" vs "Service unavailable" vs "Check your input")
- The `hint` field as a smaller note
- The `code` as a monospace footer (so the user can paste it into a bug report)

For the highest-stakes category — `infrastructure` — the form ALSO
disables the submit button so the user can't keep retrying against a
broken backend.

## Anti-patterns to avoid

❌ `throw new Error("user not found")` — generic, no category, leaks
internal terminology to the user.

❌ `return res.status(500).json({ error: "Something went wrong" })` —
swallows the actual failure mode.

❌ `if (!user || !verifyPassword) return res.json({ error: "Invalid email or password" })`
— conflates user-not-found, wrong-password, db-error, hash-mismatch.

✅ Use the typed classes. Each throw narrates exactly what went wrong.
The UI translates faithfully.
