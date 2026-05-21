import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const BASE_URL = "https://xhenvolt.com";

/**
 * Root layout — intentionally minimal.
 *
 * It defines <html>/<body> and nothing else. Route-group layouts
 * (app/(website)/layout.tsx and app/admin/layout.tsx) are responsible for
 * the visual chrome of their respective areas. This is the App Router's
 * proper layout-isolation pattern: an /admin route never inherits a
 * <Navbar> or any other public element because no layout above it injects
 * them.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "Xhenvolt Uganda | Top Tech Company – School Management & Attendance Systems",
    template: "%s | Xhenvolt Uganda",
  },
  description:
    "Xhenvolt Uganda is a leading tech company building DRAIS — the #1 school attendance & management system in Uganda. Biometric attendance, automated reports, parent SMS alerts.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
