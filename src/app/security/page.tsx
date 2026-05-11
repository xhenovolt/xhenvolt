"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  Eye,
  KeyRound,
  FileWarning,
  UserCheck,
  ServerCrash,
} from "lucide-react";

/* ─── Security Layers Diagram ─── */
function SecurityLayersDiagram() {
  return (
    <svg
      viewBox="0 0 800 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <rect width="800" height="500" rx="20" fill="url(#sec-bg)" />

      {/* Outer ring - Network */}
      <rect x="60" y="40" width="680" height="420" rx="30" fill="#10b981" opacity="0.06" stroke="#10b981" strokeWidth="2" strokeDasharray="10 5" />
      <text x="400" y="72" textAnchor="middle" fill="#10b981" fontWeight="700" fontSize="13">NETWORK ENCRYPTION (TLS 1.3)</text>

      {/* Middle ring - Application */}
      <rect x="110" y="95" width="580" height="310" rx="24" fill="#6366f1" opacity="0.06" stroke="#6366f1" strokeWidth="2" strokeDasharray="8 4" />
      <text x="400" y="122" textAnchor="middle" fill="#6366f1" fontWeight="700" fontSize="13">APPLICATION LAYER — Role-Based Access Control</text>

      {/* Inner ring - Data */}
      <rect x="160" y="145" width="480" height="210" rx="18" fill="#f59e0b" opacity="0.08" stroke="#f59e0b" strokeWidth="2" />
      <text x="400" y="172" textAnchor="middle" fill="#d97706" fontWeight="700" fontSize="13">DATA LAYER — AES-256 Encryption at Rest</text>

      {/* Core boxes inside */}
      <rect x="190" y="195" width="180" height="130" rx="14" fill="#2563eb" opacity="0.10" stroke="#2563eb" strokeWidth="1.5" />
      <text x="280" y="230" textAnchor="middle" fill="#2563eb" fontWeight="700" fontSize="13">Biometric Templates</text>
      <text x="280" y="255" textAnchor="middle" fill="#64748b" fontSize="11">Hashed • Non-reversible</text>
      <text x="280" y="275" textAnchor="middle" fill="#64748b" fontSize="11">Raw fingerprints</text>
      <text x="280" y="290" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="700">NEVER stored</text>

      <rect x="430" y="195" width="180" height="130" rx="14" fill="#7c3aed" opacity="0.10" stroke="#7c3aed" strokeWidth="1.5" />
      <text x="520" y="230" textAnchor="middle" fill="#7c3aed" fontWeight="700" fontSize="13">Student Records</text>
      <text x="520" y="255" textAnchor="middle" fill="#64748b" fontSize="11">Encrypted at rest</text>
      <text x="520" y="275" textAnchor="middle" fill="#64748b" fontSize="11">Access-controlled</text>
      <text x="520" y="295" textAnchor="middle" fill="#64748b" fontSize="11">Audit-logged</text>

      {/* Audit log bar */}
      <rect x="160" y="380" width="480" height="50" rx="12" fill="#0891b2" opacity="0.08" stroke="#0891b2" strokeWidth="1.5" />
      <text x="400" y="410" textAnchor="middle" fill="#0891b2" fontWeight="700" fontSize="12">AUDIT LOG — Every access event recorded &amp; timestamped</text>

      <defs>
        <linearGradient id="sec-bg" x1="0" y1="0" x2="800" y2="500">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const securityLayers = [
  { icon: <Lock className="w-6 h-6" />, title: "TLS 1.3 In-Transit Encryption", description: "Every request between the school, the biometric device, and our servers is encrypted with the latest transport-layer security." },
  { icon: <KeyRound className="w-6 h-6" />, title: "AES-256 At-Rest Encryption", description: "All data stored in our databases — student records, attendance logs, reports — is encrypted with industry-standard AES-256." },
  { icon: <Eye className="w-6 h-6" />, title: "Biometric Template Hashing", description: "Fingerprint scans are converted into irreversible mathematical templates. The raw image is discarded immediately — it can never be reconstructed." },
  { icon: <UserCheck className="w-6 h-6" />, title: "Role-Based Access Control", description: "Administrators, teachers, and parents each see only the data relevant to their role. No one gets more access than they need." },
  { icon: <FileWarning className="w-6 h-6" />, title: "Complete Audit Logging", description: "Every login, data view, and modification is logged with timestamps and user identity — giving schools full accountability." },
  { icon: <ServerCrash className="w-6 h-6" />, title: "Data Residency & Compliance", description: "School data stays in region-appropriate servers. We comply with relevant data-protection regulations and school policies." },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-emerald-600 via-teal-700 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white rounded-full -top-48 -left-32" />
          <div className="absolute w-[300px] h-[300px] bg-emerald-300 rounded-full bottom-0 right-0" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6">
          <Link href="/#objections" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to all questions
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            &ldquo;Is student biometric data safe?&rdquo;
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-xl md:text-2xl text-white/85 max-w-3xl leading-relaxed">
            Absolutely. DRAIS encrypts everything end-to-end, never stores raw fingerprints, and gives schools full control over who accesses what.
          </motion.p>
        </div>
      </section>

      {/* Security Layers Diagram */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Defense in Depth</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
              Multiple overlapping security layers ensure that even if one layer is compromised, your data remains protected.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="dark:hidden">
              <SecurityLayersDiagram />
            </div>
            <div className="hidden dark:block bg-gray-800 p-6">
              <SecurityLayersDiagram />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-14 text-center">
            Security at Every Level
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityLayers.map((layer, i) => (
              <motion.div key={layer.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                  {layer.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{layer.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{layer.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key promise */}
      <section className="py-20 bg-emerald-50 dark:bg-emerald-950/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <ShieldCheck className="w-16 h-16 mx-auto text-emerald-600 dark:text-emerald-400 mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Our Data Promise</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Raw fingerprint images are <strong>never stored</strong>. Only irreversible mathematical templates are retained. Even if our database were somehow breached, no one could reconstruct a student&apos;s fingerprint.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { value: "0", label: "Raw fingerprints stored" },
                { value: "AES-256", label: "Encryption standard" },
                { value: "100%", label: "Access events logged" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">{s.value}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Want a security walkthrough?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">We can show you exactly how data flows and where it&apos;s protected — live.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg transition-colors">
              Book a Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/device-integration" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Next: Device Integration <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
