import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Xhenvolt Solutions | DRAIS, Jeton, Consty, Xhaira & Custom Software Uganda",
  description:
    "Xhenvolt delivers DRAIS (school management), Jeton (financial platform), Consty (construction ERP), Xhaira (SACCO management), and custom digital solutions for institutions across Uganda.",
  keywords: [
    "school management system Uganda",
    "biometric attendance Uganda",
    "financial software Uganda",
    "microfinance SACCO system Uganda",
    "construction ERP Uganda",
    "custom software Uganda",
    "DRAIS",
    "Jeton",
    "Consty",
    "Xhaira",
  ],
  alternates: { canonical: "https://xhenvolt.com/services" },
  openGraph: {
    title: "Xhenvolt Solutions | DRAIS, Jeton, Consty, Xhaira & Custom Software",
    description:
      "DRAIS (schools), Jeton (finance), Consty (construction), Xhaira (SACCOs), and custom digital solutions from Uganda's leading tech company.",
    url: "https://xhenvolt.com/services",
    type: "website",
  },
};

export default function Page() {
  return <ServicesClient />;
}
