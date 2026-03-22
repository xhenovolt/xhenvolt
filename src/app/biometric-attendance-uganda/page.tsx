import type { Metadata } from "next";
import BiometricAttendanceClient from "./BiometricAttendanceClient";

export const metadata: Metadata = {
  title: "Biometric Attendance System Uganda | Fingerprint School Tracking",
  description:
    "Install biometric fingerprint attendance in your Ugandan school. DRAIS connects fingerprint scanners to a live dashboard. Works offline. Trusted by 35+ schools. Free demo available.",
  keywords: [
    "biometric attendance system Uganda",
    "fingerprint attendance Uganda",
    "biometric school attendance Uganda",
    "biometric attendance Africa",
    "fingerprint attendance school Uganda",
  ],
  openGraph: {
    title: "Biometric Attendance System Uganda | DRAIS by Xhenvolt",
    description:
      "Fingerprint attendance for Ugandan schools. Impossible to fake, works offline, connects to live dashboard. Request free demo.",
    type: "website",
    locale: "en_UG",
    siteName: "Xhenvolt Uganda",
    url: "https://xhenvolt.com/biometric-attendance-uganda",
    images: [
      {
        url: "/images/uganda-school-biometric-attendance.jpg",
        width: 1200,
        height: 630,
        alt: "Biometric fingerprint attendance scanner installed at a Ugandan school",
      },
    ],
  },
  alternates: {
    canonical: "https://xhenvolt.com/biometric-attendance-uganda",
  },
};

export default function BiometricAttendanceUgandaPage() {
  return <BiometricAttendanceClient />;
}
