import type { Metadata } from "next";
import LocationAttendanceClient from "../attendance-system-kampala/LocationAttendanceClient";

const LOCATION = {
  city: "Wakiso",
  district: "Wakiso",
  region: "Central Uganda",
  schoolCount: "800+",
  description: "Uganda's most populous district surrounding Kampala",
  nearbyAreas: ["Entebbe", "Nansana", "Kira", "Makindye Sabagabo", "Ssabagabo"],
  schools: ["Entebbe Junior School", "Wakiso Parents School", "Kira Town College"],
};

export const metadata: Metadata = {
  title: "School Attendance System Wakiso | DRAIS for Wakiso Schools",
  description:
    "Biometric school attendance system for Wakiso District schools, Uganda. DRAIS automates attendance, sends parent SMS, and provides real-time reports for Wakiso and Entebbe area schools.",
  keywords: ["school attendance system Wakiso", "biometric attendance Wakiso", "school management Wakiso"],
  alternates: { canonical: "https://xhenvolt.com/attendance-system-wakiso" },
  openGraph: {
    title: "School Attendance System Wakiso | DRAIS Uganda",
    description: "Automate attendance in Wakiso schools. Biometric, SMS alerts, live data.",
    type: "website",
    locale: "en_UG",
    url: "https://xhenvolt.com/attendance-system-wakiso",
  },
};

export default function WakisoPage() {
  return <LocationAttendanceClient location={LOCATION} />;
}
