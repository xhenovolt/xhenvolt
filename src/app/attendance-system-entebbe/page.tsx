import type { Metadata } from "next";
import LocationAttendanceClient from "../attendance-system-kampala/LocationAttendanceClient";

const LOCATION = {
  city: "Entebbe",
  district: "Wakiso",
  region: "Central Uganda",
  schoolCount: "150+",
  description: "Uganda's international gateway city on Lake Victoria",
  nearbyAreas: ["Katabi", "Entebbe Municipality", "Bwebajja", "Kisubi", "Nkumba"],
  schools: ["St. Mary's College Kisubi", "Entebbe Secondary School", "Nkumba University Secondary"],
};

export const metadata: Metadata = {
  title: "School Attendance System Entebbe | DRAIS for Entebbe Schools",
  description:
    "Biometric school attendance system for schools in Entebbe, Uganda. DRAIS automates student attendance tracking with fingerprint scanners, SMS parent alerts, and live data dashboards.",
  keywords: ["school attendance system Entebbe", "biometric attendance Entebbe", "school management Entebbe"],
  alternates: { canonical: "https://xhenvolt.com/attendance-system-entebbe" },
  openGraph: {
    title: "School Attendance System Entebbe | DRAIS Uganda",
    description: "Automate attendance in Entebbe schools. Biometric attendance, SMS alerts, real-time data.",
    type: "website",
    locale: "en_UG",
    url: "https://xhenvolt.com/attendance-system-entebbe",
  },
};

export default function EntebbeePage() {
  return <LocationAttendanceClient location={LOCATION} />;
}
