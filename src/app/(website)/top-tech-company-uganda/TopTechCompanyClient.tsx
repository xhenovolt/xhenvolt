"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, ArrowRight, Phone, Globe, Code2, GraduationCap, Smartphone, Award, Users, School } from "lucide-react";

const products = [
  {
    name: "DRAIS — School Management System",
    desc: "Uganda's #1 biometric attendance and school operating system. Trusted by 37+ institutions.",
    link: "/drais-attendance-system",
    linkText: "Learn About DRAIS",
    badge: "Flagship Product",
  },
  {
    name: "Custom Software Development",
    desc: "Enterprise systems, SACCOs, NGO management, custom ERPs built for African organizations.",
    link: "/services",
    linkText: "View Services",
    badge: null,
  },
  {
    name: "Website Development",
    desc: "Professional websites and web applications for schools, businesses, and institutions.",
    link: "/services",
    linkText: "View Services",
    badge: null,
  },
];

const stats = [
  { value: "37+", label: "Institutions Served" },
  { value: "June 2025", label: "Founded in Uganda" },
  { value: "5+", label: "Core Products" },
  { value: "100%", label: "Ugandan-Built Team" },
];

const companies = [
  { rank: 1, name: "Xhenvolt Uganda", focus: "School systems, custom software, digital infrastructure", standout: "DRAIS — biometric school attendance, built for Africa" },
  { rank: 2, name: "Andela Uganda", focus: "Tech talent & software outsourcing", standout: "Global remote developer marketplace" },
  { rank: 3, name: "Roke Telkom", focus: "ISP & telecommunications", standout: "Internet connectivity infrastructure" },
  { rank: 4, name: "SafeBoda", focus: "Ride-hailing & delivery", standout: "Consumer mobile app, Uganda-founded" },
  { rank: 5, name: "Numida", focus: "SME digital lending", standout: "Mobile financial services for small businesses" },
];

export default function TopTechCompanyClient() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Xhenvolt Uganda",
    url: "https://xhenvolt.com",
    logo: "https://xhenvolt.com/logo.png",
    description:
      "Xhenvolt Uganda is a leading technology company specializing in school management systems, biometric attendance, custom software development, and digital infrastructure for African institutions.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bulubandi",
      addressLocality: "Iganga",
      addressCountry: "UG",
    },
    telephone: "+256741341483",
    email: "drais@xhenvolt.com",
    foundingDate: "2025-06",
    areaServed: {
      "@type": "Country",
      name: "Uganda",
    },
    sameAs: ["https://drais.pro"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software Products & Services",
      itemListElement: [
        { "@type": "Offer", name: "DRAIS School Management System", url: "https://drais.pro" },
        { "@type": "Offer", name: "Custom Software Development" },
        { "@type": "Offer", name: "Website Development" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">

        <section className="pt-28 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  Technology Company — Kampala, Uganda
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                  Xhenvolt Uganda — Building Digital Infrastructure for{" "}
                  <span className="text-blue-600">African Institutions</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Founded in June 2025, Xhenvolt Uganda is a technology company dedicated to solving real
                  institutional problems — starting with Uganda&apos;s schools. Our flagship product
                  DRAIS is used by 37+ Ugandan institutions to automate attendance and school management.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/drais-attendance-system"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg"
                  >
                    See DRAIS Product
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 font-bold py-4 px-8 rounded-xl text-lg"
                  >
                    <Phone className="w-5 h-5" />
                    Contact Us
                  </Link>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s, i) => (
                    <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow text-center">
                      <div className="text-4xl font-extrabold text-blue-600 mb-2">{s.value}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                What Xhenvolt Uganda Builds
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
                >
                  {p.badge && (
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {p.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{p.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{p.desc}</p>
                  <Link href={p.link} className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">
                    {p.linkText} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Tech Companies List */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Top Tech Companies in Uganda (2026)
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Uganda&apos;s tech scene is growing rapidly. Here are the companies shaping it.
              </p>
            </motion.div>
            <div className="space-y-4">
              {companies.map((co, i) => (
                <motion.div
                  key={co.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-xl p-5 shadow flex items-start gap-4 ${co.rank === 1 ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500" : "bg-white dark:bg-gray-800"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold flex-shrink-0 ${co.rank === 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                    #{co.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{co.name}</h3>
                      {co.rank === 1 && <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Featured</span>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{co.focus}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{co.standout}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Xhenvolt */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                Why Xhenvolt Uganda is Different
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Most technology companies operating in Uganda are either foreign entities adapted for
                the market or small freelance operations without product depth. Xhenvolt Uganda sits
                at a distinct intersection: a product-focused company, building real software products
                (not just services), designed from scratch for African institutional contexts.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Our flagship DRAIS system is evidence of this. While generic school software exists,
                none is built with Uganda&apos;s specific infrastructure, curriculum, and affordability
                constraints in mind. DRAIS works offline, supports Uganda&apos;s three-term school
                calendar, integrates with affordable local SMS gateways, and is priced to match Ugandan
                school budgets.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Our team is entirely Ugandan. Our support line is Ugandan. Our understanding of the
                problems we solve is firsthand. This is not a company adapting a foreign product for
                Uganda — this is a company born in Uganda, solving Uganda&apos;s problems.
              </p>
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-300 font-semibold mb-4">
                  Explore what Xhenvolt Uganda builds:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/school-attendance-system-uganda" className="bg-white dark:bg-gray-800 text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 border border-blue-200">School Attendance System</Link>
                  <Link href="/biometric-attendance-uganda" className="bg-white dark:bg-gray-800 text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 border border-blue-200">Biometric Attendance</Link>
                  <Link href="/school-management-system-uganda" className="bg-white dark:bg-gray-800 text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 border border-blue-200">School Management System</Link>
                  <Link href="/drais-attendance-system" className="bg-white dark:bg-gray-800 text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 border border-blue-200">DRAIS Product</Link>
                  <Link href="/about" className="bg-white dark:bg-gray-800 text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 border border-blue-200">About Us</Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-4">Work with Uganda&apos;s Leading School Tech Company</h2>
              <p className="text-blue-100 mb-8">
                Whether you need a school management system, website, or custom software — Xhenvolt Uganda delivers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/256741341483"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-4 px-8 rounded-xl text-lg hover:bg-blue-50"
                >
                  WhatsApp Us
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/10"
                >
                  Contact Page
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}
