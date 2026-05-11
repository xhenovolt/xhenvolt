"use client";
import React, { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Rocket,
  Globe,
  Users,
  School,
  Fingerprint,
  Star,
} from "lucide-react";

export interface MilestoneItem {
  title: string;
  description: string;
  label: string;
  icon: string;
  accentColor: string;
  events: string[];
  highlight: boolean;
}

const ICONS: Record<string, ReactNode> = {
  rocket: <Rocket className="w-5 h-5" />,
  school: <School className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  fingerprint: <Fingerprint className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
};

const FALLBACK_MILESTONES: MilestoneItem[] = [
  {
    title: "Foundation & First Clients",
    description:
      "Xhenvolt was founded in June 2025 with a mission to build real digital infrastructure for institutions.",
    label: "June 2025",
    icon: "rocket",
    accentColor: "#3b82f6",
    highlight: false,
    events: [
      "Company established — June 2025",
      "First DRAIS prototype developed",
      "Initial school partnerships formed",
    ],
  },
];

function TimelineItem({
  milestone,
  index,
  isLast,
}: {
  milestone: MilestoneItem;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const icon = ICONS[milestone.icon] ?? <Calendar className="w-5 h-5" />;

  return (
    <div ref={ref} className="relative">
      {!isLast && (
        <div className="absolute left-5 md:left-1/2 top-14 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 md:-translate-x-px" />
      )}

      <div
        className={`flex flex-col md:flex-row items-start gap-6 md:gap-12 ${
          index % 2 === 0 ? "" : "md:flex-row-reverse"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`flex-1 md:w-5/12 ml-14 md:ml-0 ${milestone.highlight ? "relative" : ""}`}
        >
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border ${
              milestone.highlight ? "border-2" : "border-gray-100 dark:border-gray-700"
            } hover:shadow-xl transition-shadow duration-300`}
            style={milestone.highlight ? { borderColor: milestone.accentColor + "66" } : {}}
          >
            {milestone.highlight && (
              <div
                className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold text-white rounded-full"
                style={{ backgroundColor: milestone.accentColor }}
              >
                Key Milestone
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 text-xs font-bold rounded-full text-white"
                style={{ backgroundColor: milestone.accentColor }}
              >
                {milestone.label}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {milestone.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {milestone.description}
            </p>
            {milestone.events.length > 0 && (
              <ul className="space-y-2">
                {milestone.events.map((event, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: milestone.accentColor }}
                    />
                    {event}
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-white dark:ring-gray-900"
            style={{ backgroundColor: milestone.accentColor }}
          >
            {icon}
          </div>
        </motion.div>

        <div className="hidden md:block flex-1 md:w-5/12" />
      </div>
    </div>
  );
}

export default function OurJourney({ milestones }: { milestones?: MilestoneItem[] }) {
  const list = milestones && milestones.length > 0 ? milestones : FALLBACK_MILESTONES;
  const sectionRef = useRef<HTMLElement | null>(null);
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
            From our first client in June 2025 to 37+ organizations — a timeline of growth, trust, and real impact.
          </p>
        </motion.div>

        <div className="relative space-y-12 md:space-y-16">
          {list.map((milestone, index) => (
            <TimelineItem
              key={`${milestone.title}-${index}`}
              milestone={milestone}
              index={index}
              isLast={index === list.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
