import type { Metadata } from "next";
import { Metadata as NextMetadata } from "next";
import SchoolAttendanceUgandaClient from "./SchoolAttendanceUgandaClient";

export const metadata: Metadata = {
  title: "School Attendance System Uganda | DRAIS by Xhenvolt",
  description:
    "The best school attendance system in Uganda. DRAIS tracks student attendance automatically with biometric devices, SMS alerts, and real-time reports. Trusted by 35+ Ugandan schools.",
  keywords: [
    "school attendance system Uganda",
    "attendance tracking Uganda schools",
    "automated attendance Uganda",
    "student attendance management Uganda",
    "school attendance software Uganda",
  ],
  openGraph: {
    title: "School Attendance System Uganda | DRAIS by Xhenvolt",
    description:
      "Automate student attendance in your Ugandan school. Real-time tracking, SMS parent alerts, biometric integration. Request a free demo.",
    type: "website",
    locale: "en_UG",
    siteName: "Xhenvolt Uganda",
    url: "https://xhenvolt.com/school-attendance-system-uganda",
    images: [
      {
        url: "/images/drais-attendance-dashboard-uganda.png",
        width: 1200,
        height: 630,
        alt: "DRAIS school attendance system dashboard used in Ugandan schools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best School Attendance System in Uganda | DRAIS",
    description:
      "Automate student attendance in your Ugandan school. Biometric + SMS + real-time reports.",
  },
  alternates: {
    canonical: "https://xhenvolt.com/school-attendance-system-uganda",
  },
};

export default function SchoolAttendanceUgandaPage() {
  return <SchoolAttendanceUgandaClient />;
}
