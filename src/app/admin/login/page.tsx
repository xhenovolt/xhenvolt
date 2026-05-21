"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type HealthStatus = "ok" | "degraded" | "down" | "unknown";
type ErrorCategory =
  | "validation"
  | "authentication"
  | "authorization"
  | "infrastructure"
  | "configuration"
  | "session"
  | "unknown";

interface LoginErrorState {
  category: ErrorCategory;
  code: string;
  message: string;
  hint?: string;
}

const CATEGORY_STYLE: Record<ErrorCategory, { card: string; title: string; titleText: string }> = {
  validation: {
    card: "bg-amber-50 border-amber-200",
    title: "Check your input",
    titleText: "text-amber-900",
  },
  authentication: {
    card: "bg-red-50 border-red-200",
    title: "Sign-in failed",
    titleText: "text-red-700",
  },
  authorization: {
    card: "bg-red-50 border-red-200",
    title: "Not authorized",
    titleText: "text-red-700",
  },
  infrastructure: {
    card: "bg-orange-50 border-orange-200",
    title: "Service unavailable",
    titleText: "text-orange-800",
  },
  configuration: {
    card: "bg-orange-50 border-orange-200",
    title: "Server configuration error",
    titleText: "text-orange-800",
  },
  session: {
    card: "bg-orange-50 border-orange-200",
    title: "Session creation failed",
    titleText: "text-orange-800",
  },
  unknown: {
    card: "bg-slate-50 border-slate-200",
    title: "Something went wrong",
    titleText: "text-slate-700",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<LoginErrorState | null>(null);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);

  // Probe system health on mount so the user sees infra issues BEFORE
  // typing credentials.
  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/admin/health", { signal: ac.signal, cache: "no-store" })
      .then(async (r) => {
        const data: { status?: HealthStatus } = await r.json().catch(() => ({}));
        setHealth(data.status ?? "unknown");
      })
      .catch(() => setHealth("unknown"));
    return () => ac.abort();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError({
          category: (data.category as ErrorCategory) ?? "unknown",
          code: data.code ?? "unknown_error",
          message: data.message ?? "Sign-in failed.",
          hint: data.hint,
        });
        setLoading(false);
        return;
      }
      router.push(data.next ?? "/admin");
      router.refresh();
    } catch {
      setError({
        category: "infrastructure",
        code: "network_error",
        message: "Could not reach the sign-in service.",
        hint: "Check your network connection and try again.",
      });
      setLoading(false);
    }
  }

  const errStyle = error ? CATEGORY_STYLE[error.category] : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-4">
        {/* System health banner — only when degraded or down */}
        {health === "down" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
            <div className="font-semibold text-red-700 mb-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
              System is down
            </div>
            <p className="text-red-800">
              Critical services are unreachable. Sign-in will not succeed until
              this is resolved.
            </p>
            <a
              href="/api/admin/health"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-red-700 underline"
            >
              Open raw health report →
            </a>
          </div>
        )}
        {health === "degraded" && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <div className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
              System is degraded
            </div>
            <p className="text-amber-900">
              Some services are reporting issues. Sign-in may still work.
            </p>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
        >
          <div className="mb-6">
            <div className="text-xl font-bold text-slate-900">Xhenvolt Admin</div>
            <div className="text-sm text-slate-500 mt-1">
              Sign in to manage content
            </div>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              autoFocus
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {error && errStyle && (
            <div className={`mt-4 rounded-lg border p-3 text-sm ${errStyle.card}`}>
              <div className={`font-semibold ${errStyle.titleText}`}>
                {errStyle.title}
              </div>
              <div className={`mt-0.5 ${errStyle.titleText}`}>
                {error.message}
              </div>
              {error.hint && (
                <div className="mt-2 text-xs text-slate-600">{error.hint}</div>
              )}
              <div className="mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                {error.code}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading || password.length === 0 || email.length === 0 || health === "down"
            }
            className="mt-5 w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-semibold rounded-lg py-2.5 transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <div className="mt-4 text-xs text-slate-400 leading-relaxed">
            Admin users live in the{" "}
            <span className="font-mono">admin_users</span> table. Bootstrap
            with{" "}
            <span className="font-mono">
              npm run db:create-admin -- &lt;email&gt; &lt;password&gt;
            </span>
            .
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/api/admin/health"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            View system health JSON →
          </Link>
        </div>
      </div>
    </div>
  );
}
