import type { Metadata } from "next";
import LocationAttendanceClient from "./LocationAttendanceClient";

const LOCATION = {
  city: "Kampala",
  district: "Kampala",
  region: "Central Uganda",
  schoolCount: "1,200+",
  description: "Uganda's capital and largest city",
  nearbyAreas: ["Kawempe", "Makindye", "Nakawa", "Lubaga", "Kampala Central"],
  schools: ["St. Mary's Kisubi", "Makerere College School", "Kyambogo College School"],
};

export const metadata: Metadata = {
  title: `School Attendance System Kampala | DRAIS for Kampala Schools`,
  description: `Biometric school attendance system for schools in Kampala, Uganda. DRAIS automates attendance tracking, sends parent SMS alerts, and provides real-time reports for Kampala schools.`,
  keywords: [
    "school attendance system Kampala",
    "biometric attendance Kampala",
    "school management system Kampala",
    "attendance tracking Kampala schools",
  ],
  alternates: {
    canonical: "https://xhenvolt.com/attendance-system-kampala",
  },
  openGraph: {
    title: "School Attendance System Kampala | DRAIS by Xhenvolt",
    description: "Automate attendance in your Kampala school. Biometric scanning, SMS alerts, live data.",
    type: "website",
    locale: "en_UG",
    url: "https://xhenvolt.com/attendance-system-kampala",
  },
};

export default function KampalaPage() {
  return <LocationAttendanceClient location={LOCATION} />;
}
