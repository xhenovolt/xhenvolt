"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Phone, ArrowRight, MapPin, School, Fingerprint, MessageSquare, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Location {
  city: string;
  district: string;
  region: string;
  schoolCount: string;
  description: string;
  nearbyAreas: string[];
  schools: string[];
}

const features = [
  { icon: <Fingerprint className="w-6 h-6 text-blue-600" />, title: "Biometric Fingerprint Attendance", desc: "100% accurate — impossible to fake." },
  { icon: <MessageSquare className="w-6 h-6 text-green-600" />, title: "SMS Parent Alerts", desc: "Instant notification when students arrive or are absent." },
  { icon: <BarChart3 className="w-6 h-6 text-purple-600" />, title: "Real-Time Dashboard", desc: "Live attendance data accessible from any device." },
];

export default function LocationAttendanceClient({ location }: { location: Location }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: `How quickly can DRAIS be installed in a ${location.city} school?`,
      a: `For schools in ${location.city}, our team can typically complete installation within 1–3 days. We are familiar with the ${location.region} area and prioritize quick deployment for local schools.`,
    },
    {
      q: `Does DRAIS work for both primary and secondary schools in ${location.city}?`,
      a: `Yes. DRAIS serves both primary and secondary schools in ${location.city} and the broader ${location.district} district. We have successfully deployed in diverse school types across Uganda.`,
    },
    {
      q: `What is the cost of DRAIS for a school in ${location.city}?`,
      a: `Pricing is based on student enrollment and selected modules. Contact us for a specific quote for your ${location.city} school. We offer competitive rates and flexible payment plans aligned with school term cycles.`,
    },
    {
      q: `Do you have references from schools in ${location.city}?`,
      a: `Yes. We have deployed DRAIS in multiple schools across Uganda, including in ${location.region}. Contact us and we will connect you with school directors who can share their experience firsthand.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `DRAIS School Attendance System — ${location.city}`,
    description: `Biometric school attendance system serving schools in ${location.city}, Uganda.`,
    areaServed: {
      "@type": "City",
      name: location.city,
    },
    provider: {
      "@type": "Organization",
      name: "Xhenvolt Uganda",
      url: "https://xhenvolt.com",
      telephone: "+256741341483",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <Navbar />

        <section className="pt-28 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex items-center justify-center gap-2 mb-6 text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{location.region} · {location.district} District</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                School Attendance System in{" "}
                <span className="text-blue-600">{location.city}</span>, Uganda
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                DRAIS brings biometric attendance, real-time dashboards, and instant SMS parent alerts
                to schools in {location.city}. Join the growing number of {location.description} schools
                that have eliminated manual attendance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/256741341483?text=Hello!%20I%20have%20a%20school%20in%20${encodeURIComponent(location.city)}%20and%20want%20a%20DRAIS%20demo.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
                >
                  Book Free Demo in {location.city}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="tel:+256741341483"
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-blue-50"
                >
                  <Phone className="w-5 h-5" />
                  0741 341 483
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{f.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">{f.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                Serving Schools Across {location.city} and {location.district} District
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {location.city} is home to {location.schoolCount} registered schools ranging from
                nursery to tertiary level. As {location.description}, it represents one of Uganda&apos;s
                most competitive education markets. Schools in {location.city} face unique challenges:
                large enrollments, demanding parents, and high administrative workloads.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                DRAIS is deployed in schools across {location.nearbyAreas.join(", ")} and the
                surrounding areas. Our {location.city}-based support means fast response times when
                your school needs help.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  Why Schools in {location.city} Choose DRAIS
                </h3>
                <ul className="space-y-2">
                  {[
                    `Local support team from ${location.region}`,
                    `Works offline — essential for schools in all parts of ${location.city}`,
                    `Affordable pricing matched to Ugandan school fee structures`,
                    `Installation completed within 1–3 days without disrupting school`,
                    `Parents communicate by SMS — the primary channel in Uganda`,
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
              FAQs — Schools in {location.city}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50">
                    <span>{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t dark:border-gray-700">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other locations */}
        <section className="py-12 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
              DRAIS Available Across Uganda
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { city: "Kampala", href: "/attendance-system-kampala" },
                { city: "Wakiso", href: "/attendance-system-wakiso" },
                { city: "Jinja", href: "/attendance-system-jinja" },
                { city: "Mbarara", href: "/attendance-system-mbarara" },
                { city: "Gulu", href: "/attendance-system-gulu" },
                { city: "Mbale", href: "/attendance-system-mbale" },
                { city: "Entebbe", href: "/attendance-system-entebbe" },
              ].map((loc) => (
                <Link
                  key={loc.city}
                  href={loc.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${loc.city === location.city ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-blue-600 hover:bg-blue-50 border border-blue-200"}`}
                >
                  {loc.city}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-extrabold mb-4">
              Book a Free DRAIS Demo for Your {location.city} School
            </h2>
            <p className="text-blue-100 mb-8">
              We come to your school. Installation in 1–3 days. Zero disruption to teaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/256741341483?text=Hello!%20I%20want%20DRAIS%20for%20my%20school%20in%20${encodeURIComponent(location.city)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-4 px-8 rounded-xl text-lg hover:bg-blue-50"
              >
                WhatsApp for Demo
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link href="/school-attendance-system-uganda" className="flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/10">
                Full Details
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
