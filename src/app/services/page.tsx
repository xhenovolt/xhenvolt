import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Software Development Services Uganda | Xhenvolt",
  description:
    "Xhenvolt offers custom software development, mobile apps, POS systems, school management systems, and UI/UX design for Ugandan businesses and institutions.",
  keywords: [
    "software development Uganda",
    "custom software Uganda",
    "mobile app development Uganda",
    "school management software Uganda",
    "tech services Uganda",
  ],
  alternates: { canonical: "https://xhenvolt.com/services" },
  openGraph: {
    title: "Software Development Services Uganda | Xhenvolt",
    description:
      "Custom software, mobile apps, POS systems, and school management solutions from Uganda's leading tech company.",
    url: "https://xhenvolt.com/services",
    type: "website",
  },
};

export default function Page() {
  return <ServicesClient />;
}
