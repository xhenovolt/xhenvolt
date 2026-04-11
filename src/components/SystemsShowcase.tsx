"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  GraduationCap,
  Wallet,
  Wrench,
  Shield,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const systems = [
  {
    id: "drais",
    name: "DRAIS",
    tagline: "School Management & Attendance System",
    description:
      "End-to-end school operating system with biometric attendance, academic reporting, fee management, and multi-campus control — used by 31+ schools across Uganda.",
    icon: <GraduationCap className="w-5 h-5" />,
    color: "#3b82f6",
    gradient: "from-blue-600 to-indigo-600",
    url: "https://drais.pro",
    screenshots: [
      { src: "/systems/screenshots/drais-dark-dashboard.png", alt: "DRAIS dark dashboard overview" },
      { src: "/systems/screenshots/drais-dark-attendance.png", alt: "DRAIS attendance tracking view" },
      { src: "/systems/screenshots/drais-dark-dashboard-with-popup.png", alt: "DRAIS dashboard with action panel" },
      { src: "/systems/screenshots/drais-dashboard-with-popup-light.png", alt: "DRAIS light mode dashboard" },
      { src: "/systems/screenshots/drais-light-attendance.png", alt: "DRAIS attendance in light mode" },
    ],
  },
  {
    id: "jeton",
    name: "Jeton",
    tagline: "Financial Management Platform",
    description:
      "Comprehensive accounting and financial management system built for SMEs, NGOs, and institutions across East Africa — with invoicing, payroll, and real-time reporting.",
    icon: <Wallet className="w-5 h-5" />,
    color: "#10b981",
    gradient: "from-emerald-600 to-teal-600",
    url: null,
    screenshots: [
      { src: "/systems/screenshots/jeton-dark.png", alt: "Jeton dark mode dashboard" },
      { src: "/systems/screenshots/jeton-light.png", alt: "Jeton light mode interface" },
    ],
  },
  {
    id: "consty",
    name: "Consty",
    tagline: "Construction Project Management",
    description:
      "Purpose-built construction management platform for tracking projects, materials, labour, and budgets — designed for contractors, site engineers, and construction firms.",
    icon: <Wrench className="w-5 h-5" />,
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-500",
    url: null,
    screenshots: [
      { src: "/systems/screenshots/consty-dark-dashboard.png", alt: "Consty dark mode project dashboard" },
      { src: "/systems/screenshots/consty-main-light.png", alt: "Consty main interface in light mode" },
    ],
  },
  {
    id: "xhaira",
    name: "Xhaira",
    tagline: "Microfinance & SACCO Management",
    description:
      "Robust microfinance platform covering member management, loan cycles, savings tracking, group lending, and compliance — built for SACCOs and microfinance institutions.",
    icon: <Shield className="w-5 h-5" />,
    color: "#8b5cf6",
    gradient: "from-violet-600 to-purple-600",
    url: null,
    screenshots: [
      { src: "/systems/screenshots/Screenshot from 2026-04-11 16-33-22.png", alt: "Xhaira microfinance dashboard" },
      { src: "/systems/screenshots/Screenshot from 2026-04-11 16-33-22-1.png", alt: "Xhaira loan management interface" },
    ],
  },
];

function ScreenshotCarousel({ screenshots, systemName, color }: { screenshots: { src: string; alt: string }[]; systemName: string; color: string }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((p) => (p + 1) % screenshots.length), [screenshots.length]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + screenshots.length) % screenshots.length), [screenshots.length]);

  useEffect(() => {
    if (paused || screenshots.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next, screenshots.length]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gray-950 shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={screenshots[current].src}
            alt={screenshots[current].alt}
            width={900}
            height={560}
            className="w-full object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {screenshots.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: i === current ? color : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
            <motion.div
              className="h-full"
              style={{ backgroundColor: color }}
              initial={{ width: "0%" }}
              animate={{ width: paused ? undefined : "100%" }}
              transition={{ duration: 4, ease: "linear" }}
              key={`${current}-${paused}`}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function SystemsShowcase() {
  const [activeSystem, setActiveSystem] = useState(0);
  const system = systems[activeSystem];

  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-white/80">Our Product Suite</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Four Systems. One Vision.
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Purpose-built software for schools, financial institutions, construction firms, and SACCOs across Uganda and East Africa.
          </p>
        </motion.div>

        {/* System tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {systems.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => setActiveSystem(i)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                i === activeSystem
                  ? `bg-gradient-to-r ${s.gradient} text-white shadow-lg`
                  : "bg-white/10 text-gray-400 hover:bg-white/15 hover:text-white"
              }`}
            >
              {s.icon}
              {s.name}
            </motion.button>
          ))}
        </div>

        {/* Active system content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={system.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid lg:grid-cols-5 gap-8 items-start"
          >
            {/* Screenshots - takes 3/5 */}
            <div className="lg:col-span-3">
              <ScreenshotCarousel
                screenshots={system.screenshots}
                systemName={system.name}
                color={system.color}
              />
            </div>

            {/* Info - takes 2/5 */}
            <div className="lg:col-span-2 flex flex-col justify-center gap-6">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-3 text-white text-sm font-semibold"
                  style={{ backgroundColor: `${system.color}30`, border: `1px solid ${system.color}40` }}
                >
                  {system.icon}
                  {system.name}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{system.tagline}</h3>
                <p className="text-gray-400 leading-relaxed">{system.description}</p>
              </div>

              <div className="flex items-center gap-3">
                {system.url ? (
                  <a
                    href={system.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${system.gradient} text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300`}
                  >
                    Visit {system.name}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href="/contact"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${system.gradient} text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300`}
                  >
                    Request a Demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Screenshot counter */}
              <p className="text-xs text-gray-600">
                {system.screenshots.length} screenshot{system.screenshots.length > 1 ? "s" : ""} · Auto-advancing
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
