import type { Metadata } from "next";
import "./globals.css";
import IntelligentChatbot from "../components/IntelligentChatbot";

export const metadata: Metadata = {
  title: "Xhenvolt | Building Digital Infrastructure for Modern Institutions",
  description:
    "Xhenvolt builds powerful software systems that help schools, organizations, and institutions manage operations, automate workflows, and build strong digital presence. DRAIS is our flagship school operating system.",
  keywords: "DRAIS, school management system, digital infrastructure, education technology, Xhenvolt, Uganda, biometric attendance, school analytics, organizational software",
  authors: [{ name: "Xhenvolt" }],
  creator: "Xhenvolt",
  openGraph: {
    title: "Xhenvolt | Building Digital Infrastructure for Modern Institutions",
    description: "Powerful software systems for schools and organizations. DRAIS is our flagship platform.",
    type: "website",
    locale: "en_US",
    siteName: "Xhenvolt",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xhenvolt | Building Digital Infrastructure for Modern Institutions",
    description: "Powerful software systems for schools and organizations. DRAIS is our flagship platform.",
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
        </div>
      </body>
    </html>
  );
}
