import type { Metadata } from "next";
import DraisAttendanceClient from "./DraisAttendanceClient";

export const metadata: Metadata = {
  title: "DRAIS Attendance System | School Management Platform by Xhenvolt Uganda",
  description:
    "DRAIS is Uganda's #1 school attendance and management system. Biometric tracking, automated reports, parent SMS alerts, fee management — built specifically for African schools.",
  keywords: [
    "DRAIS attendance system",
    "DRAIS school management",
    "DRAIS Uganda",
    "drais.pro",
    "school management system Uganda",
    "attendance system Uganda",
  ],
  openGraph: {
    title: "DRAIS — Uganda's #1 School Attendance & Management System",
    description: "DRAIS is the school operating system trusted by 35+ Ugandan institutions. Biometric attendance, SMS alerts, live dashboards.",
    type: "website",
    locale: "en_UG",
    siteName: "Xhenvolt Uganda",
    url: "https://xhenvolt.com/drais-attendance-system",
    images: [
      {
        url: "/images/drais-attendance-dashboard-uganda.png",
        width: 1200,
        height: 630,
        alt: "DRAIS school attendance and management system by Xhenvolt Uganda",
      },
    ],
  },
  alternates: {
    canonical: "https://xhenvolt.com/drais-attendance-system",
  },
};

export default function DraisAttendanceSystemPage() {
  return <DraisAttendanceClient />;
}
