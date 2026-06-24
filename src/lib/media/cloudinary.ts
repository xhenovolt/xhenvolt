import { createHash } from "node:crypto";

/**
 * Minimal, dependency-free Cloudinary signed upload.
 *
 * Server-only. Reads CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY /
 * CLOUDINARY_API_SECRET from the environment. We sign the request ourselves
 * (sha1 of the sorted params + secret) and POST the file to Cloudinary's REST
 * endpoint — no SDK, no extra dependency.
 *
 * Bytes go straight from the admin's browser, through our route, to
 * Cloudinary. The binary is never stored on Vercel; only the resulting
 * secure_url + metadata is persisted to media_assets.
 */

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function readCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  return readCloudinaryConfig() !== null;
}

export interface CloudinaryUploadResult {
  secureUrl: string;
  width: number | null;
  height: number | null;
  bytes: number | null;
  format: string | null;
  resourceType: string;
}

/**
 * Sign params per Cloudinary spec: sort keys, join as k=v&k=v, append the
 * api_secret, sha1. `file`, `api_key`, `resource_type` are excluded.
 */
function sign(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export async function uploadToCloudinary(
  file: File,
  opts: { folder?: string } = {},
): Promise<CloudinaryUploadResult> {
  const cfg = readCloudinaryConfig();
  if (!cfg) throw new Error("cloudinary_not_configured");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = opts.folder ?? "xhenvolt";
  const signedParams: Record<string, string> = { timestamp, folder };
  const signature = sign(signedParams, cfg.apiSecret);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", cfg.apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cfg.cloudName}/auto/upload`,
    { method: "POST", body: form },
  );

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body?.error?.message) detail = body.error.message;
    } catch {
      /* ignore */
    }
    throw new Error(`cloudinary_upload_failed: ${detail}`);
  }

  const data = (await res.json()) as {
    secure_url: string;
    width?: number;
    height?: number;
    bytes?: number;
    format?: string;
    resource_type?: string;
  };

  return {
    secureUrl: data.secure_url,
    width: data.width ?? null,
    height: data.height ?? null,
    bytes: data.bytes ?? null,
    format: data.format ?? null,
    resourceType: data.resource_type ?? "image",
  };
}
