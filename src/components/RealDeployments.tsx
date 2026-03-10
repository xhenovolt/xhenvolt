"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import {
  School,
  Building2,
  Monitor,
  Fingerprint,
  FileText,
  Globe,
  MapPin,
  CheckCircle,
  ArrowRight,
  Users,
} from "lucide-react";

/* ── Deployment data ── */
const deployments = [
  {
    institution: "Ibun Baz Girls Secondary School",
    person: "Sheikh Hassan Mwaita",
    role: "Principal",
    system: "Attendance Monitoring System",
    type: "drais",
    impact: "100% accurate biometric attendance with real-time parent notifications. Complete elimination of proxy attendance.",
    logo: null,
    region: "Uganda",
  },
  {
    institution: "Hillside Ways Secondary School",
    person: null,
    role: null,
    system: "Attendance Tracking System",
    type: "drais",
    impact: "Automated attendance monitoring deployed across the entire school, providing administrators real-time visibility.",
    logo: null,
    region: "Uganda",
  },
  {
    institution: "Albayan Quran Memorization Center",
    person: "Wagogo Husama",
    role: "Headteacher",
    system: "Customized Program-Based Management",
    type: "drais",
    impact: "Fully customized system tailored for Quran memorization programs. Unique tracking and reporting for specialized education.",
    logo: "albayan.png",
    region: "Uganda",
  },
  {
    institution: "Northgate Schools",
    person: "Ngobi Peter",
    role: "General Director",
    system: "Advanced Academic Reporting System",
    type: "drais",
    impact: "Highly customizable report system matching their specific curriculum. Streamlined operations across all departments.",
    logo: "northgateschool.png",
    region: "Uganda",
  },
  {
    institution: "Excel Islamic Schools",
    person: "Sheikh Hassan Mwaita",
    role: "Director",
    system: "School Management & Attendance",
    type: "drais",
    impact: "Comprehensive school management system with biometric integration. Automated record-keeping and parent communication.",
    logo: null,
    region: "Uganda",
  },
  {
    institution: "Seek and Give Charity Organization",
    person: "Wasukulu Shafik",
    role: "Leader",
    system: "Institutional Website",
    type: "website",
    impact: "Professional web presence enabling donor engagement, program tracking, and organizational credibility online.",
    logo: null,
    region: "Uganda",
  },
  {
    institution: "Unity Bridge Foundation",
    person: "Kanyere Sahal",
    role: "Leader",
    system: "Institutional Website",
    type: "website",
    impact: "Modern, responsive website establishing digital presence and enabling stakeholder communication.",
    logo: null,
    region: "Uganda",
  },
  {
    institution: "Vision International Academy",
    person: "Okurut Sylver",
    role: "Head Teacher",
    system: "Institutional Website",
    type: "website",
    impact: "Professional website serving as a 24/7 information hub for parents, students, and potential enrollees.",
    logo: null,
    region: "Uganda",
  },
];

/* ── Animated counter ── */
function AnimatedCounter({ end, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const num = typeof end === "string" ? parseInt(end) : end;
    if (isNaN(num)) return;
    let start = 0;
    const duration = 2000;
    const increment = num / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

/* ── SVG Mockup for deployment cards ── */
function DeploymentMockup({ type, institution }) {
  if (type === "drais") {
    return (
      <svg viewBox="0 0 200 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" rx="8" fill="currentColor" className="text-blue-50 dark:text-blue-950/40" />
        {/* Mini dashboard */}
        <rect x="10" y="10" width="180" height="100" rx="6" fill="white" className="dark:fill-gray-800" />
        <rect x="10" y="10" width="180" height="20" rx="6" fill="#f3f4f6" className="dark:fill-gray-700" />
        <circle cx="22" cy="20" r="3" fill="#ef4444" />
        <circle cx="30" cy="20" r="3" fill="#f59e0b" />
        <circle cx="38" cy="20" r="3" fill="#22c55e" />
        <text x="100" y="23" textAnchor="middle" fill="#9ca3af" fontSize="5" fontFamily="Arial">DRAIS Dashboard</text>
        
        {/* Attendance bars */}
        <motion.rect x="20" y="70" width="30" height="30" rx="3" fill="#3b82f6" initial={{ height: 0, y: 100 }} animate={{ height: 30, y: 70 }} transition={{ delay: 0.3, duration: 0.5 }} />
        <motion.rect x="58" y="55" width="30" height="45" rx="3" fill="#22c55e" initial={{ height: 0, y: 100 }} animate={{ height: 45, y: 55 }} transition={{ delay: 0.5, duration: 0.5 }} />
        <motion.rect x="96" y="62" width="30" height="38" rx="3" fill="#8b5cf6" initial={{ height: 0, y: 100 }} animate={{ height: 38, y: 62 }} transition={{ delay: 0.7, duration: 0.5 }} />
        <motion.rect x="134" y="50" width="30" height="50" rx="3" fill="#06b6d4" initial={{ height: 0, y: 100 }} animate={{ height: 50, y: 50 }} transition={{ delay: 0.9, duration: 0.5 }} />
        
        {/* Fingerprint icon */}
        <circle cx="172" cy="42" r="8" fill="#3b82f620" stroke="#3b82f6" strokeWidth="1" />
        <motion.circle cx="172" cy="42" r="4" fill="#3b82f6" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" rx="8" fill="currentColor" className="text-emerald-50 dark:text-emerald-950/40" />
      {/* Browser mockup */}
      <rect x="10" y="10" width="180" height="100" rx="6" fill="white" className="dark:fill-gray-800" />
      <rect x="10" y="10" width="180" height="18" rx="6" fill="#f3f4f6" className="dark:fill-gray-700" />
      <circle cx="22" cy="19" r="3" fill="#ef4444" />
      <circle cx="30" cy="19" r="3" fill="#f59e0b" />
      <circle cx="38" cy="19" r="3" fill="#22c55e" />
      
      {/* Hero area */}
      <rect x="16" y="32" width="168" height="35" rx="4" fill="#10b98120" />
      <rect x="24" y="38" width="80" height="6" rx="2" fill="#10b981" />
      <rect x="24" y="48" width="60" height="4" rx="2" fill="#6b7280" opacity="0.5" />
      <rect x="24" y="56" width="50" height="8" rx="4" fill="#10b981" />
      
      {/* Content blocks */}
      <motion.rect x="16" y="74" width="50" height="28" rx="4" fill="#f3f4f6" className="dark:fill-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
      <motion.rect x="72" y="74" width="50" height="28" rx="4" fill="#f3f4f6" className="dark:fill-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
      <motion.rect x="128" y="74" width="50" height="28" rx="4" fill="#f3f4f6" className="dark:fill-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
    </svg>
  );
}

/* ── Logo component ── */
function DeploymentLogo({ institution, logo }) {
  const [ok, setOk] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!logo) { setChecked(true); return; }
    const img = new window.Image();
    img.onload = () => { setOk(true); setChecked(true); };
    img.onerror = () => { setChecked(true); };
    img.src = `/client_logos/${logo}`;
  }, [logo]);

  if (!checked) return <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  
  if (ok && logo) {
    return <Image src={`/client_logos/${logo}`} alt={institution} width={48} height={48} className="rounded-xl object-cover" />;
  }

  const initials = institution.split(" ").filter(w => w.length > 2).map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
  const c = colors[institution.length % colors.length];
  
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: c }}>
      {initials}
    </div>
  );
}

export default function RealDeployments() {
  const [filter, setFilter] = useState("all");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  
  const filtered = filter === "all" ? deployments : deployments.filter(d => d.type === filter);

  const stats = [
    { value: 35, suffix: "", label: "Organizations Served", icon: <Building2 className="w-7 h-7" /> },
    { value: 29, suffix: "", label: "Schools Running DRAIS", icon: <School className="w-7 h-7" /> },
    { value: 6, suffix: "", label: "Website & Other Solutions", icon: <Globe className="w-7 h-7" /> },
    { value: 99, suffix: ".9%", label: "System Uptime", icon: <Monitor className="w-7 h-7" /> },
  ];

  return (
    <section ref={sectionRef} className="py-28" id="deployments">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 rounded-full mb-6">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
              Proof of Real Deployment
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            DRAIS Running in Real Schools
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            These are not mockups. These are real institutions running Xhenvolt systems every single day.
          </p>
        </motion.div>

        {/* Animated Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                {s.icon}
              </div>
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                <AnimatedCounter end={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-3 mb-10">
          {[
            { id: "all", label: "All Deployments" },
            { id: "drais", label: "DRAIS Systems" },
            { id: "website", label: "Websites" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Deployment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((d, index) => (
            <motion.div
              key={d.institution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index, 3) * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              {/* Mockup illustration */}
              <div className="p-4 pb-0">
                <DeploymentMockup type={d.type} institution={d.institution} />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <DeploymentLogo institution={d.institution} logo={d.logo} />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {d.institution}
                    </h3>
                    {d.person && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {d.role}: {d.person}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    d.type === "drais"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  }`}>
                    {d.type === "drais" ? "DRAIS" : "Website"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  {d.type === "drais" ? (
                    <Fingerprint className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Globe className="w-4 h-4 text-emerald-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {d.system}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {d.impact}
                </p>

                <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" />
                  {d.region}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Want to see how DRAIS can work for your institution?
          </p>
          <a
            href="https://drais.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore DRAIS <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
