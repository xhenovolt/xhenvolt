"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Users,
  Monitor,
  CheckCircle2,
  BookOpen,
  Smartphone,
  MessageCircle,
  Sparkles,
} from "lucide-react";

/* ─── Training Journey Diagram ─── */
function TrainingJourneyDiagram() {
  return (
    <svg
      viewBox="0 0 800 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <rect width="800" height="360" rx="20" fill="url(#train-bg)" />

      {/* Phase 1 */}
      <rect x="40" y="50" width="170" height="130" rx="16" fill="#f59e0b" opacity="0.12" stroke="#f59e0b" strokeWidth="2" />
      <text x="125" y="82" textAnchor="middle" fill="#d97706" fontWeight="700" fontSize="13">Phase 1</text>
      <text x="125" y="100" textAnchor="middle" fill="#d97706" fontWeight="700" fontSize="13">On-Site Training</text>
      <text x="125" y="125" textAnchor="middle" fill="#64748b" fontSize="10">Hands-on with real device</text>
      <text x="125" y="142" textAnchor="middle" fill="#64748b" fontSize="10">Role-specific walkthroughs</text>
      <text x="125" y="159" textAnchor="middle" fill="#64748b" fontSize="10">Q&A with trainer</text>

      {/* Arrow */}
      <line x1="210" y1="115" x2="245" y2="115" stroke="#f59e0b" strokeWidth="2" />
      <polygon points="243,110 253,115 243,120" fill="#f59e0b" />

      {/* Phase 2 */}
      <rect x="255" y="50" width="170" height="130" rx="16" fill="#2563eb" opacity="0.12" stroke="#2563eb" strokeWidth="2" />
      <text x="340" y="82" textAnchor="middle" fill="#2563eb" fontWeight="700" fontSize="13">Phase 2</text>
      <text x="340" y="100" textAnchor="middle" fill="#2563eb" fontWeight="700" fontSize="13">Guided Practice</text>
      <text x="340" y="125" textAnchor="middle" fill="#64748b" fontSize="10">Staff use system live</text>
      <text x="340" y="142" textAnchor="middle" fill="#64748b" fontSize="10">Trainer shadows operations</text>
      <text x="340" y="159" textAnchor="middle" fill="#64748b" fontSize="10">Corrections in real-time</text>

      {/* Arrow */}
      <line x1="425" y1="115" x2="460" y2="115" stroke="#2563eb" strokeWidth="2" />
      <polygon points="458,110 468,115 458,120" fill="#2563eb" />

      {/* Phase 3 */}
      <rect x="470" y="50" width="170" height="130" rx="16" fill="#7c3aed" opacity="0.12" stroke="#7c3aed" strokeWidth="2" />
      <text x="555" y="82" textAnchor="middle" fill="#7c3aed" fontWeight="700" fontSize="13">Phase 3</text>
      <text x="555" y="100" textAnchor="middle" fill="#7c3aed" fontWeight="700" fontSize="13">Independent Use</text>
      <text x="555" y="125" textAnchor="middle" fill="#64748b" fontSize="10">Staff operate solo</text>
      <text x="555" y="142" textAnchor="middle" fill="#64748b" fontSize="10">WhatsApp support line</text>
      <text x="555" y="159" textAnchor="middle" fill="#64748b" fontSize="10">30-day check-in call</text>

      {/* Arrow */}
      <line x1="640" y1="115" x2="670" y2="115" stroke="#7c3aed" strokeWidth="2" />
      <polygon points="668,110 678,115 668,120" fill="#7c3aed" />

      {/* Mastery Badge */}
      <circle cx="720" cy="115" r="40" fill="#22c55e" opacity="0.12" stroke="#22c55e" strokeWidth="2" />
      <text x="720" y="110" textAnchor="middle" fill="#16a34a" fontWeight="700" fontSize="12">Staff</text>
      <text x="720" y="128" textAnchor="middle" fill="#16a34a" fontWeight="700" fontSize="12">Confident</text>

      {/* Bottom bar — simplicity note */}
      <rect x="100" y="230" width="600" height="90" rx="16" fill="#10b981" opacity="0.08" stroke="#10b981" strokeWidth="1.5" />
      <text x="400" y="262" textAnchor="middle" fill="#10b981" fontWeight="700" fontSize="14">Designed for Non-Technical Staff</text>
      <text x="400" y="285" textAnchor="middle" fill="#64748b" fontSize="11">Large buttons • Simple language • Step-by-step prompts • No coding or IT knowledge required</text>
      <text x="400" y="305" textAnchor="middle" fill="#64748b" fontSize="11">Average time to proficiency: 2 days</text>

      <defs>
        <linearGradient id="train-bg" x1="0" y1="0" x2="800" y2="360">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const trainingFeatures = [
  { icon: <Users className="w-6 h-6" />, title: "On-Site Hands-On Training", description: "Our team visits your school and trains every staff member in person. We tailor sessions to each role — admins, teachers, and IT staff get different walkthroughs." },
  { icon: <Sparkles className="w-6 h-6" />, title: "Built for Non-Tech Users", description: "DRAIS screens have large buttons, clear labels, and step-by-step wizards. If someone can use WhatsApp, they can use DRAIS." },
  { icon: <Monitor className="w-6 h-6" />, title: "Guided Practice Phase", description: "After initial training, we shadow your staff for 1-2 days as they use the system live — correcting mistakes in real-time so habits form correctly." },
  { icon: <BookOpen className="w-6 h-6" />, title: "Printed Quick-Reference Guides", description: "Every school receives laminated quick-reference cards with step-by-step instructions for common tasks like marking attendance and generating reports." },
  { icon: <MessageCircle className="w-6 h-6" />, title: "WhatsApp Support Line", description: "Staff can text our support team anytime for quick help. We typically reply within minutes during school hours." },
  { icon: <Smartphone className="w-6 h-6" />, title: "Video Tutorials Library", description: "Short, focused video walkthroughs for every DRAIS feature. Staff can revisit them anytime at their own pace." },
];

export default function TrainingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white rounded-full -top-40 -right-32" />
          <div className="absolute w-[300px] h-[300px] bg-orange-300 rounded-full bottom-0 left-0" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6">
          <Link href="/#objections" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to all questions
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            &ldquo;Will our staff actually be able to use it?&rdquo;
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-xl md:text-2xl text-white/85 max-w-3xl leading-relaxed">
            Yes — confidently. DRAIS is designed for non-technical users, and we provide thorough hands-on training until every staff member is comfortable.
          </motion.p>
        </div>
      </section>

      {/* Journey Diagram */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">The Training Journey</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
              Three phases take staff from first-time user to confident operator — typically within 2 days.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="dark:hidden">
              <TrainingJourneyDiagram />
            </div>
            <div className="hidden dark:block bg-gray-800 p-6">
              <TrainingJourneyDiagram />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-14 text-center">
            How We Get Your Staff Ready
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainingFeatures.map((feat, i) => (
              <motion.div key={feat.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplicity callout */}
      <section className="py-20 bg-amber-50 dark:bg-amber-950/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <GraduationCap className="w-16 h-16 mx-auto text-amber-600 dark:text-amber-400 mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">The Simplicity Promise</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              We design every screen with the assumption that the user has <strong>zero technical background</strong>. If it&apos;s confusing, it&apos;s our fault — and we fix it.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "2 days", label: "Avg. time to proficiency" },
                { value: "100%", label: "Staff trained on-site" },
                { value: "< 3 min", label: "WhatsApp reply time" },
                { value: "24/7", label: "Video tutorials access" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                  <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">{s.value}</div>
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
              &ldquo;I was worried my teachers wouldn&apos;t cope with another new system. But the Xhenvolt team trained everyone in one afternoon and stayed the whole next day to make sure it stuck. Now my staff love it.&rdquo;
            </p>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">— Wagogo Husama, Headteacher, Albayan Quran Memorization Center</div>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Ready to see how easy it is?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Schedule a demo and we&apos;ll walk your team through DRAIS in under 30 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-lg transition-colors">
              Book a Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/support" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Next: Ongoing Support <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
