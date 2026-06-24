import { NextResponse, type NextRequest } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/guard";
import {
  validateDownloadUrl,
  extensionMatchesFileType,
  probeReleaseUrl,
} from "@/lib/cosmos/urls";
import { FILE_TYPES, type FileType } from "@/lib/db/schema/cosmos";

/**
 * Admin-only release URL verifier (the "Verify URL" button).
 *
 * Runs the same allow-list + protocol checks the resolver uses, optionally
 * checks the extension against the declared file type, and performs a HEAD
 * reachability probe (which the public download path never does). Returns
 * structured results so the admin form can show precise feedback.
 */

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { url?: string; fileType?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const url = (body.url ?? "").trim();
  const fileType = body.fileType as FileType | undefined;

  const safety = validateDownloadUrl(url);
  const extension =
    safety.ok && fileType && FILE_TYPES.includes(fileType)
      ? extensionMatchesFileType(url, fileType)
      : { ok: true as const };

  // Only probe reachability when the URL already passed safety + extension.
  const reachable =
    safety.ok && extension.ok
      ? await probeReleaseUrl(url)
      : { ok: false, reason: "Skipped — fix the issues above first." };

  return NextResponse.json({
    safety,
    extension,
    reachable,
    overall: safety.ok && extension.ok && reachable.ok,
  });
}
