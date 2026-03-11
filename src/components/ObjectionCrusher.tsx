"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Server,
  ShieldCheck,
  Fingerprint,
  GraduationCap,
  Headphones,
} from "lucide-react";

const objections = [
  {
    icon: <Server className="w-7 h-7" />,
    question: "What if the system goes down during school hours?",
    answer:
      "DRAIS runs on redundant infrastructure with 99.9% uptime. Offline failovers keep attendance recording even without internet.",
    href: "/reliability",
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "from-blue-50 to-cyan-50",
    bgDark: "dark:from-blue-950/40 dark:to-cyan-950/40",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    question: "Is student biometric data safe?",
    answer:
      "All biometric templates are encrypted at rest and in transit. We follow strict data-protection policies — raw fingerprints are never stored.",
    href: "/security",
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "from-emerald-50 to-teal-50",
    bgDark: "dark:from-emerald-950/40 dark:to-teal-950/40",
  },
  {
    icon: <Fingerprint className="w-7 h-7" />,
    question: "What if the fingerprint device stops working?",
    answer:
      "Manual fallback is built in, and we provide same-day replacement support. The system keeps syncing once hardware is restored.",
    href: "/device-integration",
    gradient: "from-purple-500 to-pink-500",
    bgLight: "from-purple-50 to-pink-50",
    bgDark: "dark:from-purple-950/40 dark:to-pink-950/40",
  },
  {
    icon: <GraduationCap className="w-7 h-7" />,
    question: "Will our staff actually be able to use it?",
    answer:
      "DRAIS is designed for non-technical users. We provide hands-on training and the interface is as simple as tapping a button.",
    href: "/training",
    gradient: "from-amber-500 to-orange-500",
    bgLight: "from-amber-50 to-orange-50",
    bgDark: "dark:from-amber-950/40 dark:to-orange-950/40",
  },
  {
    icon: <Headphones className="w-7 h-7" />,
    question: "What happens after deployment — are we on our own?",
    answer:
      "Never. Every DRAIS client gets dedicated ongoing support, remote diagnostics, and regular system updates at no extra cost.",
    href: "/support",
    gradient: "from-rose-500 to-red-500",
    bgLight: "from-rose-50 to-red-50",
    bgDark: "dark:from-rose-950/40 dark:to-red-950/40",
  },
];

export default function ObjectionCrusher() {
  return (
    <section className="py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 mb-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold tracking-wide uppercase">
            Honest Answers
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Questions Schools Ask <br className="hidden md:block" />
            Before Choosing DRAIS
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We&apos;ve heard every concern — here&apos;s how we&apos;ve solved them.
            Click any card to see the full technical answer.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objections.map((obj, index) => (
            <motion.div
              key={obj.href}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link href={obj.href} className="group block h-full">
                <div className={`relative h-full bg-gradient-to-br ${obj.bgLight} ${obj.bgDark} rounded-3xl p-8 border border-gray-200/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                  {/* Decorative accent */}
                  <div
                    className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${obj.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                  />

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${obj.gradient} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {obj.icon}
                  </div>

                  {/* Question */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    &ldquo;{obj.question}&rdquo;
                  </h3>

                  {/* Short Answer */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                    {obj.answer}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all duration-300">
                    Read Full Answer
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
