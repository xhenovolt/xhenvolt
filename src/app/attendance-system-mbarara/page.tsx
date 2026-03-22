import type { Metadata } from "next";
import LocationAttendanceClient from "../attendance-system-kampala/LocationAttendanceClient";

const LOCATION = {
  city: "Mbarara",
  district: "Mbarara",
  region: "Western Uganda",
  schoolCount: "350+",
  description: "Uganda's fastest-growing city and Western Uganda hub",
  nearbyAreas: ["Bushenyi", "Ntungamo", "Kiruhura", "Isingiro", "Rwampara"],
  schools: ["Mbarara High School", "Ntare School", "Mbarara Parents School"],
};

export const metadata: Metadata = {
  title: "School Attendance System Mbarara | DRAIS for Mbarara Schools",
  description:
    "Biometric school attendance system for schools in Mbarara and Western Uganda. DRAIS automates attendance, sends SMS parent alerts, and provides real-time data for school directors.",
  keywords: ["school attendance system Mbarara", "biometric attendance Mbarara", "school management Mbarara"],
  alternates: { canonical: "https://xhenvolt.com/attendance-system-mbarara" },
  openGraph: {
    title: "School Attendance System Mbarara | DRAIS Uganda",
    description: "Automate attendance in Mbarara schools. Biometric scanning, SMS alerts, live dashboard.",
    type: "website",
    locale: "en_UG",
    url: "https://xhenvolt.com/attendance-system-mbarara",
  },
};

export default function MbararaPage() {
  return <LocationAttendanceClient location={LOCATION} />;
}
