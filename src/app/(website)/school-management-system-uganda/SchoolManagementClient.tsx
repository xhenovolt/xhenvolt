"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Fingerprint, FileText, BarChart3, Users, MessageSquare,
  GraduationCap, DollarSign, Calendar, Phone, ArrowRight,
  CheckCircle, ChevronDown, ChevronUp, School, Shield, Globe,
} from "lucide-react";

const modules = [
  {
    icon: <Fingerprint className="w-8 h-8 text-blue-600" />,
    title: "Biometric Attendance Tracking",
    description: "Fingerprint scanners at school gates or classrooms. 100% accurate, impossible to fake, works offline. Real-time data for directors.",
    badge: "Most Popular",
  },
  {
    icon: <Users className="w-8 h-8 text-purple-600" />,
    title: "Student Records Management",
    description: "Complete digital student profiles — admission details, academic history, health records, family contacts, photos. Searchable in seconds.",
    badge: null,
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-green-600" />,
    title: "Grades & Academic Reporting",
    description: "Enter marks once, generate report cards automatically. Supports Uganda curriculum grading systems for O-Level, A-Level, and primary.",
    badge: null,
  },
  {
    icon: <DollarSign className="w-8 h-8 text-yellow-600" />,
    title: "Fee Management",
    description: "Track fee payments per student per term. Generate balance statements automatically. Send SMS reminders for outstanding fees.",
    badge: "New",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-teal-600" />,
    title: "Parent Communication (SMS)",
    description: "Bulk and individual SMS to parents. Attendance alerts, fee reminders, exam results, school announcements — all automated.",
    badge: null,
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
    title: "Analytics & Reporting",
    description: "Attendance trends, fee collection reports, class performance analytics. Ministry-ready reports generated in one click.",
    badge: null,
  },
  {
    icon: <Calendar className="w-8 h-8 text-red-600" />,
    title: "School Calendar & Events",
    description: "Manage Uganda school terms, holidays, exam schedules, and parent meetings. Share calendars with parents via SMS.",
    badge: null,
  },
  {
    icon: <Shield className="w-8 h-8 text-gray-600" />,
    title: "Role-Based Access Control",
    description: "Directors, head teachers, teachers, accountants — each role sees only what they need. Full audit trails for all actions.",
    badge: null,
  },
];

const topSystems = [
  {
    rank: 1,
    name: "DRAIS by Xhenvolt Uganda",
    strengths: "Built in Uganda for Uganda. Biometric attendance, offline capability, affordable pricing, Ugandan support team, SMS integration.",
    weakness: "Feature rollout ongoing",
    verdict: "Best choice for Ugandan schools",
    recommended: true,
  },
  {
    rank: 2,
    name: "SchoolMaster (Kenya-based)",
    strengths: "Strong in East Africa, good feature set",
    weakness: "No offline mode, expensive, foreign support",
    verdict: "Good but not Uganda-optimized",
    recommended: false,
  },
  {
    rank: 3,
    name: "EMIS (Government System)",
    strengths: "Free, government-mandated",
    weakness: "No real-time features, slow rollout, minimal support",
    verdict: "Minimum compliance only",
    recommended: false,
  },
  {
    rank: 4,
    name: "Generic ERP Systems",
    strengths: "Feature-rich",
    weakness: "Not designed for schools, expensive customization, foreign teams",
    verdict: "Overkill and costly",
    recommended: false,
  },
];

const faqs = [
  {
    q: "What is a school management system and does my school need one?",
    a: "A school management system (SMS) is software that centralizes all school administration: student records, attendance, grades, fees, and communication. If your school manages more than 100 students and your administration relies on paper or Excel spreadsheets, you need one. The time and error costs of manual systems far exceed the cost of DRAIS.",
  },
  {
    q: "How is DRAIS different from a simple school website?",
    a: "A school website is public-facing marketing. DRAIS is an operational system for internal school management. DRAIS handles real-time attendance, student databases, fee tracking, grade management, and parent communication. These are backend functions that websites cannot do. Xhenvolt can provide both — a professional school website AND DRAIS for operations.",
  },
  {
    q: "Does DRAIS cover the Uganda national curriculum requirements?",
    a: "Yes. DRAIS is configured for Uganda's school calendar (three-term system), grading systems (PLE, UCE, UACE scales), and Ministry of Education reporting formats. We regularly update DRAIS based on Ministry of Education guidelines.",
  },
  {
    q: "Can teachers enter grades and attendance from their phones?",
    a: "Yes. DRAIS has a mobile-responsive web interface that teachers can use on any smartphone. Class teachers can take attendance, enter grades, and communicate with parents directly from their phone without needing a computer.",
  },
  {
    q: "How secure is student data in DRAIS?",
    a: "DRAIS uses encrypted data storage, secure HTTPS connections, and role-based access control. Only authorized users can access student data. All activity is logged with timestamps and user IDs. Data is backed up automatically — no risk of losing records due to hardware failure.",
  },
  {
    q: "What is the pricing model for DRAIS?",
    a: "DRAIS is priced per school, per term. We offer termly, annual, and multi-year plans. Pricing depends on student enrollment size and the modules selected. Contact us for a quote — we are transparent about pricing and offer payment options aligned with Ugandan school fee collection cycles.",
  },
];

export default function SchoolManagementClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "DRAIS School Management System",
        applicationCategory: "EducationApplication",
        description:
          "Complete school management system for Ugandan schools — attendance, grades, fees, communication, and analytics in one platform.",
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

        {/* Hero */}
        <section className="pt-28 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                Complete School ERP — Built for Uganda
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 max-w-4xl mx-auto">
                The Best{" "}
                <span className="text-green-600">School Management System</span>{" "}
                in Uganda
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                DRAIS is a complete school operating system — biometric attendance, student records,
                grades, fees, parent SMS, and analytics. One system that replaces every spreadsheet and
                paper register in your school.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/256741341483?text=Hello!%20I%20want%20to%20see%20DRAIS%20school%20management%20system%20for%20my%20school."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
                >
                  Request Free Demo
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="tel:+256741341483"
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-green-600 text-green-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-green-50"
                >
                  <Phone className="w-5 h-5" />
                  Call 0741 341 483
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {["31+ Schools Using DRAIS", "Uganda Curriculum Support", "Multi-School Ready", "Works Offline"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {b}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Everything Your School Needs — In One System
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                DRAIS modules work together so your data flows seamlessly throughout your school.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {modules.map((mod, i) => (
                <motion.div
                  key={mod.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow hover:shadow-md transition-shadow relative"
                >
                  {mod.badge && (
                    <span className="absolute top-3 right-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
                      {mod.badge}
                    </span>
                  )}
                  <div className="mb-3">{mod.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">{mod.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">{mod.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Systems Comparison */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Top School Management Systems in Uganda (2026)
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                An objective comparison of available options for Ugandan school administrators.
              </p>
            </motion.div>
            <div className="space-y-4">
              {topSystems.map((sys, i) => (
                <motion.div
                  key={sys.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-xl p-6 shadow ${sys.recommended ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500" : "bg-white dark:bg-gray-800"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${sys.recommended ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                      #{sys.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">{sys.name}</h3>
                        {sys.recommended && <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Recommended</span>}
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400 mb-1">✓ {sys.strengths}</p>
                      <p className="text-sm text-red-600 dark:text-red-400 mb-2">✗ {sys.weakness}</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{sys.verdict}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                Why Ugandan Schools Are Switching to Digital School Management
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                The Ugandan education sector is experiencing rapid growth. With over 50,000 registered
                schools and growing enrolment rates across primary and secondary, school administrators
                face increasing complexity in managing student data, parent communication, and compliance
                with Ministry of Education requirements.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Manual systems — paper registers, Excel spreadsheets, WhatsApp groups — served their
                purpose when schools were small. Today, a secondary school with 800 students cannot
                efficiently manage student records, track fee payments, communicate with 700 parents, and
                compile ministry reports using spreadsheets. The administrative burden overwhelms staff
                and leads to errors, delays, and failure to catch at-risk students early.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                What to Look for in a School Management System in Uganda
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                When evaluating school management systems for your Ugandan school, prioritize:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Offline capability — Uganda infrastructure isn't always reliable",
                  "Uganda curriculum support — three-term calendar, PLE/UCE/UACE grading",
                  "Local support team — no waiting for overseas support during school crises",
                  "Affordable and transparent pricing aligned with school fee cycles",
                  "Mobile-friendly — most teachers and parents use phones, not computers",
                  "SMS integration — WhatsApp and SMS are Uganda's primary communication channels",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                DRAIS meets all of these criteria. It was designed by a Ugandan team, deployed in
                Ugandan schools, and supported by staff who know the context of Ugandan education.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                School Management System FAQs
              </h2>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
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
        <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-teal-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-4">
                See DRAIS in Your School — Free Demo
              </h2>
              <p className="text-green-100 mb-8">
                We come to your school, understand your setup, and show you exactly how DRAIS works
                for your specific situation. Zero cost, zero commitment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/256741341483?text=I%20want%20to%20see%20DRAIS%20in%20my%20school."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-green-700 font-bold py-4 px-8 rounded-xl text-lg hover:bg-green-50 transition-colors"
                >
                  Book Free Demo on WhatsApp
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  href="/drais-attendance-system"
                  className="flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/10"
                >
                  Full DRAIS Product Details
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}
