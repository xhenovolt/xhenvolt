import type { Metadata } from "next";
import SchoolManagementClient from "./SchoolManagementClient";

export const metadata: Metadata = {
  title: "School Management System Uganda | DRAIS – Complete School ERP",
  description:
    "Uganda's best school management system. DRAIS handles attendance, student records, fees, reports, and parent communication. Trusted by 35+ institutions. Free demo for Ugandan schools.",
  keywords: [
    "school management system Uganda",
    "school ERP Uganda",
    "school administration software Uganda",
    "digital school solutions Uganda",
    "school information system Uganda",
  ],
  openGraph: {
    title: "School Management System Uganda | DRAIS by Xhenvolt",
    description:
      "Complete school management system for Ugandan schools. Attendance, records, fees, reports — all in one platform.",
    type: "website",
    locale: "en_UG",
    siteName: "Xhenvolt Uganda",
    url: "https://xhenvolt.com/school-management-system-uganda",
    images: [
      {
        url: "/images/drais-school-management-dashboard-uganda.png",
        width: 1200,
        height: 630,
        alt: "DRAIS school management system dashboard for Ugandan schools",
      },
    ],
  },
  alternates: {
    canonical: "https://xhenvolt.com/school-management-system-uganda",
  },
};

export default function SchoolManagementSystemUgandaPage() {
  return <SchoolManagementClient />;
}
