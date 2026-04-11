"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Fingerprint,
  BarChart3,
  FileText,
  Building2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";

/* ── Slide data ── */
const slides = [
  {
    id: "attendance",
    title: "Attendance Dashboard",
    subtitle: "Real-time biometric tracking across all campuses",
    icon: <Fingerprint className="w-6 h-6" />,
    color: "#3b82f6",
    screenshot: "/systems/screenshots/drais-dark-attendance.png",
    screenshotAlt: "DRAIS attendance dashboard showing real-time biometric data",
  },
  {
    id: "biometric",
    title: "Biometric Integration",
    subtitle: "Fingerprint & face recognition for students and staff",
    icon: <Users className="w-6 h-6" />,
    color: "#8b5cf6",
    screenshot: "/systems/screenshots/drais-dark-dashboard.png",
    screenshotAlt: "DRAIS biometric system dashboard overview",
  },
  {
    id: "reporting",
    title: "Automated Reporting",
    subtitle: "Generate term reports, transcripts, and analytics instantly",
    icon: <FileText className="w-6 h-6" />,
    color: "#06b6d4",
    screenshot: "/systems/screenshots/drais-dashboard-with-popup-light.png",
    screenshotAlt: "DRAIS automated reporting and transcript generation",
  },
  {
    id: "multischool",
    title: "Multi-School Management",
    subtitle: "Manage multiple campuses from a single admin panel",
    icon: <Building2 className="w-6 h-6" />,
    color: "#10b981",
    screenshot: "/systems/screenshots/drais-dark-dashboard-with-popup.png",
    screenshotAlt: "DRAIS multi-school management dashboard with campus overview",
  },
  {
    id: "analytics",
    title: "School Analytics",
    subtitle: "Performance insights, trends, and data-driven decisions",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "#f59e0b",
    screenshot: "/systems/screenshots/drais-light-attendance.png",
    screenshotAlt: "DRAIS school analytics and performance dashboard",
  },
];

/* ── SVG Mockups for each slide ── */

function AttendanceMockup({ hovered }) {
  const rows = [
    { name: "Amina K.", time: "07:42 AM", status: "present" },
    { name: "Juma S.", time: "07:45 AM", status: "present" },
    { name: "Fatuma M.", time: "07:51 AM", status: "present" },
    { name: "Hassan B.", time: "—", status: "absent" },
    { name: "Sarah N.", time: "07:55 AM", status: "late" },
  ];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 2000);
    return () => clearInterval(t);
  }, []);
  const pct = 92 + (tick % 4);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Today — March 10, 2026</span>
        </div>
        <motion.div
          key={pct}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full"
        >
          {pct}% Present
        </motion.div>
      </div>
      {rows.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all duration-200 ${
            hovered ? "shadow-md" : ""
          } ${
            r.status === "present"
              ? "bg-green-50 dark:bg-green-900/20"
              : r.status === "late"
              ? "bg-amber-50 dark:bg-amber-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                r.status === "present"
                  ? "bg-green-500"
                  : r.status === "late"
                  ? "bg-amber-500"
                  : "bg-red-400"
              }`}
            >
              {r.name[0]}
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-200">{r.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">{r.time}</span>
            {r.status === "present" && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
            {r.status === "late" && <Clock className="w-3.5 h-3.5 text-amber-500" />}
            {r.status === "absent" && <span className="text-red-400 font-bold">✕</span>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BiometricMockup({ hovered }) {
  const [scanning, setScanning] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setScanning((p) => !p), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-4">
      <div className="relative w-28 h-28">
        {/* Fingerprint SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="fp-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#fp-grad)" strokeWidth="2" opacity="0.3" />
          {[18, 24, 30, 36, 42].map((r, i) => (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="url(#fp-grad)"
              strokeWidth="1.5"
              strokeDasharray={`${r * 1.2} ${r * 0.8}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: scanning ? 1 : 0.6 }}
              transition={{ duration: 1.2, delay: i * 0.1 }}
            />
          ))}
        </svg>
        {/* Scan line */}
        <motion.div
          className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          animate={{ top: scanning ? "15%" : "85%" }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      <motion.div
        key={scanning ? "s" : "d"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-xs font-semibold px-3 py-1 rounded-full ${
          scanning
            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
            : "bg-green-100 dark:bg-green-900/30 text-green-600"
        }`}
      >
        {scanning ? "Scanning..." : "✓ Verified — Amina K."}
      </motion.div>
      <p className="text-[10px] text-gray-400 dark:text-gray-500">Fingerprint + Face Recognition</p>
    </div>
  );
}

function ReportingMockup({ hovered }) {
  const subjects = [
    { name: "Mathematics", score: 87, grade: "A" },
    { name: "English", score: 78, grade: "B+" },
    { name: "Science", score: 92, grade: "A+" },
    { name: "Social Studies", score: 71, grade: "B" },
    { name: "Islamic Studies", score: 95, grade: "A+" },
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Term 1 Report — Amina K.</span>
        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full font-medium">Auto-Generated</span>
      </div>
      {subjects.map((s, i) => (
        <div key={s.name} className="flex items-center gap-3 text-xs">
          <span className="w-24 text-gray-600 dark:text-gray-300 truncate">{s.name}</span>
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${s.score}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          </div>
          <span className="w-6 text-right font-bold text-gray-700 dark:text-gray-200">{s.score}</span>
          <span className={`w-6 text-center font-bold ${s.score >= 90 ? "text-green-600" : s.score >= 75 ? "text-blue-600" : "text-amber-600"}`}>
            {s.grade}
          </span>
        </div>
      ))}
      <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-[10px] text-green-700 dark:text-green-300 text-center font-medium">
        Average: 84.6% — Position: 3/45
      </div>
    </div>
  );
}

function MultiSchoolMockup({ hovered }) {
  const schools = [
    { name: "Main Campus", students: 432, attendance: "96%", color: "blue" },
    { name: "North Branch", students: 287, attendance: "94%", color: "purple" },
    { name: "East Campus", students: 198, attendance: "97%", color: "cyan" },
  ];
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Connected Campuses</div>
      {schools.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          whileHover={{ scale: 1.02 }}
          className={`p-3 rounded-xl border transition-all duration-200 ${
            hovered ? "shadow-md" : ""
          } bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-${s.color}-500`} />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{s.name}</span>
            </div>
            <span className="text-[10px] text-green-600 font-bold">{s.attendance}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
            <Users className="w-3 h-3" />
            <span>{s.students} students</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AnalyticsMockup({ hovered }) {
  const bars = [65, 78, 82, 71, 90, 85, 92];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Weekly Performance</span>
        <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-600 px-2 py-0.5 rounded-full font-medium">This Week</span>
      </div>
      <div className="flex items-end justify-between gap-1.5 h-28 px-1">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-t-lg bg-gradient-to-t from-amber-400 to-amber-300 dark:from-amber-600 dark:to-amber-400"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ scaleY: 1.05 }}
            />
            <span className="text-[9px] text-gray-400 dark:text-gray-500">{days[i]}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="text-center p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm font-bold text-blue-600">80.4%</div>
          <div className="text-[9px] text-gray-500">Avg Score</div>
        </div>
        <div className="text-center p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-sm font-bold text-green-600">+5.2%</div>
          <div className="text-[9px] text-gray-500">Growth</div>
        </div>
        <div className="text-center p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-sm font-bold text-purple-600">1,432</div>
          <div className="text-[9px] text-gray-500">Students</div>
        </div>
      </div>
    </div>
  );
}

const mockups = {
  attendance: AttendanceMockup,
  biometric: BiometricMockup,
  reporting: ReportingMockup,
  multischool: MultiSchoolMockup,
  analytics: AnalyticsMockup,
};

/* ── Main component ── */

export default function DraisMicroDemo() {
  const [current, setCurrent] = useState(0);
  const [hoveredSlide, setHoveredSlide] = useState(false);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-4">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">See DRAIS in Action</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Micro-Demo: DRAIS Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore interactive previews of the key capabilities that make DRAIS the leading school operating system.
          </p>
        </motion.div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slide indicator pills */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  i === current
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.title.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Main card */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header bar */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${slide.color}15, ${slide.color}08)` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: slide.color }}
                >
                  {slide.icon}
                </div>
                <div>
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={slide.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="font-bold text-gray-900 dark:text-white"
                    >
                      {slide.title}
                    </motion.h3>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={slide.subtitle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      {slide.subtitle}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
              </div>
            </div>

            {/* Screenshot panel */}
            <div
              className="relative overflow-hidden min-h-[320px] bg-gray-950"
              onMouseEnter={() => setHoveredSlide(true)}
              onMouseLeave={() => setHoveredSlide(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <Image
                    src={slide.screenshot}
                    alt={slide.screenshotAlt}
                    width={900}
                    height={560}
                    className="w-full object-cover"
                    priority={current === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100 dark:bg-gray-700">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: slide.color }}
                initial={{ width: "0%" }}
                animate={{ width: paused ? undefined : "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                key={`${current}-${paused}`}
              />
            </div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Book a DRAIS Demo
            <BarChart3 className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
