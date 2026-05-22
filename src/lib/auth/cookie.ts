/**
 * Cookie constants for the admin session.
 *
 * Kept separate from session.ts so that Edge middleware can import the
 * name without pulling in the mysql2 client (which is Node-only).
 */
export const SESSION_COOKIE = "xhv_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
