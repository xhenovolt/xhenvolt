/**
 * Structured error system.
 *
 * The cardinal rule: a user-facing error message must reflect what
 * actually went wrong, not what's politically easiest to show. A login
 * failure caused by a database outage is NOT "invalid email or
 * password" — that lie wastes the user's time and the operator's time.
 *
 * Throw these typed errors from service-layer code. The API surface
 * catches them and returns { code, category, message, hint } so the
 * UI can render the right state.
 */

export type ErrorCategory =
  | "validation" //   user submitted bad data
  | "authentication" // wrong credentials
  | "authorization" //  authenticated but lacks permission
  | "infrastructure" // db / dependency unavailable
  | "configuration" //  env / startup misconfigured
  | "session" //       session lifecycle problem
  | "unknown";

export interface ErrorPayload {
  code: string;
  category: ErrorCategory;
  message: string; // user-safe message
  hint?: string;   // optional next-step hint
  status: number;  // HTTP status
}

export class AppError extends Error {
  readonly code: string;
  readonly category: ErrorCategory;
  readonly status: number;
  readonly hint?: string;

  constructor(opts: { code: string; category: ErrorCategory; message: string; status: number; hint?: string; cause?: unknown }) {
    super(opts.message, opts.cause ? { cause: opts.cause as Error } : undefined);
    this.name = this.constructor.name;
    this.code = opts.code;
    this.category = opts.category;
    this.status = opts.status;
    this.hint = opts.hint;
  }

  toPayload(): ErrorPayload {
    return {
      code: this.code,
      category: this.category,
      message: this.message,
      hint: this.hint,
      status: this.status,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, hint?: string) {
    super({ code: "validation_failed", category: "validation", message, hint, status: 400 });
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super({
      code: "invalid_credentials",
      category: "authentication",
      message: "Incorrect email or password.",
      status: 401,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super({
      code: "unauthorized",
      category: "authentication",
      message: "Sign in to continue.",
      status: 401,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You don't have permission to perform that action.") {
    super({ code: "forbidden", category: "authorization", message, status: 403 });
  }
}

export class DatabaseError extends AppError {
  constructor(opts: { code?: string; message: string; hint?: string; cause?: unknown } = { message: "Database is unavailable." }) {
    super({
      code: opts.code ?? "database_unavailable",
      category: "infrastructure",
      message: opts.message,
      hint: opts.hint ?? "Authentication service temporarily unavailable. Please retry in a moment.",
      status: 503,
      cause: opts.cause,
    });
  }
}

export class ConfigurationError extends AppError {
  constructor(opts: { missing?: string[]; message?: string } = {}) {
    super({
      code: "configuration_invalid",
      category: "configuration",
      message: opts.message ?? "Server configuration error.",
      hint: opts.missing && opts.missing.length > 0
        ? `Missing or invalid environment variables: ${opts.missing.join(", ")}`
        : "An operator must check the deployment environment.",
      status: 500,
    });
  }
}

export class SessionError extends AppError {
  constructor(opts: { code?: string; message?: string; hint?: string; cause?: unknown } = {}) {
    super({
      code: opts.code ?? "session_failed",
      category: "session",
      message: opts.message ?? "Unable to create a secure session.",
      hint: opts.hint ?? "Try signing in again. If the problem persists, check the system health page.",
      status: 500,
      cause: opts.cause,
    });
  }
}

export class RateLimitedError extends AppError {
  constructor(retryAfterSeconds = 60) {
    super({
      code: "rate_limited",
      category: "validation",
      message: "Too many attempts. Wait a moment and try again.",
      hint: `Retry after ~${retryAfterSeconds} seconds.`,
      status: 429,
    });
  }
}

/**
 * Convert any thrown value into a typed payload safe to send to clients.
 * Unknown errors collapse to a generic infrastructure error — never leak
 * stack traces or driver internals.
 */
export function normalizeError(err: unknown): ErrorPayload {
  if (err instanceof AppError) return err.toPayload();
  if (process.env.NODE_ENV !== "production") {
    console.warn("[errors] unclassified error:", err);
  }
  return {
    code: "unknown_error",
    category: "unknown",
    message: "Something went wrong on our end.",
    hint: "Please retry. If this keeps happening, check /admin/system-health.",
    status: 500,
  };
}
