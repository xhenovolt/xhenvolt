import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import IntelligentChatbot from "@/components/IntelligentChatbot";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import WhatsAppCTAServer from "@/components/WhatsAppCTAServer";
import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/FooterServer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE_URL = "https://xhenvolt.com";

/**
 * Public website layout — applies to every route inside the (website)
 * route group: /, /about, /services, /testimonials, /contact, etc.
 *
 * It owns the Navbar, Footer, floating chatbot + WhatsApp CTA, the
 * gradient background, and the SEO metadata defaults. Admin pages (under
 * src/app/admin) live in a sibling layout and never see any of this.
 */
export const metadata: Metadata = {
  keywords: [
    "school attendance system Uganda",
    "biometric attendance system Uganda",
    "school management system Uganda",
    "DRAIS school system",
    "top tech companies in Uganda",
    "best tech company Uganda",
    "digital school solutions Uganda",
    "Xhenvolt Uganda",
  ],
  authors: [{ name: "Xhenvolt Uganda", url: BASE_URL }],
  creator: "Xhenvolt Uganda",
  publisher: "Xhenvolt Uganda",
  category: "Technology",
  classification: "Education Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title:
      "Xhenvolt Uganda | Top Tech Company – School Management & Attendance Systems",
    description:
      "Uganda's leading school management & biometric attendance system. DRAIS is trusted by 37+ institutions. Request your free demo.",
    type: "website",
    locale: "en_UG",
    alternateLocale: "en_US",
    siteName: "Xhenvolt Uganda",
    url: BASE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DRAIS school attendance system by Xhenvolt Uganda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xhenvolt Uganda | School Attendance & Management System",
    description:
      "Uganda's #1 school management & biometric attendance system. Trusted by 37+ institutions.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: BASE_URL },
};

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300 min-h-screen">
      <div className="min-h-screen relative overflow-x-hidden">
        <div className="fixed inset-0 opacity-20 dark:opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        <Suspense fallback={<Navbar />}>
          <NavbarServer />
        </Suspense>
        <div className="relative z-10">{children}</div>
        <Suspense fallback={<Footer />}>
          <FooterServer />
        </Suspense>
        <IntelligentChatbot />
        <Suspense fallback={<WhatsAppCTA />}>
          <WhatsAppCTAServer />
        </Suspense>
      </div>
    </div>
  );
}
