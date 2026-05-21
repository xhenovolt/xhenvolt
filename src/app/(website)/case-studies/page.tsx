import type { Metadata } from "next";
import CaseStudiesClient from "./CaseStudiesClient";

export const metadata: Metadata = {
  title: "Case Studies | DRAIS School System Deployments in Uganda | Xhenvolt",
  description:
    "Real-world results from DRAIS deployments across Ugandan schools. See how Excel Islamic Schools, Northgate Schools, and Hillside Ways reduced absenteeism and streamlined administration.",
  keywords: [
    "DRAIS case study Uganda",
    "school management system case study",
    "Xhenvolt case studies",
    "school attendance Uganda results",
  ],
  alternates: { canonical: "https://xhenvolt.com/case-studies" },
  openGraph: {
    title: "Case Studies | DRAIS School System Deployments in Uganda",
    description:
      "How Ugandan schools improved attendance accuracy, parent communication, and administration efficiency with DRAIS by Xhenvolt.",
    url: "https://xhenvolt.com/case-studies",
    type: "website",
  },
};

export default function Page() {
  return <CaseStudiesClient />;
}
