"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Clock,
  MessageCircle,
  Phone,
  RefreshCcw,
  Wrench,
  BarChart3,
  Zap,
} from "lucide-react";

/* ─── Support Ecosystem Diagram ─── */
function SupportEcosystemDiagram() {
  return (
    <svg
      viewBox="0 0 800 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <rect width="800" height="420" rx="20" fill="url(#sup-bg)" />

      {/* Center hub */}
      <circle cx="400" cy="190" r="65" fill="#e11d48" opacity="0.10" stroke="#e11d48" strokeWidth="2" />
      <text x="400" y="183" textAnchor="middle" fill="#e11d48" fontWeight="700" fontSize="14">Your</text>
      <text x="400" y="202" textAnchor="middle" fill="#e11d48" fontWeight="700" fontSize="14">School</text>

      {/* Spoke 1 — WhatsApp */}
      <line x1="335" y1="170" x2="195" y2="100" stroke="#22c55e" strokeWidth="2" />
      <rect x="80" y="60" width="150" height="80" rx="14" fill="#22c55e" opacity="0.10" stroke="#22c55e" strokeWidth="1.5" />
      <text x="155" y="92" textAnchor="middle" fill="#16a34a" fontWeight="700" fontSize="12">WhatsApp</text>
      <text x="155" y="112" textAnchor="middle" fill="#64748b" fontSize="10">Instant text support</text>
      <text x="155" y="128" textAnchor="middle" fill="#64748b" fontSize="10">&lt; 3 min reply</text>

      {/* Spoke 2 — Phone */}
      <line x1="400" y1="125" x2="400" y2="65" stroke="#2563eb" strokeWidth="2" />
      <rect x="325" y="15" width="150" height="55" rx="14" fill="#2563eb" opacity="0.10" stroke="#2563eb" strokeWidth="1.5" />
      <text x="400" y="40" textAnchor="middle" fill="#2563eb" fontWeight="700" fontSize="12">Phone Hotline</text>
      <text x="400" y="58" textAnchor="middle" fill="#64748b" fontSize="10">Direct call support</text>

      {/* Spoke 3 — Remote */}
      <line x1="465" y1="170" x2="605" y2="100" stroke="#7c3aed" strokeWidth="2" />
      <rect x="570" y="60" width="150" height="80" rx="14" fill="#7c3aed" opacity="0.10" stroke="#7c3aed" strokeWidth="1.5" />
      <text x="645" y="92" textAnchor="middle" fill="#7c3aed" fontWeight="700" fontSize="12">Remote Access</text>
      <text x="645" y="112" textAnchor="middle" fill="#64748b" fontSize="10">Screen sharing &</text>
      <text x="645" y="128" textAnchor="middle" fill="#64748b" fontSize="10">remote diagnostics</text>

      {/* Spoke 4 — On-Site */}
      <line x1="335" y1="215" x2="195" y2="290" stroke="#f59e0b" strokeWidth="2" />
      <rect x="80" y="260" width="150" height="80" rx="14" fill="#f59e0b" opacity="0.10" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="155" y="292" textAnchor="middle" fill="#d97706" fontWeight="700" fontSize="12">On-Site Visit</text>
      <text x="155" y="312" textAnchor="middle" fill="#64748b" fontSize="10">Physical support when</text>
      <text x="155" y="328" textAnchor="middle" fill="#64748b" fontSize="10">remote can&apos;t solve it</text>

      {/* Spoke 5 — Updates */}
      <line x1="465" y1="215" x2="605" y2="290" stroke="#0891b2" strokeWidth="2" />
      <rect x="570" y="260" width="150" height="80" rx="14" fill="#0891b2" opacity="0.10" stroke="#0891b2" strokeWidth="1.5" />
      <text x="645" y="292" textAnchor="middle" fill="#0891b2" fontWeight="700" fontSize="12">System Updates</text>
      <text x="645" y="312" textAnchor="middle" fill="#64748b" fontSize="10">Regular feature &amp;</text>
      <text x="645" y="328" textAnchor="middle" fill="#64748b" fontSize="10">security patches</text>

      {/* Bottom bar */}
      <rect x="175" y="370" width="450" height="35" rx="10" fill="#6366f1" opacity="0.08" stroke="#6366f1" strokeWidth="1" />
      <text x="400" y="393" textAnchor="middle" fill="#6366f1" fontWeight="700" fontSize="12">All included at NO extra cost</text>

      <defs>
        <linearGradient id="sup-bg" x1="0" y1="0" x2="800" y2="420">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const supportFeatures = [
  { icon: <MessageCircle className="w-6 h-6" />, title: "WhatsApp Support Line", description: "Text us about any issue — from minor questions to urgent problems. Average response time is under 3 minutes during school hours." },
  { icon: <Phone className="w-6 h-6" />, title: "Direct Phone Hotline", description: "When typing isn't enough, call our dedicated school support line for real-time troubleshooting with a Xhenvolt engineer." },
  { icon: <Zap className="w-6 h-6" />, title: "Remote Diagnostics", description: "With your permission, we can connect to the system remotely to diagnose and fix issues in real-time — often resolved in minutes." },
  { icon: <Wrench className="w-6 h-6" />, title: "On-Site Visits", description: "For hardware issues or complex situations, our team physically visits your school. No question of 'figuring it out yourselves'." },
  { icon: <RefreshCcw className="w-6 h-6" />, title: "Regular System Updates", description: "New features, security patches, and performance improvements are deployed regularly — always tested, always free." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Quarterly Health Checks", description: "Every 3 months we review your system's performance, usage patterns, and suggest optimizations to get more value." },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-rose-600 via-red-600 to-pink-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white rounded-full -top-40 -left-32" />
          <div className="absolute w-[350px] h-[350px] bg-rose-300 rounded-full bottom-0 right-0" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6">
          <Link href="/#objections" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to all questions
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            &ldquo;What happens after deployment — are we on our own?&rdquo;
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-xl md:text-2xl text-white/85 max-w-3xl leading-relaxed">
            Never. Every DRAIS school gets dedicated ongoing support — WhatsApp, phone, remote access, on-site visits, and regular updates. All included at no extra cost.
          </motion.p>
        </div>
      </section>

      {/* Ecosystem Diagram */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Your Support Ecosystem</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
              Multiple channels, one goal: your school never gets stuck.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="dark:hidden">
              <SupportEcosystemDiagram />
            </div>
            <div className="hidden dark:block bg-gray-800 p-6">
              <SupportEcosystemDiagram />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-14 text-center">
            What &ldquo;Ongoing Support&rdquo; Actually Means
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportFeatures.map((feat, i) => (
              <motion.div key={feat.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-5">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-rose-50 dark:bg-rose-950/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <Headphones className="w-16 h-16 mx-auto text-rose-600 dark:text-rose-400 mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">Support by the Numbers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { value: "< 3 min", label: "Avg. WhatsApp reply" },
                { value: "Same day", label: "On-site visit response" },
                { value: "0", label: "Extra support cost" },
                { value: "4x/year", label: "Health check reviews" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                  <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-1">{s.value}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <blockquote className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed mb-4">
              &ldquo;What sets Xhenvolt apart is the after-sales support. Other providers install and disappear. These guys still check in on us quarterly and fix issues the same day we report them. It&apos;s like having an in-house IT team.&rdquo;
            </p>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">— Ngobi Peter, General Director, Northgate Schools</div>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Ready to partner with a team that stays?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Get in touch and see what real post-deployment support looks like.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-lg transition-colors">
              Book a Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/#objections" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" /> View All Questions
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
