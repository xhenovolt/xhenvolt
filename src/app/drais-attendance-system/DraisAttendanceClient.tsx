"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Fingerprint, BarChart3, MessageSquare, Users, FileText,
  School, Phone, ArrowRight, CheckCircle, Star, Globe,
  ChevronDown, ChevronUp, Play, Shield, Zap,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const testimonials = [
  {
    name: "Sheikh Hassan Mwaita",
    role: "Director – Excel Islamic Schools & Principal – Ibun Baz Girls Secondary School",
    quote: "Attendance tracking was our biggest challenge across multiple schools. With DRAIS biometric integration, we now have 100% accurate records. Parents love the real-time SMS updates and our administrative workload has dropped significantly.",
    stars: 5,
  },
  {
    name: "Ngobi Peter",
    role: "General Director – Northgate Schools",
    quote: "DRAIS transformed how we manage our schools. The biometric attendance system eliminated falsified registers completely. Our parents are more engaged than ever because they receive real-time notifications.",
    stars: 5,
  },
  {
    name: "School Administration",
    role: "Hill Side Ways Nursery and Primary School",
    quote: "Since installing DRAIS, we've noticed a meaningful increase in student punctuality. Students know the system tracks exactly when they arrive. It has created a culture of accountability.",
    stars: 5,
  },
];

const keyBenefits = [
  { icon: <Fingerprint className="w-6 h-6" />, title: "Biometric-First", desc: "Fingerprint attendance at the core — not an add-on." },
  { icon: <Zap className="w-6 h-6" />, title: "Works Offline", desc: "Designed for Uganda's infrastructure reality." },
  { icon: <MessageSquare className="w-6 h-6" />, title: "Instant SMS", desc: "Parents notified the moment their child arrives or is absent." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Live Data", desc: "Real-time attendance percentages for directors." },
  { icon: <Globe className="w-6 h-6" />, title: "Multi-School", desc: "Manage entire education chains from one dashboard." },
  { icon: <Shield className="w-6 h-6" />, title: "Secure & Encrypted", desc: "Student data protected with enterprise-grade security." },
];

const pricingPlans = [
  {
    name: "Starter",
    desc: "Small schools up to 200 students",
    features: ["Biometric attendance", "Student records", "SMS alerts (100/month)", "Basic dashboard", "Email support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "School",
    desc: "Growing schools 200–800 students",
    features: ["Everything in Starter", "Grade & report management", "Fee tracking", "Unlimited SMS", "Priority support", "Staff attendance"],
    cta: "Most Popular",
    highlighted: true,
  },
  {
    name: "Institution",
    desc: "Large schools & multi-campus groups",
    features: ["Everything in School", "Multi-campus dashboard", "Custom integrations", "Ministry reports", "Dedicated account manager", "On-site training"],
    cta: "Contact Us",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Is DRAIS the same as drais.pro?",
    a: "Yes. DRAIS is hosted at drais.pro and is developed and maintained by Xhenvolt Uganda. Xhenvolt.com is the company website; drais.pro is the dedicated product website where schools can log in and access their DRAIS dashboard.",
  },
  {
    q: "How quickly can DRAIS be deployed in my school?",
    a: "A standard school is fully operational within 1–3 days. Day 1 is device installation and configuration. Day 2 is student fingerprint enrollment. Day 3 (if needed) is staff training and live testing. Most schools complete everything in 2 days.",
  },
  {
    q: "Does DRAIS provide training for teachers and administrators?",
    a: "Yes. Full on-site training is included in all plans. We train: (1) System administrators on full platform management, (2) Class teachers on daily attendance workflow, (3) Accountants on fee management, (4) Heads of department on reporting. Training typically takes 3–4 hours.",
  },
  {
    q: "What ongoing support does Xhenvolt provide?",
    a: "All DRAIS customers receive WhatsApp support (response within 2 business hours), a dedicated support line, and access to video tutorial documentation. Enterprise customers get a dedicated account manager. We maintain the system, deploy updates, and provide training for new staff at no extra charge.",
  },
  {
    q: "Can I see DRAIS working before I pay anything?",
    a: "Absolutely. We offer a free demo visit to your school. We'll bring the equipment, show you the system live, and answer every question your team has. There is zero obligation and zero cost for the demo. Contact us on WhatsApp to book.",
  },
];

export default function DraisAttendanceClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "DRAIS School Management System",
        description: "Uganda's #1 school attendance and management system. Biometric tracking, automated reports, parent SMS, and live dashboards built for African schools.",
        brand: {
          "@type": "Brand",
          name: "Xhenvolt Uganda",
        },
        url: "https://xhenvolt.com/drais-attendance-system",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "35",
          bestRating: "5",
        },
        review: testimonials.map((t) => ({
          "@type": "Review",
          author: { "@type": "Person", name: t.name },
          reviewBody: t.quote,
          reviewRating: { "@type": "Rating", ratingValue: t.stars },
        })),
        offers: {
          "@type": "Offer",
          priceCurrency: "UGX",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Xhenvolt Uganda",
            url: "https://xhenvolt.com",
          },
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
              <div className="flex items-center justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-500 ml-2">Trusted by 35+ Ugandan Schools</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DRAIS</span>
              </h1>
              <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Uganda&apos;s #1 School Attendance &amp; Management System
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                Biometric attendance. SMS parent alerts. Live dashboards. Automated reports.
                Built from scratch for African schools by Xhenvolt Uganda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/256741341483?text=Hello!%20I%20want%20a%20free%20DRAIS%20demo%20for%20my%20school."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
                >
                  Request Free Demo
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="https://drais.pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Visit drais.pro
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Why Schools Choose DRAIS
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keyBenefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex items-start gap-4"
                >
                  <div className="text-blue-600 mt-1 flex-shrink-0">{b.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{b.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                What Schools Say About DRAIS
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm italic leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="border-t dark:border-gray-700 pt-3">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Affordable Plans for Every Ugandan School
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Contact us for exact pricing. We are transparent and will quote based on your school size.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl p-6 shadow-lg ${plan.highlighted ? "bg-gradient-to-br from-blue-600 to-purple-700 text-white scale-105" : "bg-white dark:bg-gray-800"}`}
                >
                  <h3 className={`text-xl font-extrabold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.highlighted ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                    {plan.desc}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlighted ? "text-blue-100" : "text-gray-600 dark:text-gray-300"}`}>
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-green-300" : "text-green-500"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/256741341483?text=I%20want%20DRAIS%20pricing%20for%20my%20school."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center font-bold py-3 px-6 rounded-xl transition-colors ${plan.highlighted ? "bg-white text-blue-700 hover:bg-blue-50" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                  >
                    {plan.cta}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">DRAIS FAQs</h2>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50"
                  >
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

        {/* Internal links + Final CTA */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-4">
                Ready to Transform Your School with DRAIS?
              </h2>
              <p className="text-blue-100 mb-8">
                Free demo. No commitment. Our team comes to your school.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <a
                  href="https://wa.me/256741341483?text=I%20want%20a%20DRAIS%20demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-4 px-8 rounded-xl text-lg hover:bg-blue-50"
                >
                  Book Free Demo
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="tel:+256741341483"
                  className="flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/10"
                >
                  <Phone className="w-5 h-5" />
                  0741 341 483
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200">
                <Link href="/school-attendance-system-uganda" className="hover:text-white underline">School Attendance Uganda</Link>
                <span>·</span>
                <Link href="/biometric-attendance-uganda" className="hover:text-white underline">Biometric Attendance</Link>
                <span>·</span>
                <Link href="/school-management-system-uganda" className="hover:text-white underline">School Management System</Link>
                <span>·</span>
                <Link href="/top-tech-company-uganda" className="hover:text-white underline">Xhenvolt Uganda</Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
