import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getSeoMetadata } from "@/lib/repositories";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/contact");
  if (!seo) {
    return {
      title: "Contact Xhenvolt Uganda | Book a Free DRAIS Demo",
      description:
        "Get in touch with Xhenvolt Uganda. Book a free demo of DRAIS school attendance system, request a software quote, or ask a question.",
      alternates: { canonical: "https://xhenvolt.com/contact" },
    };
  }
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ?? undefined,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      type: "website",
    },
  };
}

export default function Page() {
  return <ContactClient />;
}
