import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Xhenvolt Uganda | Book a Free DRAIS Demo",
  description:
    "Get in touch with Xhenvolt Uganda. Book a free demo of DRAIS school attendance system, request a software quote, or ask a question. Call 0741 341 483 or WhatsApp us.",
  keywords: [
    "contact Xhenvolt Uganda",
    "DRAIS demo Uganda",
    "book school software demo Uganda",
    "Xhenvolt phone number",
  ],
  alternates: { canonical: "https://xhenvolt.com/contact" },
  openGraph: {
    title: "Contact Xhenvolt Uganda | Book a Free DRAIS Demo",
    description:
      "Reach Xhenvolt Uganda by phone, WhatsApp, or email. Book a free DRAIS demo for your school today.",
    url: "https://xhenvolt.com/contact",
    type: "website",
  },
};

export default function Page() {
  return <ContactClient />;
}
