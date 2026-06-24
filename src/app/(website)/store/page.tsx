import { redirect } from "next/navigation";

/**
 * /store is a friendly alias for the Cosmos software release center.
 * Permanent redirect keeps a single canonical URL (/cosmos) for SEO.
 */
export default function StoreRedirect() {
  redirect("/cosmos");
}
