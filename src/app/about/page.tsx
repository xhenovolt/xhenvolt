import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Xhenvolt Uganda | Tech Company Building Digital Africa",
  description:
    "Xhenvolt is a Ugandan technology company founded in June 2025. We build the DRAIS school management system, Jeton financial platform, and custom software for institutions across Uganda.",
  keywords: [
    "Xhenvolt Uganda",
    "tech company Uganda",
    "software company Iganga Uganda",
    "DRAIS school system Uganda",
    "Ugandan software developer",
  ],
  alternates: { canonical: "https://xhenvolt.com/about" },
  openGraph: {
    title: "About Xhenvolt Uganda | Tech Company Building Digital Africa",
    description:
      "Learn about Xhenvolt — the Ugandan tech company behind DRAIS school management system. Founded June 2025, serving 37+ institutions across Uganda.",
    url: "https://xhenvolt.com/about",
    type: "website",
  },
};

export default function Page() {
  return <AboutClient />;
}
