"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Fingerprint,
  Users,
  Globe,
  CreditCard,
  ArrowRight,
  Play,
  Pause,
} from "lucide-react";

const tourSlides = [
  {
    id: "drais",
    label: "DRAIS",
    tagline: "School Operating System",
    description:
      "Automate attendance, generate reports, manage students, and communicate with parents — all from one dashboard.",
    color: "#3b82f6",
    icon: <GraduationCap className="w-7 h-7" />,
    highlights: ["Biometric Attendance", "Auto Reports", "Parent Portal", "Multi-Campus"],
  },
  {
    id: "jeton",
    label: "Jeton",
    tagline: "Financial Management",
    description:
      "A robust financial management system designed for organizations that need to track transactions, manage accounts, and generate financial reports with precision.",
    color: "#8b5cf6",
    icon: <CreditCard className="w-7 h-7" />,
    highlights: ["Transaction Tracking", "Account Management", "Financial Reports", "Secure"],
    link: "https://jeton.xhenvolt.com",
  },
  {
    id: "websites",
    label: "Web Presence",
    tagline: "Institutional Websites",
    description:
      "Professional, high-performance websites that establish credibility and serve as 24/7 information hubs for parents and stakeholders.",
    color: "#06b6d4",
    icon: <Globe className="w-7 h-7" />,
    highlights: ["Mobile-First", "SEO Optimized", "CMS Built-in", "Fast & Secure"],
  },
  {
    id: "custom",
    label: "Custom Systems",
    tagline: "Tailored Software",
    description:
      "From NGO management to inventory systems — we build exactly what your organization needs with full training and support.",
    color: "#10b981",
    icon: <Users className="w-7 h-7" />,
    highlights: ["Full Customization", "API Integrations", "24/7 Support", "Cloud Hosting"],
  },
];

/* ── Animated SVG mockup per slide ── */
function SlideMockup({ slide, active }) {
  const bars = [62, 85, 73, 91, 68, 80, 95];

  return (
    <div className="relative w-full h-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-4">
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full max-w-[200px] mx-auto flex items-center px-2">
            <span className="text-[8px] text-gray-400 truncate">{slide.label.toLowerCase()}.xhenvolt.com</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: slide.color }}
          >
            {React.cloneElement(slide.icon, { className: "w-4 h-4" })}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{slide.label} Dashboard</div>
            <div className="text-[10px] text-gray-400">{slide.tagline}</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: "1,432", label: "Active" },
            { val: "96.4%", label: "Rate" },
            { val: "+12%", label: "Growth" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={active ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center p-2 rounded-xl"
              style={{ backgroundColor: `${slide.color}10` }}
            >
              <div className="text-sm font-bold" style={{ color: slide.color }}>{s.val}</div>
              <div className="text-[9px] text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Animated bar chart */}
        <div className="flex items-end gap-1 h-20 pt-2">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md"
              style={{ backgroundColor: `${slide.color}${i === bars.length - 1 ? "cc" : "66"}` }}
              initial={{ height: 0 }}
              animate={active ? { height: `${h}%` } : { height: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.06 }}
            />
          ))}
        </div>

        {/* Table rows */}
        <div className="space-y-1.5">
          {[1, 2, 3].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={active ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1 + i * 0.1 }}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="w-12 h-2 rounded-full" style={{ backgroundColor: `${slide.color}33` }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MiniProductTour() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => setCurrent((p) => (p + 1) % tourSlides.length), []);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [playing, next]);

  const slide = tourSlides[current];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            A Quick Tour of Our Systems
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See how Xhenvolt platforms look and feel — interactive previews of real dashboards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left: info + tabs */}
          <div>
            {/* Tab pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tourSlides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { setCurrent(i); setPlaying(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    i === current
                      ? "border-transparent text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                  }`}
                  style={i === current ? { backgroundColor: s.color } : {}}
                >
                  {React.cloneElement(s.icon, { className: "w-4 h-4" })}
                  {s.label}
                </button>
              ))}
            </div>

            {/* Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {slide.label}{" "}
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400">— {slide.tagline}</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {slide.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: slide.color }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg transition-shadow hover:shadow-xl"
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </motion.a>
              <button
                onClick={() => setPlaying((p) => !p)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {playing ? "Pause" : "Play"}
              </button>
            </div>
          </div>

          {/* Right: mockup */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                transition={{ duration: 0.4 }}
                className="aspect-[4/3]"
              >
                <SlideMockup slide={slide} active={true} />
              </motion.div>
            </AnimatePresence>

            {/* Shadow decoration */}
            <div
              className="absolute -inset-4 -z-10 rounded-3xl opacity-20 blur-2xl"
              style={{ backgroundColor: slide.color }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
