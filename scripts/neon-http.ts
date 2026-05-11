import { request as httpsRequest } from "node:https";
import { URL } from "node:url";

export interface NeonSqlResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
  fields: Array<{ name: string }>;
}

interface NeonOptions {
  arrayMode?: boolean;
  fullResults?: boolean;
}

export function neonClient(connectionString: string) {
  const u = new URL(connectionString);
  const endpoint = `https://${u.hostname}/sql`;

  async function exec<T = Record<string, unknown>>(
    query: string,
    params: unknown[] = [],
    opts: NeonOptions = {},
  ): Promise<NeonSqlResult<T>> {
    const body = JSON.stringify({ query, params });
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Neon-Connection-String": connectionString,
      "Neon-Raw-Text-Output": "false",
      "Neon-Array-Mode": opts.arrayMode ? "true" : "false",
    };

    const target = new URL(endpoint);

    return new Promise<NeonSqlResult<T>>((resolve, reject) => {
      const req = httpsRequest(
        {
          method: "POST",
          host: target.hostname,
          path: target.pathname,
          port: 443,
          family: 4,
          headers: {
            ...headers,
            "Content-Length": Buffer.byteLength(body).toString(),
          },
          timeout: 60_000,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const text = Buffer.concat(chunks).toString("utf8");
            if (res.statusCode && res.statusCode >= 400) {
              return reject(
                new Error(`neon http ${res.statusCode}: ${text.slice(0, 300)}`),
              );
            }
            try {
              const parsed = JSON.parse(text);
              resolve({
                rows: parsed.rows ?? [],
                rowCount: parsed.rowCount ?? (parsed.rows ?? []).length,
                fields: parsed.fields ?? [],
              });
            } catch (err) {
              reject(
                new Error(
                  `neon http: invalid JSON response: ${text.slice(0, 300)}`,
                ),
              );
            }
          });
        },
      );

      req.on("timeout", () => req.destroy(new Error("neon http timeout")));
      req.on("error", reject);
      req.write(body);
      req.end();
    });
  }

  return { exec };
}
