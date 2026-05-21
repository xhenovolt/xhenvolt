import type { Metadata } from "next";
import LocationAttendanceClient from "../attendance-system-kampala/LocationAttendanceClient";

const LOCATION = {
  city: "Gulu",
  district: "Gulu",
  region: "Northern Uganda",
  schoolCount: "300+",
  description: "Northern Uganda's largest city and regional centre",
  nearbyAreas: ["Amuru", "Nwoya", "Kitgum", "Pader", "Agago"],
  schools: ["Gulu High School", "Sacred Heart Girls School", "St Joseph College Layibi"],
};

export const metadata: Metadata = {
  title: "School Attendance System Gulu | DRAIS for Northern Uganda Schools",
  description:
    "Biometric school attendance system for schools in Gulu and Northern Uganda. DRAIS automates student attendance tracking with fingerprint scanners and SMS alerts.",
  keywords: ["school attendance system Gulu", "biometric attendance Gulu", "school management Northern Uganda"],
  alternates: { canonical: "https://xhenvolt.com/attendance-system-gulu" },
  openGraph: {
    title: "School Attendance System Gulu | DRAIS Uganda",
    description: "Automate attendance in Gulu schools. Biometric, SMS alerts, real-time data.",
    type: "website",
    locale: "en_UG",
    url: "https://xhenvolt.com/attendance-system-gulu",
  },
};

export default function GuluPage() {
  return <LocationAttendanceClient location={LOCATION} />;
}
