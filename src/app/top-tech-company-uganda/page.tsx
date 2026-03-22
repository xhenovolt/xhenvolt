import type { Metadata } from "next";
import TopTechCompanyClient from "./TopTechCompanyClient";

export const metadata: Metadata = {
  title: "Top Tech Company in Uganda | Xhenvolt Uganda – School Systems & Software",
  description:
    "Xhenvolt Uganda is one of the top technology companies in Uganda, specializing in school management systems (DRAIS), custom software, and digital solutions for African institutions.",
  keywords: [
    "top tech companies in Uganda",
    "best tech company Uganda",
    "technology companies Uganda",
    "software company Uganda",
    "IT company Uganda",
    "Xhenvolt Uganda",
  ],
  openGraph: {
    title: "Top Tech Company in Uganda | Xhenvolt Uganda",
    description: "Xhenvolt Uganda — building digital infrastructure for schools and institutions. Creators of DRAIS school management system.",
    type: "website",
    locale: "en_UG",
    siteName: "Xhenvolt Uganda",
    url: "https://xhenvolt.com/top-tech-company-uganda",
  },
  alternates: {
    canonical: "https://xhenvolt.com/top-tech-company-uganda",
  },
};

export default function TopTechCompanyUgandaPage() {
  return <TopTechCompanyClient />;
}
