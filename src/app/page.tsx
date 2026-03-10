"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Building2,
  Globe,
  Fingerprint,
  FileText,
  BarChart3,
  Users,
  School,
  Phone,
  Mail,
  Star,
  Monitor,
  Wifi,
  Layout,
  TrendingUp,
  Shield,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────── DATA ─────────────── */

const focusAreas = [
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Education Systems",
    description:
      "We build modern school operating systems that automate attendance, reporting, grading, and parent communication — making institutions run smarter.",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Organizational Software",
    description:
      "Custom platforms for NGOs, SACCOs, and enterprises that streamline operations, data management, and decision-making across teams.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Digital Presence Infrastructure",
    description:
      "Professional websites, web applications, and digital tools that give institutions a commanding online presence and credibility.",
  },
];

const draisFeatures = [
  { icon: <Fingerprint className="w-6 h-6" />, title: "Biometric Attendance Integration" },
  { icon: <FileText className="w-6 h-6" />, title: "Automated Reporting" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "School Analytics" },
  { icon: <Users className="w-6 h-6" />, title: "Parent Communication" },
  { icon: <School className="w-6 h-6" />, title: "Multi-School Architecture" },
];

const testimonials = [
  {
    name: "Ngobi Peter",
    position: "General Director",
    institution: "Northgate Schools",
    quote:
      "We needed a fully customizable report system that matched our curriculum. DRAIS delivered exactly that — and more. Our operations have never been smoother.",
    logo: "northgateschool.png",
  },
  {
    name: "Wagogo Husama",
    position: "Headteacher",
    institution: "Albayan Quran Memorization Center",
    quote:
      "Our programs are structured specifically for Quran memorization. DRAIS was customized perfectly to fit our unique educational model and tracking needs.",
    logo: "albayan.png",
  },
  {
    name: "Sheikh Hassan Mwaita",
    position: "Director",
    institution: "Excel Islamic Nursery and Primary School",
    quote:
      "The school system customization we received from Xhenvolt was remarkable. Every feature was tailored to how our school actually operates day to day.",
    logo: null,
  },
  {
    name: "Sheikh Hassan Mwaita",
    position: "Principal",
    institution: "Ibun Baz Girls Secondary School",
    quote:
      "Attendance tracking was our biggest challenge. With DRAIS biometric integration, we now have 100% accurate records and parents love the real-time updates.",
    logo: null,
  },
  {
    name: "Mr. Mwondha Hassan",
    position: "Administrator",
    institution: "School Operations",
    quote:
      "The attendance and operational systems from Xhenvolt have transformed how we manage daily school activities. Everything is automated and reliable.",
    logo: null,
  },
];

const organizations = [
  {
    name: "Almuntahha Online School",
    contact: "Abdul Fattaha Makubugu",
    role: "Client",
    logo: null,
  },
  {
    name: "Vision International Academy",
    contact: "Okurut Sylver",
    role: "Head Teacher",
    logo: null,
  },
  {
    name: "Excel Islamic School",
    contact: null,
    role: null,
    logo: null,
  },
  {
    name: "Walugogo Vocational Secondary School",
    contact: "Hon. Rachel Magoola",
    role: "Led by",
    logo: null,
  },
  {
    name: "Seek and Give Charity Organization",
    contact: null,
    role: null,
    logo: null,
  },
  {
    name: "Al Hanan Education Center",
    contact: "Sheikh Faisal Naminya",
    role: "Client",
    logo: null,
  },
];

const featureBlocks = [
  {
    title: "Digital Attendance for Schools",
    description:
      "Biometric and digital attendance systems that eliminate manual registers, reduce errors, and give real-time visibility into student presence across all campuses.",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    title: "Online Learning Infrastructure",
    description:
      "Complete digital learning platforms that enable schools to deliver curriculum online, manage assignments, and track student progress from anywhere.",
    gradient: "from-purple-600 to-pink-500",
  },
  {
    title: "Professional Institutional Websites",
    description:
      "Custom-built, mobile-first websites that establish credibility, showcase programs, and provide parents with essential school information 24/7.",
    gradient: "from-emerald-600 to-teal-500",
  },
];

const trustMetrics = [
  { value: "10+", label: "Schools Using DRAIS", icon: <School className="w-8 h-8" /> },
  { value: "15+", label: "Organizations Served", icon: <Building2 className="w-8 h-8" /> },
  { value: "25+", label: "Systems Deployed", icon: <Monitor className="w-8 h-8" /> },
  { value: "99.9%", label: "System Uptime", icon: <TrendingUp className="w-8 h-8" /> },
];

/* ─────────────── HELPERS ─────────────── */

function getInitials(name) {
  return name
    .split(" ")
    .filter((w) => w.length > 2 || name.split(" ").length <= 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ClientLogo({ name, filename, size = 56 }) {
  const [hasImage, setHasImage] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!filename) {
      setChecked(true);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      setHasImage(true);
      setChecked(true);
    };
    img.onerror = () => {
      setHasImage(false);
      setChecked(true);
    };
    img.src = `/client_logos/${filename}`;
  }, [filename]);

  if (!checked)
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
      />
    );

  if (hasImage && filename) {
    return (
      <Image
        src={`/client_logos/${filename}`}
        alt={name}
        width={size}
        height={size}
        className="rounded-xl object-cover"
      />
    );
  }

  // SVG placeholder with initials
  const initials = getInitials(name);
  const colors = [
    ["#3b82f6", "#1d4ed8"],
    ["#8b5cf6", "#6d28d9"],
    ["#06b6d4", "#0891b2"],
    ["#10b981", "#059669"],
    ["#f59e0b", "#d97706"],
    ["#ef4444", "#dc2626"],
  ];
  const colorIdx = name.length % colors.length;
  const [bgFrom, bgTo] = colors[colorIdx];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      className="rounded-xl flex-shrink-0"
    >
      <defs>
        <linearGradient
          id={`grad-${name.replace(/\s/g, "")}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor={bgFrom} />
          <stop offset="100%" stopColor={bgTo} />
        </linearGradient>
      </defs>
      <rect
        width="56"
        height="56"
        rx="12"
        fill={`url(#grad-${name.replace(/\s/g, "")})`}
      />
      <text
        x="28"
        y="30"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="18"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

/* ─────────────── PAGE ─────────────── */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Navbar />

      {/* ═══════ SECTION 1 — HERO ═══════ */}
      <section className="pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-6">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Trusted by 15+ Institutions
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Building Digital
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Infrastructure for
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Modern Institutions
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-xl">
                Xhenvolt develops powerful software systems that help schools,
                organizations, and institutions manage operations, automate
                processes, and build strong digital presence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="#drais"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                  >
                    Explore DRAIS
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="#organizations"
                    className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    View Our Work
                  </a>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 dark:border-gray-700/50">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {trustMetrics.map((m, i) => (
                    <div
                      key={i}
                      className="bg-white/80 dark:bg-gray-800/60 p-4 rounded-2xl text-center shadow-sm"
                    >
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {m.value}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-1">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="text-gray-600 dark:text-gray-300 ml-2 text-sm">
                    Trusted by real institutions
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic text-sm">
                  &quot;Xhenvolt built us a system that actually works for how
                  our school operates.&quot;
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  — Ngobi Peter, General Director, Northgate Schools
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 2 — WHAT XHENVOLT BUILDS ═══════ */}
      <section className="py-24 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              What Xhenvolt Builds
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We focus on three pillars that help institutions modernize, scale,
              and lead with technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {focusAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-white/20 dark:border-gray-700/50 text-center hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                  {area.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {area.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 3 — FLAGSHIP PRODUCT (DRAIS) ═══════ */}
      <section
        id="drais"
        className="py-28 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 relative overflow-hidden"
      >
        {/* decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
              <Award className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">
                Flagship Platform
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Our Flagship Platform — DRAIS
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              DRAIS is a modern operating system for schools designed to automate
              attendance, reporting, and school operations — built for
              institutions that want to lead.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Features */}
            <div className="space-y-6">
              {draisFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-5 bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <span className="text-white text-lg font-semibold">
                    {feature.title}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      DRAIS Dashboard
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Today&apos;s Attendance
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        96.4%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reports Generated
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        248
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Active Students
                      </span>
                      <span className="text-sm font-bold text-cyan-600">
                        1,432
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Parent Messages
                      </span>
                      <span className="text-sm font-bold text-amber-600">
                        89 new
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="h-16 bg-gradient-to-t from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-500 rounded-lg" />
                      <div className="h-20 bg-gradient-to-t from-purple-200 to-purple-400 dark:from-purple-800 dark:to-purple-500 rounded-lg" />
                      <div className="h-14 bg-gradient-to-t from-cyan-200 to-cyan-400 dark:from-cyan-800 dark:to-cyan-500 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 4 — SCHOOL TESTIMONIALS ═══════ */}
      <section className="py-28 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              What Schools Say About DRAIS
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real feedback from real institutions that trust Xhenvolt with
              their operations every single day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                {/* Quote */}
                <div className="flex-1">
                  <div className="text-4xl text-blue-600 dark:text-blue-400 mb-4 leading-none">
                    &ldquo;
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                    {t.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <ClientLogo
                    name={t.institution}
                    filename={t.logo}
                    size={48}
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {t.name}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      {t.position}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t.institution}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 5 — ORGANIZATIONS POWERED BY XHENVOLT ═══════ */}
      <section id="organizations" className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Organizations Powered by Xhenvolt
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From schools to charities — institutions across Uganda rely on our
              systems every day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizations.map((org, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-500 flex items-center gap-5"
              >
                <ClientLogo name={org.name} filename={org.logo} size={56} />
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg">
                    {org.name}
                  </div>
                  {org.contact && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {org.role ? `${org.role}: ` : ""}
                      {org.contact}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 6 — VISUAL FEATURE BLOCKS (Screenshot-worthy) ═══════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {featureBlocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`bg-gradient-to-r ${block.gradient} rounded-3xl p-12 md:p-16 text-white relative overflow-hidden shadow-2xl`}
            >
              {/* decorative */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />

              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  {index === 0 && <Fingerprint className="w-8 h-8" />}
                  {index === 1 && <Wifi className="w-8 h-8" />}
                  {index === 2 && <Layout className="w-8 h-8" />}
                </div>
                <h3 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                  {block.title}
                </h3>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  {block.description}
                </p>
                <div className="mt-8">
                  <a
                    href="#drais"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/20"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ SECTION 7 — TRUST METRICS ═══════ */}
      <section className="py-24 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real metrics from real deployments across Ugandan institutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 200,
                }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {metric.icon}
                </div>
                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {metric.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 8 — CONTACT & BRAND ═══════ */}
      <section className="py-28 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Ready to Build Your Digital Infrastructure?
              </h2>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Join the growing list of institutions that trust Xhenvolt to
                power their operations. Let&apos;s talk about what we can build
                for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                  >
                    Get Free Consultation <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="#drais"
                    className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Explore DRAIS
                  </a>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 space-y-6">
                <div className="text-2xl font-bold mb-2">Xhenvolt</div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Email</div>
                      <a
                        href="mailto:drais@xhenvolt.com"
                        className="font-medium hover:text-blue-300 transition-colors"
                      >
                        drais@xhenvolt.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Phone</div>
                      <div className="font-medium">0741 341 483</div>
                      <div className="font-medium">0760 700 954</div>
                      <div className="font-medium">0745 726 350</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
