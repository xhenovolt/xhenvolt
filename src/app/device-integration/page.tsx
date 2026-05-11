"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Fingerprint,
  MonitorSmartphone,
  RefreshCcw,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Wifi,
} from "lucide-react";

/* ─── Device Flow Diagram ─── */
function DeviceFlowDiagram() {
  return (
    <svg
      viewBox="0 0 800 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <rect width="800" height="380" rx="20" fill="url(#dev-bg)" />

      {/* Step 1 — Fingerprint Device */}
      <rect x="30" y="65" width="155" height="120" rx="16" fill="#9333ea" opacity="0.12" stroke="#9333ea" strokeWidth="2" />
      <text x="107" y="100" textAnchor="middle" fill="#9333ea" fontWeight="700" fontSize="13">Biometric</text>
      <text x="107" y="118" textAnchor="middle" fill="#9333ea" fontWeight="700" fontSize="13">Device</text>
      <text x="107" y="145" textAnchor="middle" fill="#64748b" fontSize="10">Student places finger</text>
      <text x="107" y="162" textAnchor="middle" fill="#64748b" fontSize="10">Template generated</text>

      {/* Arrow 1 */}
      <line x1="185" y1="125" x2="245" y2="125" stroke="#9333ea" strokeWidth="2" />
      <polygon points="243,120 253,125 243,130" fill="#9333ea" />
      <text x="215" y="115" textAnchor="middle" fill="#9333ea" fontSize="9" fontWeight="600">USB/TCP</text>

      {/* Step 2 — Local Cache */}
      <rect x="255" y="65" width="140" height="120" rx="16" fill="#f59e0b" opacity="0.12" stroke="#f59e0b" strokeWidth="2" />
      <text x="325" y="100" textAnchor="middle" fill="#d97706" fontWeight="700" fontSize="13">Local Cache</text>
      <text x="325" y="130" textAnchor="middle" fill="#64748b" fontSize="10">Stores scan locally</text>
      <text x="325" y="148" textAnchor="middle" fill="#64748b" fontSize="10">if network is down</text>
      <text x="325" y="166" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">✓ No data lost</text>

      {/* Arrow 2 */}
      <line x1="395" y1="125" x2="455" y2="125" stroke="#f59e0b" strokeWidth="2" />
      <polygon points="453,120 463,125 453,130" fill="#f59e0b" />
      <text x="425" y="115" textAnchor="middle" fill="#d97706" fontSize="9" fontWeight="600">Sync</text>

      {/* Step 3 — DRAIS Server */}
      <rect x="465" y="65" width="140" height="120" rx="16" fill="#2563eb" opacity="0.12" stroke="#2563eb" strokeWidth="2" />
      <text x="535" y="100" textAnchor="middle" fill="#2563eb" fontWeight="700" fontSize="13">DRAIS Server</text>
      <text x="535" y="130" textAnchor="middle" fill="#64748b" fontSize="10">Validates identity</text>
      <text x="535" y="148" textAnchor="middle" fill="#64748b" fontSize="10">Records attendance</text>
      <text x="535" y="166" textAnchor="middle" fill="#64748b" fontSize="10">Triggers SMS</text>

      {/* Arrow 3 */}
      <line x1="605" y1="125" x2="635" y2="125" stroke="#2563eb" strokeWidth="2" />
      <polygon points="633,120 643,125 633,130" fill="#2563eb" />

      {/* Step 4 — Dashboard */}
      <rect x="645" y="65" width="125" height="120" rx="16" fill="#0891b2" opacity="0.12" stroke="#0891b2" strokeWidth="2" />
      <text x="707" y="100" textAnchor="middle" fill="#0891b2" fontWeight="700" fontSize="13">Dashboard</text>
      <text x="707" y="130" textAnchor="middle" fill="#64748b" fontSize="10">Real-time view</text>
      <text x="707" y="148" textAnchor="middle" fill="#64748b" fontSize="10">for admins</text>
      <text x="707" y="166" textAnchor="middle" fill="#64748b" fontSize="10">& teachers</text>

      {/* Failure scenario */}
      <rect x="140" y="230" width="520" height="110" rx="18" fill="#ef4444" opacity="0.06" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="8 4" />
      <text x="400" y="260" textAnchor="middle" fill="#ef4444" fontWeight="700" fontSize="13">DEVICE FAILURE SCENARIO</text>
      <text x="400" y="285" textAnchor="middle" fill="#64748b" fontSize="11">1. Device malfunction detected → automatic alert sent to Xhenvolt team</text>
      <text x="400" y="305" textAnchor="middle" fill="#64748b" fontSize="11">2. Manual attendance mode activated instantly — no disruption to classes</text>
      <text x="400" y="325" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="600">3. Same-day replacement dispatched → data auto-syncs on reconnection</text>

      <defs>
        <linearGradient id="dev-bg" x1="0" y1="0" x2="800" y2="380">
          <stop offset="0%" stopColor="#faf5ff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const integrationFeatures = [
  { icon: <Fingerprint className="w-6 h-6" />, title: "Plug-and-Play Hardware", description: "DRAIS supports major biometric scanners out of the box. We configure, test, and install the devices at your school — staff just supervise." },
  { icon: <Wifi className="w-6 h-6" />, title: "USB & Network Modes", description: "Devices connect via USB for local setups or TCP/IP for networked campuses. Both modes support offline caching automatically." },
  { icon: <RefreshCcw className="w-6 h-6" />, title: "Auto-Sync on Reconnection", description: "If a device goes offline, all cached attendance data syncs automatically the moment connectivity is restored. Zero manual intervention." },
  { icon: <AlertTriangle className="w-6 h-6" />, title: "Instant Failure Alerts", description: "If a device stops responding, our monitoring triggers an alert. Your school and our team are notified simultaneously." },
  { icon: <Wrench className="w-6 h-6" />, title: "Same-Day Replacement", description: "We maintain spare device inventory for every region. If a scanner fails, we dispatch a replacement the same day." },
  { icon: <MonitorSmartphone className="w-6 h-6" />, title: "Manual Override Mode", description: "While a device is being replaced, staff can record attendance via the DRAIS web interface. Records merge seamlessly once hardware returns." },
];

export default function DeviceIntegrationPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white rounded-full -top-48 right-0" />
          <div className="absolute w-[350px] h-[350px] bg-pink-300 rounded-full bottom-0 -left-20" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6">
          <Link href="/#objections" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to all questions
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            &ldquo;What if the fingerprint device stops working?&rdquo;
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-xl md:text-2xl text-white/85 max-w-3xl leading-relaxed">
            You switch to manual mode instantly. We ship a replacement the same day. And every record auto-syncs once it&apos;s plugged in.
          </motion.p>
        </div>
      </section>

      {/* Flow Diagram */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">How the Device Pipeline Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
              From finger scan to dashboard — with a built-in safety net at every step.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="dark:hidden">
              <DeviceFlowDiagram />
            </div>
            <div className="hidden dark:block bg-gray-800 p-6">
              <DeviceFlowDiagram />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-14 text-center">
            Built for Real-World Conditions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrationFeatures.map((feat, i) => (
              <motion.div key={feat.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Failure timeline */}
      <section className="py-20 bg-purple-50 dark:bg-purple-950/20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">
            What Happens When a Device Fails
          </motion.h2>
          <div className="space-y-6">
            {[
              { time: "0 min", title: "Device malfunction detected", desc: "Monitoring system flags the device. Alert sent to Xhenvolt support team.", color: "bg-red-500" },
              { time: "< 1 min", title: "Manual mode activated", desc: "Staff switch to web-based attendance entry. Classes continue uninterrupted.", color: "bg-amber-500" },
              { time: "< 4 hrs", title: "Replacement dispatched", desc: "A pre-configured spare device is sent from regional inventory.", color: "bg-blue-500" },
              { time: "Same day", title: "New device installed & synced", desc: "Manual records + cached data merge automatically. No duplicates, no gaps.", color: "bg-emerald-500" },
            ].map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }} className="flex gap-5 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${step.color} shadow-lg`} />
                  {i < 3 && <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600" />}
                </div>
                <div className="pb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{step.time}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Want to see the hardware in action?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">We&apos;ll bring a device to your school for a free hands-on demo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-lg transition-colors">
              Book a Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/training" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Next: Training <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
