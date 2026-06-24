"use client";

import { useRef, useState, useTransition } from "react";
import { CheckCircle2, XCircle, Loader2, ExternalLink, ShieldQuestion } from "lucide-react";

interface CheckResult {
  ok: boolean;
  reason?: string;
}
interface VerifyResponse {
  safety: CheckResult & { host?: string };
  extension: CheckResult;
  reachable: CheckResult & { status?: number; contentLength?: number | null };
  overall: boolean;
}

/**
 * Reads the sibling `githubReleaseUrl` + `fileType` fields from the form and
 * verifies the URL server-side (allow-list + extension + HEAD reachability)
 * without leaving the page. Purely advisory — the server action re-validates
 * on save regardless.
 */
export function UrlVerifier({ urlFieldName = "githubReleaseUrl", fileTypeFieldName = "fileType" }: {
  urlFieldName?: string;
  fileTypeFieldName?: string;
}) {
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const rootRef = useRef<HTMLDivElement>(null);

  const run = () => {
    setError(null);
    setResult(null);
    // Use the form this component is actually inside — NOT document's first
    // form (that would grab the sidebar logout form, which has no URL field).
    const form = rootRef.current?.closest("form");
    const url = (form?.elements.namedItem(urlFieldName) as HTMLInputElement | null)?.value?.trim() ?? "";
    const fileType = (form?.elements.namedItem(fileTypeFieldName) as HTMLSelectElement | null)?.value ?? "";
    setCurrentUrl(url);
    if (!url) {
      setError("Enter a release URL first.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/cosmos/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, fileType }),
        });
        if (!res.ok) {
          setError(`Verification failed (HTTP ${res.status}).`);
          return;
        }
        setResult((await res.json()) as VerifyResponse);
      } catch {
        setError("Network error while verifying.");
      }
    });
  };

  return (
    <div ref={rootRef} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldQuestion className="h-3.5 w-3.5" />}
          Verify URL
        </button>
        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open release URL
          </a>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {result && (
        <ul className="mt-3 space-y-1.5 text-sm">
          <ResultRow ok={result.safety.ok} label="Host & protocol allow-list" reason={result.safety.reason} />
          <ResultRow ok={result.extension.ok} label="File extension matches type" reason={result.extension.reason} />
          <ResultRow
            ok={result.reachable.ok}
            label={
              result.reachable.contentLength
                ? `Reachable (HEAD ${result.reachable.status ?? ""}, ${(result.reachable.contentLength / 1_048_576).toFixed(1)} MB)`
                : "Reachable (HEAD request)"
            }
            reason={result.reachable.reason}
          />
          <li className={`mt-1 font-semibold ${result.overall ? "text-emerald-700" : "text-amber-700"}`}>
            {result.overall ? "✓ URL looks safe to save." : "This URL has issues — review above."}
          </li>
        </ul>
      )}
    </div>
  );
}

function ResultRow({ ok, label, reason }: { ok: boolean; label: string; reason?: string }) {
  return (
    <li className="flex items-start gap-2">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
      )}
      <span className={ok ? "text-slate-700" : "text-red-600"}>
        {label}
        {!ok && reason ? ` — ${reason}` : ""}
      </span>
    </li>
  );
}
