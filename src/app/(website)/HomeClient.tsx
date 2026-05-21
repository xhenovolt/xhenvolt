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
  TrendingUp,
  Shield,
  Award,
  Play,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DraisMicroDemo from "@/components/DraisMicroDemo";
import SystemsShowcase from "@/components/SystemsShowcase";
import MiniProductTour from "@/components/MiniProductTour";
import ClientLogosCarousel from "@/components/ClientLogosCarousel";
import InteractiveProductStory from "@/components/InteractiveProductStory";
import OurJourney, { type MilestoneItem } from "@/components/OurJourney";
import RealDeployments from "@/components/RealDeployments";
import ObjectionCrusher from "@/components/ObjectionCrusher";
import type { HomepageHeroContent } from "@/lib/cms/sections/homepage-hero.section";

/* ─────────────── DATA ─────────────── */

interface HomeClientProps {
  hero?: HomepageHeroContent;
  testimonials: HomeTestimonial[];
  milestones: MilestoneItem[];
}

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

export interface HomeTestimonial {
  name: string;
  position: string;
  institution: string;
  quote: string;
  logo: string | null;
  category: string;
  featured?: boolean;
}

const FALLBACK_TESTIMONIALS: HomeTestimonial[] = [
  {
    name: "Sheikh Isabirye Bilaal",
    position: "School Director",
    institution: "City Parents School",
    quote:
      "Before Xhenvolt, tracking the whereabouts of both learners and staff was a constant struggle. Our manual systems failed to provide the level of control and visibility we needed. Since implementing Xhenvolt, we now have precise, real-time tracking that has completely transformed our operations. It solved a problem we had struggled with for years.",
    logo: null,
    category: "drais",
    featured: true,
  },
  // ── DRAIS Deployment Testimonials ──
  {
    name: "Sheikh Hassan Mwaita",
    position: "Director – Excel Islamic Schools & Principal – Ibun Baz Girls Secondary School",
    institution: "Excel Islamic Schools",
    quote:
      "Attendance tracking was our biggest challenge across multiple schools. With DRAIS biometric integration, we now have 100% accurate records. Parents love the real-time SMS updates and our administrative workload has dropped significantly.",
    logo: null,
    category: "drais",
  },
  {
    name: "Ngobi Peter",
    position: "General Director",
    institution: "Northgate Schools",
    quote:
      "We needed a fully customizable academic reporting system that matched our curriculum perfectly. DRAIS delivered exactly that — and more. Our operations have never been smoother, and the reporting capabilities are truly world-class.",
    logo: "northgateschool-Photoroom.png",
    category: "drais",
  },
  {
    name: "Wagogo Husama",
    position: "Headteacher",
    institution: "Albayan Quran Memorization Center",
    quote:
      "Our programs are structured specifically for Quran memorization — completely different from standard schools. DRAIS was customized perfectly to fit our unique educational model and tracking needs. No other system could have done this.",
    logo: "albayan-Photoroom.png",
    category: "drais",
  },
  {
    name: "Sheikh Hassan Mwaita",
    position: "Principal",
    institution: "Ibun Baz Girls Secondary School",
    quote:
      "The full attendance system deployment at Ibun Baz has transformed how we monitor student presence. The biometric devices work flawlessly, and we get real-time data that helps us make informed decisions about student welfare.",
    logo: "ibunbaz-photoroom.png",
    category: "drais",
  },
  {
    name: "Mwondha Hassan",
    position: "Director",
    institution: "Hill Side Ways Nursery and Primary School",
    quote:
      "Before Xhenvolt, tracking the whereabouts of both learners and staff was a constant struggle. Our manual systems failed to provide the level of control and visibility we needed. Since implementing Xhenvolt, we now have precise, real-time tracking that has completely transformed our operations. It solved a problem we had struggled with for years.",
    logo: null,
    category: "drais",
  },
  {
    name: "Sheikh Naminya Faisal",
    position: "Director",
    institution: "Al Hanan Education Center",
    quote:
      "DRAIS gave us visibility into our school operations that we never had before. From daily attendance to term-end analytics — everything is right on the dashboard. It has become the backbone of our school management.",
    logo: null,
    category: "drais",
  },
  {
    name: "Okurut Sylver",
    position: "Head Teacher",
    institution: "Vision International Academy",
    quote:
      "Since adopting DRAIS, our teachers save hours every week on paperwork. The automated report generation alone was worth the investment — parents are impressed with the professional quality of reports.",
    logo: null,
    category: "drais",
  },
  {
    name: "Mr. Mwondha Hassan",
    position: "Director",
    institution: "Hill Side Ways Nursery and Primary School",
    quote:
      "The attendance and operational systems from Xhenvolt have transformed how we manage daily school activities. Everything is automated, reliable, and we can trust the data completely.",
    logo: null,
    category: "drais",
  },
  // ── Website Development Testimonials ──
  {
    name: "Sheikh Naminya Faisal",
    position: "Director",
    institution: "Al Hanan Education Center",
    quote:
      "Xhenvolt built us a website that truly reflects who we are as an institution. Our parents and students can now find everything they need online — program details, contacts, announcements. It gave us a professional presence we never had before. Highly recommended.",
    logo: null,
    category: "website",
  },
  {
    name: "Wasukulu Ali Shafik",
    position: "Director",
    institution: "Seek and Give Charity Organization",
    quote:
      "Xhenvolt didn't just build us a website — they built a professional platform that helps us connect with donors, showcase our programs, and build credibility. The quality exceeded our expectations. Our visibility has increased significantly.",
    logo: null,
    category: "website",
  },
  {
    name: "Kanyere Sahal",
    position: "Leader",
    institution: "Unity Bridge Foundation",
    quote:
      "Our new website from Xhenvolt has completely changed how stakeholders perceive our foundation. It's modern, responsive, and perfectly represents our mission. We've seen a real increase in engagement.",
    logo: null,
    category: "website",
  },
  {
    name: "Abdul Fattaha Makubugu",
    position: "Founder & Director",
    institution: "Al Muntahha Online School",
    quote:
      "Xhenvolt helped us establish a strong digital presence for our online school. The website they built is fast, professional, and makes it easy for parents and students to find the information they need.",
    logo: null,
    category: "website",
  },
  {
    name: "Okurut Sylver",
    position: "Headteacher",
    institution: "Vision International Academy",
    quote:
      "The website Xhenvolt built for our academy is outstanding. It's mobile-friendly, loads fast, and gives parents 24/7 access to school information. We've seen more parent engagement and inquiries since it launched. It has elevated our institution's image significantly.",
    logo: null,
    category: "website",
  },
  {
    name: "Sheikh Hassan Mwaita",
    position: "Director",
    institution: "Excel Islamic Secondary School",
    quote:
      "Having a professional website built by Xhenvolt has given our school a commanding digital presence. Parents and prospective students can now learn about our programs and values from anywhere.",
    logo: null,
    category: "website",
  },
  {
    name: "Hon. Rachel Magoola",
    position: "School Board Chairperson",
    institution: "Walugogo Vocational Secondary School",
    quote:
      "We were looking for a partner who understood vocational education. Xhenvolt built us a beautiful website that properly showcases both our academic and practical training programs with precision.",
    logo: null,
    category: "website",
  },
];

const organizations = [
  {
    name: "Northgate Schools",
    contact: "Ngobi Peter",
    role: "General Director",
    logo: "northgateschool-Photoroom.png",
    system: "DRAIS",
  },
  {
    name: "Albayan Quran Memorization Center",
    contact: "Wagogo Husama",
    role: "Headteacher",
    logo: "albayan-Photoroom.png",
    system: "DRAIS",
  },
  {
    name: "Excel Islamic Schools",
    contact: "Sheikh Hassan Mwaita",
    role: "Director",
    logo: "exlel.png",
    system: "DRAIS",
  },
  {
    name: "Ibun Baz Girls Secondary School",
    contact: "Sheikh Hassan Mwaita",
    role: "Principal",
    logo: "ibunbaz-photoroom.png",
    system: "DRAIS",
  },
  {
    name: "Hill Side Ways Nursery and Primary School",
    contact: "Mwondha Hassan",
    role: "Director",
    logo: "Hillsideways badge-Photoroom.png",
    system: "DRAIS",
  },
  {
    name: "Vision International Academy",
    contact: "Okurut Sylver",
    role: "Head Teacher",
    logo: "vision-international.svg",
    system: "DRAIS",
  },
  {
    name: "Al Hanan Education Center",
    contact: "Sheikh Naminya Faisal",
    role: "Director",
    logo: "al-hanan.svg",
    system: "DRAIS",
  },
  {
    name: "City Parents School",
    contact: null,
    role: null,
    logo: "city Parents-Photoroom.png",
    system: "DRAIS",
  },
  {
    name: "Walugogo Vocational Secondary School",
    contact: "Hon. Rachel Magoola",
    role: "Board Chair",
    logo: "Walugogologo-Photoroom.png",
    system: "Website",
  },
  {
    name: "Seek and Give Charity Organization",
    contact: "Wasukulu Ali Shafik",
    role: "Director",
    logo: "seek_and_give.svg",
    system: "Website",
  },
  {
    name: "Unity Bridge Foundation",
    contact: "Kanyere Sahal",
    role: "Leader",
    logo: null,
    system: "Website",
  },
  {
    name: "Al Muntahha Online School",
    contact: "Abdul Fattaha Makubugu",
    role: "Founder",
    logo: "almuntahha.svg",
    system: "Website",
  },
  {
    name: "Bugembe Islamic Institute",
    contact: null,
    role: null,
    logo: "Bugembe-Photoroom.png",
    system: "DRAIS",
  },
];

const trustIndicators = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "High Reliability Infrastructure",
    description:
      "Our systems are built on robust infrastructure with 99.9% uptime. Schools depend on us for daily operations — and we deliver without fail.",
    metric: "99.9%",
    metricLabel: "Uptime",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Fast Deployment",
    description:
      "From initial consultation to fully operational system — we deploy within days, not months. Your institution starts benefiting immediately.",
    metric: "Days",
    metricLabel: "To Deploy",
    gradient: "from-purple-600 to-pink-500",
  },
  {
    icon: <Monitor className="w-8 h-8" />,
    title: "Cross-Device Compatibility",
    description:
      "Access your dashboards from any device — desktop, tablet, or smartphone. Our systems adapt seamlessly to any screen size.",
    metric: "100%",
    metricLabel: "Responsive",
    gradient: "from-emerald-600 to-teal-500",
  },
];

const trustPillars = [
  { icon: <Shield className="w-6 h-6" />, label: "Secure Data Handling", color: "blue" },
  { icon: <TrendingUp className="w-6 h-6" />, label: "Scalable Infrastructure", color: "purple" },
  { icon: <Monitor className="w-6 h-6" />, label: "Optimized Performance", color: "cyan" },
  { icon: <Award className="w-6 h-6" />, label: "Long-Term Reliability", color: "green" },
];

const trustMetrics = [
  { value: "31", label: "Schools Running DRAIS", icon: <School className="w-8 h-8" /> },
  { value: "37+", label: "Organizations Served", icon: <Building2 className="w-8 h-8" /> },
  { value: "37+", label: "Systems Deployed", icon: <Monitor className="w-8 h-8" /> },
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

/* ─────────────── TESTIMONIALS W/ SHOW MORE ─────────────── */

function TestimonialsSection({ items }: { items: HomeTestimonial[] }) {
  const [showAll, setShowAll] = useState(false);
  const list = items.length > 0 ? items : FALLBACK_TESTIMONIALS;
  const visible = showAll ? list : list.slice(0, 6);

  return (
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
            What Institutions Say About Us
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real feedback from {list.length} institutions that trust
            Xhenvolt with their daily operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((t, index) => (
            <motion.div
              key={`${t.name}-${t.institution}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index, 5) * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="flex-1">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <ClientLogo name={t.institution} filename={t.logo} size={48} />
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

        {list.length > 6 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll((p) => !p)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {showAll ? "Show Less" : `Show All ${list.length} Testimonials`}
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${showAll ? "-rotate-90" : "rotate-90"}`} />
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────── PAGE ─────────────── */

export interface HomeClientProps {
  hero?: HomepageHeroContent;
  testimonials: HomeTestimonial[];
  milestones?: MilestoneItem[];
}

export default function HomePage({
  hero,
  testimonials = [],
  milestones = [],
}: HomeClientProps) {
  const heroData: HomepageHeroContent = hero ?? {
    eyebrow: "Uganda's #1 School Management System",
    headline: "School Management & Attendance Tracking for Uganda",
    subheadline:
      "DRAIS is Uganda's leading school management system — automating attendance tracking, student reporting, and real-time monitoring for schools that demand excellence.",
    ctaPrimaryLabel: "Explore DRAIS",
    ctaPrimaryHref: "https://drais.pro",
    ctaSecondaryLabel: "Book a Free Demo",
    ctaSecondaryHref: "/contact",
    tags: ["Biometric Attendance", "Real-time Monitoring", "School Analytics", "Parent Alerts"],
    backgroundUrl: null,
  };

  const renderCta = (label: string | null | undefined, href: string | null | undefined, primary = false) => {
    if (!label || !href) return null;
    const external = href.startsWith("http");
    const className = primary
      ? "inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
      : "inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 gap-2";

    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {primary && <Play className="w-5 h-5" />}
          {label}
        </a>
      );
    }

    return (
      <Link href={href} className={className}>
        {primary && <Play className="w-5 h-5" />}
        {label}
        {!primary && <ArrowRight className="w-5 h-5" />}
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">

      {/* ═══════ SECTION 1 — HERO ═══════ */}
      <section className="pt-32 pb-24 overflow-hidden relative">
        {heroData.backgroundUrl ? (
          <div className="absolute inset-0 opacity-40">
            <Image
              src={heroData.backgroundUrl}
              alt={heroData.headline}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/20" />
          </div>
        ) : null}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="hero-glow" cx="60%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-glow)" />
          </svg>
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-800/20 dark:to-purple-800/20 blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-gradient-to-br from-cyan-200/20 to-blue-200/20 dark:from-cyan-800/15 dark:to-blue-800/15 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-purple-300/15 dark:bg-purple-600/10 blur-2xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {heroData.eyebrow ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-4">
                  <School className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {heroData.eyebrow}
                  </span>
                </div>
              ) : null}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 rounded-full mb-6 ml-2">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Trusted by 37+ Institutions
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  {heroData.headline}
                </span>
              </h1>

              {heroData.subheadline ? (
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-xl">
                  {heroData.subheadline}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3 mb-8">
                {heroData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {renderCta(heroData.ctaPrimaryLabel, heroData.ctaPrimaryHref, true)}
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {renderCta(heroData.ctaSecondaryLabel, heroData.ctaSecondaryHref, false)}
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
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-gray-600 dark:text-gray-300 ml-2 text-sm">
                    Trusted by real institutions
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic text-sm">
                  &quot;Xhenvolt built us a system that actually works for how our school operates.&quot;
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  — Ngobi Peter, General Director, Northgate Schools
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ PROBLEM → SOLUTION → PROOF ═══════ */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Manual Attendance Is Costing Your School
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Proxy attendance, missing records, and late reports are preventable. DRAIS eliminates them all with real-time biometric tracking.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "PROBLEM", color: "from-red-500 to-orange-500", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-100 dark:border-red-800/30", icon: "⚠️", title: "Manual Systems Fail", desc: "Missing registers, proxy attendance, and inaccurate records undermine your school's operations and credibility." },
              { step: "SOLUTION", color: "from-blue-500 to-purple-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-800/30", icon: "🎯", title: "DRAIS Automates Everything", desc: "Biometric attendance, automated reports, parent alerts, and real-time dashboards — all in one school management system." },
              { step: "PROOF", color: "from-green-500 to-emerald-500", bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-100 dark:border-green-800/30", icon: "✅", title: "31 Schools Trust DRAIS", desc: "Northgate, Albayan, City Parents, Ibun Baz, Hillside Ways, and 26+ more institutions run on DRAIS daily across Uganda." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className={`${item.bg} border ${item.border} rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-400`}
              >
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${item.color} mb-4`}>
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 2 — OUR CORE SOLUTIONS FOR SCHOOLS ═══════ */}
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
              Our Core Solutions for Schools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Purpose-built systems that power modern schools, institutions, and organizations across Uganda.
            </p>
          </motion.div>

          {/* DRAIS — Primary, Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-10 md:p-14 text-white mb-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/20 rounded-full mb-4">
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span className="text-xs font-bold text-yellow-200">FLAGSHIP SYSTEM — PRIMARY</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-extrabold mb-4">DRAIS</h3>
                <p className="text-lg text-white/90 mb-6 max-w-xl leading-relaxed">
                  Uganda&apos;s #1 school management system. Biometric attendance tracking, automated reporting, parent communication, school analytics, and real-time monitoring — all in one powerful platform.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Biometric Attendance", "School Management", "Real-time Monitoring", "Parent Alerts", "Analytics", "Multi-School"].map((f) => (
                    <span key={f} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{f}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="https://drais.pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-7 py-3 bg-white text-blue-700 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                  >
                    <Play className="w-4 h-4" /> Visit drais.pro
                  </motion.a>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/contact" className="inline-flex items-center px-7 py-3 border-2 border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 gap-2">
                      Book Demo <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
              <div className="flex-shrink-0 grid grid-cols-2 gap-3 min-w-[240px]">
                {[{ v: "31", l: "Schools" }, { v: "96%", l: "Accuracy" }, { v: "Days", l: "To Deploy" }, { v: "99.9%", l: "Uptime" }].map((s, i) => (
                  <div key={i} className="bg-white/15 backdrop-blur rounded-2xl p-4 text-center">
                    <div className="text-2xl font-extrabold">{s.v}</div>
                    <div className="text-xs text-white/70 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Other systems — 3 col grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "JETON",
                tagline: "Financial Management System",
                desc: "Automated income tracking, expense management, SACCO operations, and financial reporting for organizations and institutions.",
                href: "https://jeton.xhenvolt.com",
                features: ["Income Tracking", "Expense Management", "SACCO Operations", "Financial Reports"],
                gradient: "from-emerald-500 to-teal-600",
                bg: "bg-emerald-50 dark:bg-emerald-900/10",
                border: "border-emerald-100 dark:border-emerald-800/30",
              },
              {
                name: "XHAIRA",
                tagline: "HR & Staff Management",
                desc: "Staff records, payroll management, leave tracking, performance monitoring, and organizational HR operations.",
                href: "https://xhaira.xhenvolt.com",
                features: ["Staff Records", "Payroll", "Leave Management", "Performance Tracking"],
                gradient: "from-violet-500 to-purple-600",
                bg: "bg-violet-50 dark:bg-violet-900/10",
                border: "border-violet-100 dark:border-violet-800/30",
              },
              {
                name: "CONSTY",
                tagline: "Construction & Project Management",
                desc: "Project tracking, resource allocation, costing, task management, and progress monitoring for construction and development projects.",
                href: "https://consty.xhenvolt.com",
                features: ["Project Tracking", "Resource Planning", "Cost Management", "Progress Reports"],
                gradient: "from-orange-500 to-amber-600",
                bg: "bg-orange-50 dark:bg-orange-900/10",
                border: "border-orange-100 dark:border-orange-800/30",
              },
            ].map((sys, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`${sys.bg} border ${sys.border} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-400 flex flex-col`}
              >
                <div className={`inline-flex items-center self-start px-3 py-1 mb-4 rounded-full text-xs font-bold text-white bg-gradient-to-r ${sys.gradient}`}>
                  {sys.name}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{sys.tagline}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 flex-1">{sys.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {sys.features.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">{f}</span>
                  ))}
                </div>
                <motion.a
                  href={sys.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  className={`self-start inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold bg-gradient-to-r ${sys.gradient} shadow hover:shadow-md transition-all duration-300`}
                >
                  Explore {sys.name} <ArrowRight className="w-4 h-4" />
                </motion.a>
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

      {/* ═══════ SECTION 3b — DRAIS MICRO-DEMO CAROUSEL ═══════ */}
      <div id="drais-demo">
        <DraisMicroDemo />
      </div>

      {/* ═══════ SECTION 3c — SYSTEMS SCREENSHOT SHOWCASE ═══════ */}
      <SystemsShowcase />

      {/* ═══════ SECTION 4 — FEATURED TESTIMONIAL ═══════ */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl text-blue-400 mb-6 font-serif">&ldquo;</div>
            <blockquote className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10 font-medium italic">
              Before Xhenvolt, tracking the whereabouts of both learners and staff was a constant struggle.
              Our manual systems failed to provide the level of control and visibility we needed.
              Since implementing Xhenvolt, we now have precise, real-time tracking that has completely
              transformed our operations. It solved a problem we had struggled with for years.
            </blockquote>
            <div className="flex items-center justify-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                IB
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-white">Sheikh Isabirye Bilaal</div>
                <div className="text-blue-300 text-sm font-medium">School Director</div>
                <div className="text-white/50 text-xs mt-0.5">City Parents School</div>
              </div>
            </div>
            <div className="flex justify-center gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ SECTION 4b — SCHOOL TESTIMONIALS ═══════ */}
      <TestimonialsSection items={testimonials} />

      {/* ═══════ SECTION 5 — ORGANIZATIONS THAT TRUST XHENVOLT ═══════ */}
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
              Organizations That Trust Xhenvolt
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              37+ organizations and counting — schools, NGOs, and institutions across Uganda
              rely on our systems every day.
            </p>
            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                <School className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">31 Schools Using DRAIS</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-full">
                <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">8+ Websites & Other Solutions</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 dark:bg-green-900/30 rounded-full">
                <Building2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-bold text-green-700 dark:text-green-300">37+ Total Organizations</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizations.map((org, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index, 5) * 0.08 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-500 flex items-center gap-5"
              >
                <ClientLogo name={org.name} filename={org.logo} size={56} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white text-lg truncate">
                    {org.name}
                  </div>
                  {org.contact && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {org.role ? `${org.role}: ` : ""}
                      {org.contact}
                    </div>
                  )}
                  <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    org.system === "DRAIS"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  }`}>
                    {org.system}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CLIENT LOGOS CAROUSEL ═══════ */}
      <ClientLogosCarousel />

      {/* ═══════ INTERACTIVE PRODUCT STORY ═══════ */}
      <InteractiveProductStory />

      {/* ═══════ REAL DEPLOYMENTS ═══════ */}
      <RealDeployments />

      {/* ═══════ SECTION 6 — WHY TRUST XHENVOLT ═══════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Why Institutions Trust Our Systems
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built for reliability, security, and performance — our infrastructure keeps institutions running smoothly.
            </p>
            {/* Trust pillars */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {trustPillars.map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                  <span className="text-blue-600 dark:text-blue-400">{p.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{p.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-12">
            {trustIndicators.map((block, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`bg-gradient-to-r ${block.gradient} rounded-3xl p-12 md:p-16 text-white relative overflow-hidden shadow-2xl`}
              >
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      {block.icon}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                      {block.title}
                    </h3>
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                      {block.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center min-w-[140px]">
                    <div className="text-4xl md:text-5xl font-extrabold">{block.metric}</div>
                    <div className="text-sm text-white/80 mt-1">{block.metricLabel}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ OBJECTION CRUSHER ═══════ */}
      <div id="objections">
        <ObjectionCrusher />
      </div>

      {/* ═══════ OUR JOURNEY ═══════ */}
      <OurJourney milestones={milestones} />

      {/* ═══════ MINI PRODUCT TOUR ═══════ */}
      <MiniProductTour />

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
                Ready to Transform Your Institution?
              </h2>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Join 37+ organizations already running on Xhenvolt systems.
                Book a free demo and see DRAIS in action — no commitment required.
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
                    Book a Free Demo <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="https://drais.pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 gap-2"
                  >
                    <Play className="w-5 h-5" />
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
                  {/* Quick Links */}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <a href="https://drais.pro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                      <ArrowRight className="w-3 h-3" /> DRAIS — School Management — drais.pro
                    </a>
                    <a href="https://jeton.xhenvolt.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                      <ArrowRight className="w-3 h-3" /> Jeton Financial System — jeton.xhenvolt.com
                    </a>
                    <a href="https://xhaira.xhenvolt.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                      <ArrowRight className="w-3 h-3" /> Xhaira HR System — xhaira.xhenvolt.com
                    </a>
                    <a href="https://consty.xhenvolt.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                      <ArrowRight className="w-3 h-3" /> Consty Project Management — consty.xhenvolt.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  );
}
