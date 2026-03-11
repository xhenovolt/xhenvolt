"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Server,
  Wifi,
  WifiOff,
  Database,
  Clock,
  CheckCircle2,
  RefreshCcw,
  Shield,
  ArrowRight,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

/* ─── Inline SVG Architecture Diagram ─── */
function UptimeArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 800 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Background */}
      <rect rx="20" width="800" height="420" fill="url(#reliability-bg)" />

      {/* Primary Server */}
      <rect x="60" y="60" width="160" height="90" rx="14" fill="#2563eb" opacity="0.15" stroke="#2563eb" strokeWidth="2" />
      <text x="140" y="95" textAnchor="middle" fill="#2563eb" fontWeight="700" fontSize="14">Primary Server</text>
      <text x="140" y="118" textAnchor="middle" fill="#64748b" fontSize="11">Cloud-hosted • Always on</text>
      <circle cx="140" cy="138" r="5" fill="#22c55e" />

      {/* Arrow → DRAIS App */}
      <line x1="220" y1="105" x2="300" y2="105" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 3" />
      <polygon points="298,100 308,105 298,110" fill="#2563eb" />

      {/* DRAIS App */}
      <rect x="310" y="60" width="180" height="90" rx="14" fill="#7c3aed" opacity="0.12" stroke="#7c3aed" strokeWidth="2" />
      <text x="400" y="95" textAnchor="middle" fill="#7c3aed" fontWeight="700" fontSize="14">DRAIS Application</text>
      <text x="400" y="118" textAnchor="middle" fill="#64748b" fontSize="11">Attendance • Reports • SMS</text>
      <circle cx="400" cy="138" r="5" fill="#22c55e" />

      {/* Arrow → School Dashboard */}
      <line x1="490" y1="105" x2="570" y2="105" stroke="#7c3aed" strokeWidth="2" strokeDasharray="6 3" />
      <polygon points="568,100 578,105 568,110" fill="#7c3aed" />

      {/* School Dashboard */}
      <rect x="580" y="60" width="160" height="90" rx="14" fill="#0891b2" opacity="0.12" stroke="#0891b2" strokeWidth="2" />
      <text x="660" y="95" textAnchor="middle" fill="#0891b2" fontWeight="700" fontSize="14">School Dashboard</text>
      <text x="660" y="118" textAnchor="middle" fill="#64748b" fontSize="11">Live data • Real-time view</text>
      <circle cx="660" cy="138" r="5" fill="#22c55e" />

      {/* Offline Fallback Layer */}
      <rect x="60" y="200" width="320" height="100" rx="16" fill="#f59e0b" opacity="0.10" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 4" />
      <text x="220" y="235" textAnchor="middle" fill="#d97706" fontWeight="700" fontSize="14">Offline Fallback Layer</text>
      <text x="220" y="258" textAnchor="middle" fill="#64748b" fontSize="11">Local device caches attendance data</text>
      <text x="220" y="278" textAnchor="middle" fill="#64748b" fontSize="11">Auto-syncs when connectivity returns</text>

      {/* Arrow from Offline → DRAIS */}
      <line x1="380" y1="250" x2="400" y2="170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" />
      <polygon points="396,173 403,163 407,175" fill="#f59e0b" />
      <text x="405" y="210" fill="#d97706" fontSize="10" fontWeight="600">sync</text>

      {/* Redundancy Box */}
      <rect x="440" y="200" width="300" height="100" rx="16" fill="#22c55e" opacity="0.10" stroke="#22c55e" strokeWidth="2" />
      <text x="590" y="235" textAnchor="middle" fill="#16a34a" fontWeight="700" fontSize="14">Redundant Backups</text>
      <text x="590" y="258" textAnchor="middle" fill="#64748b" fontSize="11">Automated daily backups</text>
      <text x="590" y="278" textAnchor="middle" fill="#64748b" fontSize="11">Disaster recovery in &lt; 30 min</text>

      {/* Monitoring */}
      <rect x="200" y="340" width="400" height="60" rx="14" fill="#6366f1" opacity="0.10" stroke="#6366f1" strokeWidth="1.5" />
      <text x="400" y="370" textAnchor="middle" fill="#6366f1" fontWeight="700" fontSize="13">24 / 7 Monitoring &amp; Auto-Restart</text>
      <text x="400" y="388" textAnchor="middle" fill="#64748b" fontSize="11">Alerts → Auto-healing → Engineer escalation in &lt; 15 min</text>

      <defs>
        <linearGradient id="reliability-bg" x1="0" y1="0" x2="800" y2="420">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#eff6ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const uptimeFeatures = [
  { icon: <Server className="w-6 h-6" />, title: "Cloud-Hosted Infrastructure", description: "DRAIS runs on enterprise-grade cloud servers with automatic scaling to handle peak attendance hours without slowdowns." },
  { icon: <WifiOff className="w-6 h-6" />, title: "Offline-First Architecture", description: "Biometric devices cache attendance locally. If connectivity drops, data is stored safely and synced the moment the network returns." },
  { icon: <Database className="w-6 h-6" />, title: "Automated Daily Backups", description: "Every school's data is backed up automatically every 24 hours. Full disaster recovery takes less than 30 minutes." },
  { icon: <RefreshCcw className="w-6 h-6" />, title: "Auto-Healing & Restart", description: "Our monitoring layer detects downtime instantly and auto-restarts services. If manual intervention is needed, our team is alerted within seconds." },
  { icon: <Clock className="w-6 h-6" />, title: "99.9 % Uptime SLA", description: "Across all active deployments, DRAIS has maintained 99.9% uptime over the past 12 months — schools open, DRAIS is running." },
  { icon: <Shield className="w-6 h-6" />, title: "Redundant Network Paths", description: "Critical routes are duplicated so a single network failure never takes the system offline." },
];

export default function ReliabilityPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[600px] h-[600px] bg-white rounded-full -top-60 -right-40" />
          <div className="absolute w-[400px] h-[400px] bg-cyan-300 rounded-full bottom-0 -left-32" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6">
          <Link href="/#objections" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to all questions
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
          >
            &ldquo;What if the system goes down during school hours?&rdquo;
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-xl md:text-2xl text-white/85 max-w-3xl leading-relaxed"
          >
            Short answer: it doesn&apos;t. DRAIS is engineered with redundant infrastructure, offline failovers, and 24/7 monitoring so your school never misses a beat.
          </motion.p>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">How DRAIS Stays Online</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
              Our architecture is designed so that no single point of failure can bring the system down.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="dark:hidden">
              <UptimeArchitectureDiagram />
            </div>
            <div className="hidden dark:block bg-gray-800 p-6">
              <UptimeArchitectureDiagram />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-14 text-center">
            Reliability, Layer by Layer
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uptimeFeatures.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Proof */}
      <section className="py-20 bg-blue-50 dark:bg-blue-950/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Real-World Proof</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
              {[
                { value: "99.9%", label: "Uptime across all schools" },
                { value: "<30 min", label: "Disaster recovery time" },
                { value: "0", label: "Data losses since launch" },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <blockquote className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-left">
              <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed mb-4">
                &ldquo;Even during power fluctuations that are common here, DRAIS never lost a single attendance record. The offline caching is a game-changer for schools in our area.&rdquo;
              </p>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">— Ngobi Peter, General Director, Northgate Schools</div>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Still have concerns?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">We&apos;d love to walk you through a live reliability demo. No commitment required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg transition-colors">
              Book a Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/security" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Next: Security <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
