import type { Metadata } from "next";
import "./globals.css";
import IntelligentChatbot from "../components/IntelligentChatbot";
import WhatsAppCTA from "../components/WhatsAppCTA";

const BASE_URL = "https://xhenvolt.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Xhenvolt Uganda | Top Tech Company – School Management & Attendance Systems",
    template: "%s | Xhenvolt Uganda",
  },
  description:
    "Xhenvolt Uganda is a leading tech company building DRAIS – the #1 school attendance & management system in Uganda. Biometric attendance, automated reports, parent SMS alerts. Request a free demo today.",
  keywords: [
    "school attendance system Uganda",
    "biometric attendance system Uganda",
    "school management system Uganda",
    "DRAIS school system",
    "top tech companies in Uganda",
    "best tech company Uganda",
    "digital school solutions Uganda",
    "school ERP Uganda",
    "student attendance Africa",
    "attendance tracking system Uganda",
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
    title: "Xhenvolt Uganda | Top Tech Company – School Management & Attendance Systems",
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
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300">
        <div className="min-h-screen relative overflow-x-hidden">
          {/* Animated background elements */}
          <div className="fixed inset-0 opacity-20 dark:opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="relative z-10">
            {children}
          </div>
          <IntelligentChatbot />
          <WhatsAppCTA />
        </div>
      </body>
    </html>
  );
}
