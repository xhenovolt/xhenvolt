import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";

/**
 * Editable wrapper.
 *
 * Today this is intentionally a no-op for visitors — it just renders its
 * children. For authenticated admins (later: when live-editing ships), it
 * will wrap the section with an overlay providing "edit this section"
 * affordances that link to /admin/sections/<sectionKey>.
 *
 * The wrapper is a server component so it can read the session cookie
 * without leaking auth state to public traffic. It never renders any
 * admin UI for unauthenticated visitors.
 */
export default async function Editable({
  sectionKey,
  children,
}: {
  sectionKey: string;
  children: ReactNode;
}) {
  const c = await cookies();
  const session = await verifySession(c.get(SESSION_COOKIE)?.value);

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div data-cms-section={sectionKey} data-cms-edit-href={`/admin/sections/${sectionKey}`}>
      {children}
    </div>
  );
}
