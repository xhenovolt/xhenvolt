import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Xhenvolt Uganda | Tech Company Building Digital Africa",
  description:
    "Xhenvolt is a Ugandan technology company founded in 2023. We build the DRAIS school management system, Jeton financial platform, and custom software for institutions across Uganda.",
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
      "Learn about Xhenvolt — the Ugandan tech company behind DRAIS school management system. Founded 2023, serving 35+ institutions across Uganda.",
    url: "https://xhenvolt.com/about",
    type: "website",
  },
};

export default function Page() {
  return <AboutClient />;
}
