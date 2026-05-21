/**
 * Next.js instrumentation hook. Runs once at server startup, before any
 * route handler or middleware executes.
 *
 * We use it for one thing: force IPv4-first DNS resolution. Node's
 * default ("verbatim") picks IPv6 first when both AAAA and A records
 * exist. Neon hostnames have both, but on many networks (home ISPs,
 * containerized dev environments, Vercel build sandboxes) IPv6 routing
 * is broken or asymmetric — so the default produces silent ETIMEDOUT
 * after a long wait.
 *
 * Setting "ipv4first" matches what curl does by default and removes
 * the most common cause of "Probe threw or timed out" against Neon
 * from a clean dev setup.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    try {
      dns.setDefaultResultOrder("ipv4first");
    } catch {
      // Older Node versions; safe to ignore.
    }
  }
}
