import type { Metadata } from "next";
import LocationAttendanceClient from "../attendance-system-kampala/LocationAttendanceClient";

const LOCATION = {
  city: "Jinja",
  district: "Jinja",
  region: "Eastern Uganda",
  schoolCount: "400+",
  description: "Uganda's industrial hub and 'Source of the Nile' city",
  nearbyAreas: ["Iganga", "Kamuli", "Bugiri", "Mayuge", "Kaliro"],
  schools: ["Jinja College", "Busoga College Mwiri", "Rock High School"],
};

export const metadata: Metadata = {
  title: "School Attendance System Jinja | DRAIS for Jinja Schools",
  description:
    "Biometric school attendance system for schools in Jinja, Eastern Uganda. DRAIS automates attendance tracking with fingerprint scanners, SMS parent alerts, and real-time reports.",
  keywords: ["school attendance system Jinja", "biometric attendance Jinja", "school management Jinja"],
  alternates: { canonical: "https://xhenvolt.com/attendance-system-jinja" },
  openGraph: {
    title: "School Attendance System Jinja | DRAIS Uganda",
    description: "Automate attendance in Jinja schools. Biometric scanning, SMS alerts, live dashboard.",
    type: "website",
    locale: "en_UG",
    url: "https://xhenvolt.com/attendance-system-jinja",
  },
};

export default function JinjaPage() {
  return <LocationAttendanceClient location={LOCATION} />;
}
