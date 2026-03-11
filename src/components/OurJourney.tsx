"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Rocket,
  Globe,
  Users,
  Building2,
  School,
  Fingerprint,
  ArrowRight,
} from "lucide-react";

const milestones = [
  {
    year: "2025",
    quarter: "June",
    title: "Foundation & First Clients",
    description:
      "Xhenvolt was founded with a mission to build real digital infrastructure for institutions. Our first clients included schools in need of modern management systems.",
    events: [
      "Company established",
      "First DRAIS prototype developed",
      "Initial school partnerships formed",
    ],
    icon: <Rocket className="w-5 h-5" />,
    color: "#3b82f6",
  },
  {
    year: "2025",
    quarter: "Jul–Aug",
    title: "DRAIS Launch & Early Adoption",
    description:
      "DRAIS was officially launched as our flagship school management system. Early adopters included Northgate Schools and Albayan Quran Memorization Center.",
    events: [
      "DRAIS v1.0 launched",
      "Northgate Schools onboarded — advanced reporting",
      "Albayan Center — customized program-based system",
      "Biometric attendance integration completed",
    ],
    icon: <School className="w-5 h-5" />,
    color: "#8b5cf6",
  },
  {
    year: "2025",
    quarter: "Sep–Oct",
    title: "Rapid Expansion",
    description:
      "Growing trust led to rapid expansion across multiple schools and organizations. We crossed 15 active clients and began building institutional websites alongside DRAIS.",
    events: [
      "Excel Islamic Schools adopted DRAIS",
      "Al Hanan Education Center deployment",
      "Multiple website projects commissioned",
      "Jeton financial system development started",
    ],
    icon: <Building2 className="w-5 h-5" />,
    color: "#06b6d4",
  },
  {
    year: "2025",
    quarter: "Nov–Dec",
    title: "Website Development Wave",
    description:
      "A surge in website development projects as organizations recognized the need for professional digital presence. Multiple institutional websites built and launched.",
    events: [
      "Seek and Give Charity Organization — website",
      "Unity Bridge Foundation — website",
      "Al Muntahha Online School — website",
      "Vision International Academy — website",
      "Excel Islamic Secondary School — website",
      "Walugogo Vocational Secondary School — website",
    ],
    icon: <Globe className="w-5 h-5" />,
    color: "#10b981",
  },
  {
    year: "2026",
    quarter: "Jan–Feb",
    title: "Major Installation Wave",
    description:
      "A landmark period — Xhenvolt deployed multiple attendance monitoring systems and completed several website projects simultaneously, reaching 29 DRAIS clients.",
    events: [
      "Ibun Baz Girls Secondary School — attendance system deployed",
      "Hillside Ways Secondary School — attendance system deployed",
      "Multiple website launches completed",
      "29 schools now running DRAIS",
    ],
    icon: <Fingerprint className="w-5 h-5" />,
    color: "#f59e0b",
    highlight: true,
  },
  {
    year: "2026",
    quarter: "Present",
    title: "35 Organizations & Growing",
    description:
      "Today, Xhenvolt serves 35 organizations — 29 schools running DRAIS and 6 organizations using other Xhenvolt solutions. The mission continues.",
    events: [
      "35 total organizations served",
      "29 schools running DRAIS",
      "6 organizations using websites & other systems",
      "Continuous feature development",
    ],
    icon: <Users className="w-5 h-5" />,
    color: "#ef4444",
    highlight: true,
  },
];

function TimelineItem({ milestone, index, isLast }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative">
      {/* Connector */}
      {!isLast && (
        <div className="absolute left-5 md:left-1/2 top-14 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 md:-translate-x-px" />
      )}

      <div className={`flex flex-col md:flex-row items-start gap-6 md:gap-12 ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
        {/* Content card */}
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`flex-1 md:w-5/12 ml-14 md:ml-0 ${milestone.highlight ? "relative" : ""}`}
        >
          <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border ${milestone.highlight ? "border-2" : "border-gray-100 dark:border-gray-700"} hover:shadow-xl transition-shadow duration-300`}
            style={milestone.highlight ? { borderColor: milestone.color + "66" } : {}}
          >
            {milestone.highlight && (
              <div className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold text-white rounded-full"
                style={{ backgroundColor: milestone.color }}
              >
                Key Milestone
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 text-xs font-bold rounded-full text-white"
                style={{ backgroundColor: milestone.color }}
              >
                {milestone.year} {milestone.quarter}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {milestone.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {milestone.description}
            </p>
            <ul className="space-y-2">
              {milestone.events.map((event, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: milestone.color }} />
                  {event}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Center dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-white dark:ring-gray-900"
            style={{ backgroundColor: milestone.color }}
          >
            {milestone.icon}
          </div>
        </motion.div>

        {/* Spacer for other side */}
        <div className="hidden md:block flex-1 md:w-5/12" />
      </div>
    </div>
  );
}

export default function OurJourney() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section ref={sectionRef} className="py-28 bg-white/50 dark:bg-gray-800/30">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/40 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              Our Journey
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Building History, One Deployment at a Time
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From our first prototype to 35 organizations — a timeline of growth, trust, and real impact.
          </p>
        </motion.div>

        <div className="relative space-y-12 md:space-y-16">
          {milestones.map((milestone, index) => (
            <TimelineItem
              key={index}
              milestone={milestone}
              index={index}
              isLast={index === milestones.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
