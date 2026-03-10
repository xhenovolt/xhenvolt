"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Fingerprint,
  Smartphone,
  BarChart3,
  Wifi,
  CheckCircle,
  Users,
  ArrowRight,
} from "lucide-react";

/* ── Animated SVG illustrations for each step ── */

function StudentArrivalSVG() {
  return (
    <div className="relative w-full h-64 md:h-80">
      <svg viewBox="0 0 400 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect width="400" height="280" rx="16" fill="currentColor" className="text-blue-50 dark:text-blue-950/30" />
        
        {/* School building silhouette */}
        <rect x="220" y="60" width="140" height="160" rx="8" fill="currentColor" className="text-blue-100 dark:text-blue-900/40" />
        <rect x="250" y="40" width="80" height="20" rx="4" fill="currentColor" className="text-blue-200 dark:text-blue-800/40" />
        <rect x="240" y="140" width="30" height="80" rx="4" fill="currentColor" className="text-blue-200 dark:text-blue-800/40" />
        <rect x="310" y="140" width="30" height="80" rx="4" fill="currentColor" className="text-blue-200 dark:text-blue-800/40" />

        {/* Biometric device */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <rect x="170" y="130" width="36" height="50" rx="6" fill="#3b82f6" />
          <rect x="174" y="134" width="28" height="32" rx="4" fill="#1e40af" />
          
          {/* Fingerprint scan glow */}
          <motion.circle
            cx="188"
            cy="150"
            r="10"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            initial={{ r: 4, opacity: 0 }}
            animate={{ r: [4, 14, 4], opacity: [0, 0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="188"
            cy="150"
            r="6"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="1.5"
            initial={{ r: 2, opacity: 0 }}
            animate={{ r: [2, 10, 2], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          
          {/* Fingerprint icon inside */}
          <motion.path
            d="M184 147 C184 144 186 142 188 142 C190 142 192 144 192 147 C192 150 190 152 188 153"
            stroke="#93c5fd"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>

        {/* Student figure walking toward device */}
        <motion.g
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Head */}
          <circle cx="120" cy="125" r="14" fill="#3b82f6" />
          <circle cx="120" cy="122" r="10" fill="#60a5fa" />
          {/* Body */}
          <rect x="112" y="139" width="16" height="40" rx="6" fill="#3b82f6" />
          {/* Arm reaching toward device */}
          <motion.line
            x1="128"
            y1="150"
            x2="165"
            y2="150"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ x2: 140 }}
            animate={{ x2: 165 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
          {/* Legs */}
          <line x1="116" y1="179" x2="112" y2="210" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
          <line x1="124" y1="179" x2="128" y2="210" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        </motion.g>
        
        {/* Checkmark animation */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
        >
          <circle cx="188" cy="110" r="12" fill="#22c55e" />
          <motion.path
            d="M182 110 L186 114 L194 106"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.8, duration: 0.4 }}
          />
        </motion.g>
      </svg>
    </div>
  );
}

function AttendanceCapturedSVG() {
  return (
    <div className="relative w-full h-64 md:h-80">
      <svg viewBox="0 0 400 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="280" rx="16" fill="currentColor" className="text-purple-50 dark:text-purple-950/30" />
        
        {/* Device on left */}
        <rect x="40" y="90" width="50" height="70" rx="8" fill="#8b5cf6" />
        <rect x="46" y="96" width="38" height="46" rx="4" fill="#6d28d9" />
        <motion.circle cx="65" cy="119" r="8" fill="#a78bfa"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Data packets moving to server */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.rect
            key={i}
            x="100"
            y={108 + i * 2}
            width="8"
            height="6"
            rx="2"
            fill="#8b5cf6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: [100, 170, 240], opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* WiFi signal lines */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {[1, 2, 3].map((i) => (
            <motion.path
              key={i}
              d={`M${150 + i * 8} ${130 - i * 10} Q${160 + i * 5} ${110 - i * 8} ${170 + i * 8} ${130 - i * 10}`}
              stroke="#8b5cf6"
              fill="none"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </motion.g>
        
        {/* DRAIS Server */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <rect x="260" y="70" width="100" height="130" rx="12" fill="#7c3aed" />
          <rect x="270" y="82" width="80" height="16" rx="4" fill="#6d28d9" />
          <rect x="270" y="104" width="80" height="16" rx="4" fill="#6d28d9" />
          <rect x="270" y="126" width="80" height="16" rx="4" fill="#6d28d9" />
          
          {/* Server lights */}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx="340"
              cy={90 + i * 22}
              r="4"
              fill="#22c55e"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          
          <text x="310" y="168" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">
            DRAIS
          </text>
        </motion.g>

        {/* Record saved indicator */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <rect x="260" y="210" width="100" height="28" rx="14" fill="#22c55e" />
          <text x="310" y="228" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" fontFamily="Arial, sans-serif">
            Record Saved
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

function ParentNotificationSVG() {
  return (
    <div className="relative w-full h-64 md:h-80">
      <svg viewBox="0 0 400 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="280" rx="16" fill="currentColor" className="text-green-50 dark:text-green-950/30" />
        
        {/* DRAIS Server sending notification */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <rect x="30" y="80" width="70" height="100" rx="10" fill="#7c3aed" />
          <text x="65" y="138" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Arial, sans-serif">DRAIS</text>
        </motion.g>
        
        {/* Notification pulses */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={140 + i * 50}
            cy="130"
            r="4"
            fill="#22c55e"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 1.5, delay: 0.5 + i * 0.3, repeat: Infinity }}
          />
        ))}
        
        {/* Smartphone */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <rect x="280" y="60" width="80" height="150" rx="12" fill="#1f2937" />
          <rect x="286" y="74" width="68" height="122" rx="4" fill="#f0fdf4" />
          
          {/* Notification on phone screen */}
          <motion.g
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
          >
            <rect x="292" y="82" width="56" height="50" rx="6" fill="#22c55e" />
            <text x="320" y="98" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">
              DRAIS
            </text>
            <text x="320" y="110" textAnchor="middle" fill="white" fontSize="6" fontFamily="Arial, sans-serif">
              Your child arrived
            </text>
            <text x="320" y="120" textAnchor="middle" fill="white" fontSize="6" fontFamily="Arial, sans-serif">
              at school at 7:42 AM
            </text>
          </motion.g>
          
          {/* Additional messages */}
          <rect x="292" y="140" width="56" height="18" rx="4" fill="#e5e7eb" />
          <rect x="292" y="162" width="56" height="18" rx="4" fill="#e5e7eb" />
          
          {/* Phone notch */}
          <rect x="305" y="63" width="30" height="6" rx="3" fill="#374151" />
        </motion.g>
        
        {/* Parent figure */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <circle cx="320" cy="240" r="10" fill="#10b981" />
          <text x="320" y="260" textAnchor="middle" fill="currentColor" className="text-gray-600 dark:text-gray-400" fontSize="9" fontFamily="Arial, sans-serif">
            Parent
          </text>
        </motion.g>

        {/* Smile indicator */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5, type: "spring" }}
        >
          <circle cx="260" cy="235" r="14" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="256" cy="232" r="1.5" fill="#92400e" />
          <circle cx="264" cy="232" r="1.5" fill="#92400e" />
          <path d="M255 238 Q260 243 265 238" stroke="#92400e" strokeWidth="1.5" fill="none" />
        </motion.g>
      </svg>
    </div>
  );
}

function SchoolDashboardSVG() {
  const bars = [
    { label: "Present", value: 87, color: "#22c55e" },
    { label: "Late", value: 8, color: "#f59e0b" },
    { label: "Absent", value: 5, color: "#ef4444" },
  ];

  return (
    <div className="relative w-full h-64 md:h-80">
      <svg viewBox="0 0 400 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="280" rx="16" fill="currentColor" className="text-cyan-50 dark:text-cyan-950/30" />
        
        {/* Browser chrome */}
        <rect x="30" y="20" width="340" height="240" rx="10" fill="white" className="dark:fill-gray-800" stroke="#e5e7eb" strokeWidth="1" />
        <rect x="30" y="20" width="340" height="30" rx="10" fill="#f3f4f6" className="dark:fill-gray-700" />
        <circle cx="48" cy="35" r="5" fill="#ef4444" />
        <circle cx="62" cy="35" r="5" fill="#f59e0b" />
        <circle cx="76" cy="35" r="5" fill="#22c55e" />
        <text x="200" y="39" textAnchor="middle" fill="#9ca3af" fontSize="8" fontFamily="Arial, sans-serif">
          drais.pro/dashboard
        </text>
        
        {/* Dashboard header */}
        <text x="50" y="72" fill="currentColor" className="text-gray-800 dark:text-gray-200" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">
          Attendance Overview
        </text>
        <text x="300" y="72" textAnchor="end" fill="#3b82f6" fontSize="9" fontFamily="Arial, sans-serif">
          Today, March 2026
        </text>
        
        {/* Metric cards */}
        {[
          { label: "Present Today", val: "87%", color: "#22c55e", x: 50 },
          { label: "Late", val: "8%", color: "#f59e0b", x: 160 },
          { label: "Absent", val: "5%", color: "#ef4444", x: 270 },
        ].map((m, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
          >
            <rect x={m.x} y="82" width="90" height="44" rx="8" fill={m.color + "15"} stroke={m.color + "40"} strokeWidth="1" />
            <text x={m.x + 45} y="103" textAnchor="middle" fill={m.color} fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif">
              {m.val}
            </text>
            <text x={m.x + 45} y="118" textAnchor="middle" fill="#6b7280" fontSize="7" fontFamily="Arial, sans-serif">
              {m.label}
            </text>
          </motion.g>
        ))}
        
        {/* Bar chart */}
        <text x="50" y="150" fill="currentColor" className="text-gray-700 dark:text-gray-300" fontSize="9" fontWeight="600" fontFamily="Arial, sans-serif">
          Weekly Trend
        </text>
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
          const x = 60 + i * 60;
          const heights = [70, 65, 75, 60, 72];
          return (
            <g key={day}>
              <motion.rect
                x={x}
                y={240 - heights[i]}
                width="30"
                height={heights[i]}
                rx="4"
                fill="#3b82f6"
                initial={{ height: 0, y: 240 }}
                animate={{ height: heights[i], y: 240 - heights[i] }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: "easeOut" }}
              />
              <text x={x + 15} y="252" textAnchor="middle" fill="#9ca3af" fontSize="7" fontFamily="Arial, sans-serif">
                {day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Steps data ── */
const draisSteps = [
  {
    step: 1,
    title: "Student Arrival",
    description: "A learner arrives and verifies attendance using a biometric device.",
    icon: <Fingerprint className="w-6 h-6" />,
    color: "blue",
    Illustration: StudentArrivalSVG,
  },
  {
    step: 2,
    title: "Attendance Captured",
    description: "DRAIS instantly records the attendance and syncs it to the cloud.",
    icon: <Wifi className="w-6 h-6" />,
    color: "purple",
    Illustration: AttendanceCapturedSVG,
  },
  {
    step: 3,
    title: "Parent Notification",
    description: "Parents immediately receive attendance updates on their phone.",
    icon: <Smartphone className="w-6 h-6" />,
    color: "green",
    Illustration: ParentNotificationSVG,
  },
  {
    step: 4,
    title: "School Dashboard",
    description: "School administrators monitor attendance patterns in real time.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "cyan",
    Illustration: SchoolDashboardSVG,
  },
];

const colorMap = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800", activeBg: "bg-blue-600", ring: "ring-blue-400" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", activeBg: "bg-purple-600", ring: "ring-purple-400" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-800", activeBg: "bg-green-600", ring: "ring-green-400" },
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-800", activeBg: "bg-cyan-600", ring: "ring-cyan-400" },
};

/* ── Step component ── */
function StoryStep({ step, index, isLast }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const c = colorMap[step.color];
  const Illustration = step.Illustration;

  return (
    <div ref={ref} className={`relative ${!isLast ? "pb-16" : ""}`}>
      {/* Connector line */}
      {!isLast && (
        <motion.div
          className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-purple-300 dark:from-blue-700 dark:to-purple-700"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ transformOrigin: "top" }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={index % 2 === 0 ? "" : "lg:order-2"}
        >
          <div className="flex items-start gap-4 mb-4">
            {/* Step number */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${c.activeBg} shadow-lg ring-4 ${c.ring}/20`}>
              {step.step}
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right: illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={index % 2 === 0 ? "" : "lg:order-1"}
        >
          {isInView && <Illustration />}
        </motion.div>
      </div>
    </div>
  );
}

export default function InteractiveProductStory() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section ref={sectionRef} className="py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50" id="product-story">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-6">
            <Fingerprint className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              How DRAIS Works
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            From Fingerprint to Dashboard in Seconds
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See exactly how DRAIS transforms school attendance — from the moment a student arrives to when a parent gets notified.
          </p>
        </motion.div>

        <div className="space-y-4">
          {draisSteps.map((step, index) => (
            <StoryStep
              key={step.step}
              step={step}
              index={index}
              isLast={index === draisSteps.length - 1}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="https://drais.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore DRAIS at drais.pro
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
