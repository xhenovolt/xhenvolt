import type { Metadata } from "next";
import LocationAttendanceClient from "../attendance-system-kampala/LocationAttendanceClient";

const LOCATION = {
  city: "Mbale",
  district: "Mbale",
  region: "Eastern Uganda",
  schoolCount: "280+",
  description: "Eastern Uganda's commercial city at the foot of Mount Elgon",
  nearbyAreas: ["Sironko", "Manafwa", "Bududa", "Namisindwa", "Bulambuli"],
  schools: ["Mbale Secondary School", "Trinity College Nabbingo", "Bududu Mixed Secondary"],
};

export const metadata: Metadata = {
  title: "School Attendance System Mbale | DRAIS for Mbale Schools",
  description:
    "Biometric school attendance system for schools in Mbale and Eastern Uganda. DRAIS automates attendance with fingerprint scanners, real-time dashboards, and SMS parent notifications.",
  keywords: ["school attendance system Mbale", "biometric attendance Mbale", "school management Eastern Uganda"],
  alternates: { canonical: "https://xhenvolt.com/attendance-system-mbale" },
  openGraph: {
    title: "School Attendance System Mbale | DRAIS Uganda",
    description: "Automate attendance in Mbale schools. Fingerprint scanning, SMS alerts, live reports.",
    type: "website",
    locale: "en_UG",
    url: "https://xhenvolt.com/attendance-system-mbale",
  },
};

export default function MbalePage() {
  return <LocationAttendanceClient location={LOCATION} />;
}
