"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Fingerprint,
  Wifi,
  WifiOff,
  Shield,
  CheckCircle,
  Phone,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  Zap,
  Server,
  Star,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const howItWorks = [
  {
    step: "01",
    title: "Enrol Fingerprints Once",
    description:
      "Each student enrols their fingerprint once during setup — takes 30 seconds per student. The biometric template is stored securely on-device and in the DRAIS cloud.",
  },
  {
    step: "02",
    title: "Students Scan at Entry",
    description:
      "As students arrive at school, they place their finger on the scanner at the gate or classroom entrance. DRAIS records the time and marks them present instantly.",
  },
  {
    step: "03",
    title: "Dashboard Updates in Real-Time",
    description:
      "Head teachers see live attendance on their DRAIS dashboard — percentages per class, list of latecomers, and who is absent — all updated as scans happen.",
  },
  {
    step: "04",
    title: "Parents Get SMS Alerts",
    description:
      "If a student is not scanned by the designated time, their parent receives an automatic SMS: 'Your child [Name] has not arrived at school today. Please contact the school.'",
  },
];

const technicalSpecs = [
  { label: "Scanner Type", value: "Optical fingerprint scanner (ZKTeco compatible)" },
  { label: "Scan Speed", value: "Under 1.5 seconds per student" },
  { label: "Offline Capability", value: "Stores up to 30 days of records locally" },
  { label: "Sync Method", value: "Auto-syncs when internet is restored" },
  { label: "Power Backup", value: "Battery backup built into devices" },
  { label: "Capacity", value: "Up to 3,000 fingerprints per device" },
  { label: "Accuracy Rate", value: "99.97% — false rejection rate <0.03%" },
  { label: "Environmental Resistance", value: "Works in dusty/humid Ugandan climate conditions" },
];

const faqs = [
  {
    q: "Can a student cheat biometric attendance?",
    a: "No. Fingerprint biometrics are unique to each individual and cannot be replicated or transferred. Unlike paper registers where students sign for absent friends, biometric attendance is 100% tamper-proof. DRAIS additionally flags any unusual patterns (e.g., multiple failed scan attempts) for administrator review.",
  },
  {
    q: "What happens when there is no electricity or internet?",
    a: "DRAIS biometric devices have their own battery backup and store attendance records offline. When power and internet are restored, all records sync automatically to the cloud dashboard. Not a single attendance record is lost during outages.",
  },
  {
    q: "How many fingerprint scanners does a school need?",
    a: "This depends on your school layout. A single-gate school typically needs 1–2 scanners at the main entrance. Schools with classroom-level tracking need one scanner per class block. We assess your school during our free consultation and recommend the minimum hardware needed.",
  },
  {
    q: "What if a student's fingerprint is damaged or doesn't scan?",
    a: "DRAIS supports RFID card backup for students with fingerprint recognition issues (e.g., very young children, students with certain skin conditions). Administrators can also manually mark attendance in exceptional cases with an audit trail.",
  },
  {
    q: "Is biometric data of students legally safe to collect in Uganda?",
    a: "Yes. Biometric templates (not images) are collected with parent consent as part of school enrollment. DRAIS stores mathematical representations of fingerprints — not photos. Data is encrypted and stored in compliance with data protection best practices. Xhenvolt provides consent documentation templates for your school.",
  },
  {
    q: "Can biometric attendance work in primary schools with very young children?",
    a: "Yes, though young children (P1–P2) sometimes have small or less-defined fingerprints. For these classes, DRAIS recommends RFID wristbands or cards as a supplement. By P3 and above, fingerprint recognition works reliably for all students.",
  },
];

export default function BiometricAttendanceClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "DRAIS Biometric Attendance System",
        applicationCategory: "EducationApplication",
        description:
          "Biometric fingerprint attendance system for schools in Uganda and Africa. Works offline, syncs to real-time dashboard, sends parent SMS alerts.",
        provider: {
          "@type": "Organization",
          name: "Xhenvolt Uganda",
          url: "https://xhenvolt.com",
          telephone: "+256741341483",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                Biometric School Attendance — Uganda & Africa
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 max-w-4xl mx-auto">
                Biometric Fingerprint Attendance for{" "}
                <span className="text-indigo-600">Ugandan Schools</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Replace paper registers with fingerprint scanners. Works offline, sends real-time SMS to
                parents, and gives school directors a live dashboard — all in one system built for
                African schools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/256741341483?text=Hello!%20I%20want%20biometric%20attendance%20installed%20in%20my%20school."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
                >
                  Get Biometric Attendance
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="tel:+256741341483"
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold py-4 px-8 rounded-xl text-lg hover:bg-indigo-50"
                >
                  <Phone className="w-5 h-5" />
                  Call 0741 341 483
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {[
                  "Impossible to Fake",
                  "Works When Internet Is Down",
                  "Instant Parent SMS",
                  "2-Day Installation",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {b}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                How Biometric Attendance Works in Your School
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Offline capability highlight */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                  Designed for Uganda&apos;s Reality — Works Offline
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  We know Uganda. Power cuts happen. Internet drops. Other systems fail at these
                  moments — DRAIS doesn&apos;t. Our biometric devices are designed to operate
                  completely independently when infrastructure fails.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <WifiOff className="w-8 h-8 text-red-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-red-900 dark:text-red-300">Internet is down</div>
                      <div className="text-sm text-red-700 dark:text-red-400">DRAIS stores records locally — no data lost</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <Zap className="w-8 h-8 text-orange-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-orange-900 dark:text-orange-300">Power is cut</div>
                      <div className="text-sm text-orange-700 dark:text-orange-400">Battery backup keeps devices running</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <Wifi className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-green-900 dark:text-green-300">Power & internet restored</div>
                      <div className="text-sm text-green-700 dark:text-green-400">All records auto-sync to cloud instantly</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-6">Technical Specifications</h3>
                  <div className="space-y-3">
                    {technicalSpecs.map((spec) => (
                      <div key={spec.label} className="flex justify-between items-start gap-4 border-b border-white/10 pb-2">
                        <span className="text-indigo-200 text-sm">{spec.label}</span>
                        <span className="text-white text-sm font-medium text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Long-form content */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                How Biometric Attendance is Transforming African Schools
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Across Sub-Saharan Africa, school management is undergoing a digital revolution. While
                paper registers remain dominant in most Ugandan schools, a growing number of
                progressive institutions have made the switch to biometric attendance — and the results
                are transformative.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                In Kenya, Nigeria, Rwanda, and now Uganda, biometric attendance has moved from being a
                luxury for elite schools to an accessible tool for any school serious about
                accountability. DRAIS has democratised this technology for Ugandan schools of all sizes.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                Security Benefits Beyond Attendance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Biometric attendance does more than track who is present — it enhances overall school
                security. With DRAIS, school administrators know in real-time exactly how many students
                are on campus. In emergency situations (evacuation drills, lockdowns, medical incidents),
                this data is immediately available — no searching through paper registers.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Schools can also configure DRAIS to send alerts if a student exits the campus during
                school hours — catching truancy the moment it happens rather than discovering it days
                later.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                What Ugandan School Directors Say
              </h3>
              <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-r-xl mb-6">
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  &ldquo;Attendance tracking was our biggest challenge across multiple schools. With DRAIS
                  biometric integration, we now have 100% accurate records. Parents love the real-time
                  SMS updates and our administrative workload has dropped significantly.&rdquo;
                </p>
                <footer className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  — Sheikh Hassan Mwaita, Director, Excel Islamic Schools
                </footer>
              </blockquote>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                This is not an isolated experience. Across all 35+ schools using DRAIS, the two most
                consistent benefits reported are: (1) immediate reduction in time spent on
                administration, and (2) dramatically improved parent confidence in the school.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                Biometric Attendance FAQs
              </h2>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
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

        {/* CTA */}
        <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-4">
                Get Biometric Attendance in Your School This Week
              </h2>
              <p className="text-indigo-100 mb-8">
                Installation takes 1–2 days. We handle everything. Start tracking attendance
                accurately from day one.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/256741341483?text=I%20want%20biometric%20attendance%20installed%20in%20my%20school."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold py-4 px-8 rounded-xl text-lg hover:bg-indigo-50 transition-colors"
                >
                  WhatsApp Us Now
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  href="/school-attendance-system-uganda"
                  className="flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/10 transition-colors"
                >
                  Learn About DRAIS
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
