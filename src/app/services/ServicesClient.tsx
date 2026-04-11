"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const systems = [
  {
    name: "DRAIS",
    emoji: "🎓",
    color: "from-blue-600 to-indigo-600",
    badge: "31+ Schools Active",
    description:
      "Uganda's leading school management and biometric attendance system. Real-time tracking, academic reporting, multi-campus management, and parent engagement — built specifically for African schools.",
    highlights: [
      "Biometric fingerprint & face recognition attendance",
      "Automated academic reporting & transcripts",
      "Multi-campus admin from one dashboard",
      "Real-time SMS parent notifications",
      "Fee management & financial tracking",
    ],
    cta: { label: "Visit drais.pro", href: "https://drais.pro", external: true },
  },
  {
    name: "Jeton",
    emoji: "💳",
    color: "from-emerald-600 to-teal-600",
    badge: "Financial Platform",
    description:
      "Comprehensive financial management for SMEs, NGOs, and institutions. Handles accounting, payroll, invoicing, and real-time reporting — built for East Africa.",
    highlights: [
      "Invoicing, billing & payments",
      "Payroll & staff management",
      "Multi-currency & multi-branch support",
      "Real-time financial analytics",
      "Audit trail & compliance",
    ],
    cta: { label: "Request a Demo", href: "/contact", external: false },
  },
  {
    name: "Consty",
    emoji: "🏗️",
    color: "from-amber-500 to-orange-500",
    badge: "Construction ERP",
    description:
      "Purpose-built construction project management for contractors, engineers, and construction firms. Track sites, materials, budgets, and teams from a single platform.",
    highlights: [
      "Project & site progress tracking",
      "Material procurement & inventory",
      "Budget control & cost tracking",
      "Contractor & team management",
      "Daily progress reports",
    ],
    cta: { label: "Request a Demo", href: "/contact", external: false },
  },
  {
    name: "Xhaira",
    emoji: "🛡️",
    color: "from-violet-600 to-purple-600",
    badge: "SACCO & Microfinance",
    description:
      "Robust microfinance and SACCO management covering member registration, loan cycles, savings products, group lending, and compliance — built for institutions across Uganda.",
    highlights: [
      "Member & group registration",
      "Loan application & approval workflows",
      "Savings, deposits & withdrawals",
      "Mobile money integration",
      "Compliance reports & audit logs",
    ],
    cta: { label: "Request a Demo", href: "/contact", external: false },
  },
  {
    name: "Custom Solutions",
    emoji: "✨",
    color: "from-pink-500 to-rose-500",
    badge: "Tailored for You",
    description:
      "Websites, automations, and integrations built around your unique organizational needs. From institutional websites to full-stack custom platforms, we deliver on spec.",
    highlights: [
      "Institutional websites & web apps",
      "API development & system integrations",
      "Business process automation",
      "UI/UX design & brand identity",
      "Ongoing maintenance & support",
    ],
    cta: { label: "Request a Quote", href: "/contact", external: false },
  },
];

const proofPoints = [
  { stat: "31+", label: "Schools running DRAIS" },
  { stat: "37+", label: "Organizations served" },
  { stat: "4", label: "Flagship systems live" },
  { stat: "Jun 2025", label: "Founded in Uganda" },
];

export default function ServicesClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-6">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Built in Uganda · Deployed Across East Africa
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Digital Systems for Real Impact
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Xhenvolt builds and deploys flagship platforms for schools, financial institutions, construction firms, and SACCOs — not generic software, but purpose-built systems that actually work in Uganda.
            </p>
          </motion.div>

          {/* Proof bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {proofPoints.map((p, i) => (
              <div key={i} className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow">
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{p.stat}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{p.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Systems Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {systems.map((sys, i) => (
              <motion.div
                key={sys.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 flex flex-col gap-5 hover:shadow-3xl transition-all duration-500 group"
              >
                {/* Icon + badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sys.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {sys.emoji}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {sys.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${sys.color} text-white`}
                    >
                      {sys.badge}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{sys.description}</p>

                <ul className="space-y-2">
                  {sys.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <a
                    href={sys.cta.href}
                    target={sys.cta.external ? "_blank" : undefined}
                    rel={sys.cta.external ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${sys.color} text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300`}
                  >
                    {sys.cta.label}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Not sure where to start?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Talk to us about your institution's needs. We'll identify the right system or custom solution and walk you through it — free of charge.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Book a Free Consultation
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
