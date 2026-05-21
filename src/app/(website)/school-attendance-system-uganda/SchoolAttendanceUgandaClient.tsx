"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Fingerprint,
  MessageSquare,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  ArrowRight,
  Users,
  School,
  ChevronDown,
  ChevronUp,
  Shield,
  TrendingDown,
  TrendingUp,
  Star,
} from "lucide-react";

const painPoints = [
  {
    icon: <Clock className="w-7 h-7 text-red-500" />,
    title: "35 Minutes Wasted Daily Per Class",
    description:
      "Teachers manually calling names in a class of 40+ students wastes critical instruction time — that's over 3 hours per week per teacher.",
  },
  {
    icon: <AlertTriangle className="w-7 h-7 text-orange-500" />,
    title: "Falsified Attendance Records",
    description:
      "Students sign for absent classmates. Registers get altered. School owners have no way to know the real daily head count without visiting every classroom.",
  },
  {
    icon: <TrendingDown className="w-7 h-7 text-red-500" />,
    title: "Parents Learn Too Late",
    description:
      "A student skips school for a week. Parents only find out at parent's day — months later. By then, the student has fallen behind and trust is broken.",
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-orange-500" />,
    title: "No Data, No Decisions",
    description:
      "Without attendance analytics, head teachers cannot identify chronic absentees early or measure the effectiveness of interventions.",
  },
];

const draísFeatures = [
  {
    icon: <Fingerprint className="w-8 h-8 text-blue-600" />,
    title: "Biometric Fingerprint Attendance",
    description:
      "Students check in with a fingerprint scan. Impossible to fake, takes under 2 seconds per student. Works offline when power is interrupted.",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-green-600" />,
    title: "Instant SMS Parent Alerts",
    description:
      "Parent receives an SMS the moment their child arrives at school — or a warning SMS if their child is absent by 9 AM. No more surprises.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
    title: "Real-Time Attendance Dashboard",
    description:
      "Head teachers see live attendance percentages per class, per grade, per student — from any device, any location, in real-time.",
  },
  {
    icon: <Clock className="w-8 h-8 text-indigo-600" />,
    title: "Automated PDF Reports",
    description:
      "Weekly and monthly attendance reports generated automatically. No manual compilation. Print-ready for board meetings or ministry inspections.",
  },
  {
    icon: <Shield className="w-8 h-8 text-teal-600" />,
    title: "Works on Low Infrastructure",
    description:
      "DRAIS works on standard Uganda internet connections or fully offline. Data syncs automatically when connectivity is restored.",
  },
  {
    icon: <Users className="w-8 h-8 text-orange-600" />,
    title: "Multi-School Management",
    description:
      "Running a chain of schools? Monitor attendance across all campuses from one dashboard. Perfect for education groups.",
  },
];

const deployments = [
  {
    name: "Excel Islamic Schools",
    location: "Uganda",
    result: "100% accurate attendance records across multiple campuses",
    contact: "Sheikh Hassan Mwaita, Director",
  },
  {
    name: "Northgate Schools",
    location: "Uganda",
    result: "Eliminated falsified registers; parent trust improved significantly",
    contact: "Ngobi Peter, General Director",
  },
  {
    name: "Hill Side Ways Nursery and Primary School",
    location: "Uganda",
    result: "Attendance monitoring system fully deployed with biometric devices",
    contact: "School Administration",
  },
  {
    name: "Ibun Baz Girls Secondary School",
    location: "Uganda",
    result: "Live biometric attendance tracking operational",
    contact: "School Administration",
  },
];

const comparisonData = [
  {
    category: "Daily Time Cost",
    manual: "35 min/class (manual roll-call)",
    drais: "Under 2 minutes (biometric scan)",
    winner: "drais",
  },
  {
    category: "Accuracy",
    manual: "Prone to proxy signing & forgery",
    drais: "100% — biometric cannot be faked",
    winner: "drais",
  },
  {
    category: "Parent Awareness",
    manual: "Parents unaware until term ends",
    drais: "SMS alert within minutes of absence",
    winner: "drais",
  },
  {
    category: "Reporting",
    manual: "Manual compilation, hours of work",
    drais: "Auto-generated in seconds",
    winner: "drais",
  },
  {
    category: "Data Security",
    manual: "Paper registers, easily lost/altered",
    drais: "Encrypted cloud + offline backup",
    winner: "drais",
  },
];

const faqs = [
  {
    q: "How much does DRAIS cost for a Ugandan school?",
    a: "DRAIS pricing is affordable and designed specifically for Ugandan schools. We offer flexible payment plans — monthly, termly, or annual. Contact us for a personalized quote based on your school size. Most schools recover the cost within one term through improved parent trust and reduced administrative overhead.",
  },
  {
    q: "Do I need internet to use the DRAIS attendance system?",
    a: "No. DRAIS works fully offline. Biometric devices record attendance locally and sync to the cloud automatically when internet is available. This makes DRAIS reliable even in areas with unstable connectivity — a critical design decision for Ugandan schools.",
  },
  {
    q: "How long does installation take?",
    a: "A standard school installation takes 1–2 days. This includes device setup, student fingerprint enrollment, staff training, and system configuration. Our team handles the entire process with zero disruption to school operations.",
  },
  {
    q: "Can DRAIS send SMS to parents automatically?",
    a: "Yes. DRAIS is integrated with SMS gateways. Parents receive a confirmation SMS when their child arrives at school and an alert SMS if their child is marked absent. You control the message templates and timing.",
  },
  {
    q: "Does DRAIS work for primary schools and secondary schools?",
    a: "Yes. DRAIS is used by both primary and secondary schools in Uganda. The system adapts to different class structures, enrollment sizes, and grading systems. We also support Islamic school structures with separate tracking for boys and girls sections.",
  },
  {
    q: "What biometric devices does DRAIS support?",
    a: "DRAIS integrates with industry-standard fingerprint scanners. We supply compatible devices or can integrate with devices you already own. The system also supports RFID cards as an alternative to fingerprint for very young children.",
  },
  {
    q: "Can I track attendance across multiple school branches?",
    a: "Absolutely. DRAIS has multi-school architecture built in. Education groups and chains with multiple campuses can monitor attendance across all branches from a single dashboard with separate reports per campus.",
  },
];

export default function SchoolAttendanceUgandaClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "DRAIS School Attendance System",
        applicationCategory: "EducationApplication",
        operatingSystem: "Web, Android",
        description:
          "DRAIS is Uganda's leading school attendance and management system with biometric integration, SMS parent alerts, and real-time analytics dashboards.",
        offers: {
          "@type": "Offer",
          priceCurrency: "UGX",
          availability: "https://schema.org/InStock",
        },
        provider: {
          "@type": "Organization",
          name: "Xhenvolt Uganda",
          url: "https://xhenvolt.com",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bulubandi, Iganga",
            addressCountry: "UG",
          },
          telephone: "+256741341483",
          email: "drais@xhenvolt.com",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "35",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">

        {/* Hero Section */}
        <section className="pt-28 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  #1 School Attendance System in Uganda
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                  Stop Wasting 35 Minutes Per Class on{" "}
                  <span className="text-blue-600">Manual Attendance</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  DRAIS is Uganda&apos;s most trusted school attendance system. Biometric fingerprint
                  scanning, instant SMS parent alerts, and real-time dashboards — trusted by 35+
                  Ugandan institutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://wa.me/256741341483?text=Hello%20Xhenvolt!%20I%20want%20to%20request%20a%20free%20DRAIS%20demo%20for%20my%20school."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
                  >
                    Request Free Demo
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a
                    href="tel:+256741341483"
                    className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold py-4 px-8 rounded-xl text-lg transition-colors hover:bg-blue-50"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
                <div className="flex flex-wrap gap-6 mt-8">
                  {[
                    "31+ Schools Using DRAIS",
                    "100% Accurate Records",
                    "Works Offline",
                    "SMS Parent Alerts",
                  ].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {badge}
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
                  <h3 className="text-xl font-bold mb-6 text-center">
                    Live Attendance Dashboard
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Senior 1A", present: 42, total: 45, pct: 93 },
                      { label: "Senior 2B", present: 38, total: 40, pct: 95 },
                      { label: "Primary 6", present: 55, total: 60, pct: 92 },
                      { label: "Primary 3", present: 48, total: 50, pct: 96 },
                    ].map((cls) => (
                      <div key={cls.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cls.label}</span>
                          <span>{cls.present}/{cls.total} present</span>
                        </div>
                        <div className="bg-white/20 rounded-full h-2">
                          <div
                            className="bg-green-400 h-2 rounded-full"
                            style={{ width: `${cls.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-green-400">94%</div>
                      <div className="text-sm text-white/70">Overall Attendance</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-300">12</div>
                      <div className="text-sm text-white/70">SMS Alerts Sent</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Why Manual Attendance is Failing Ugandan Schools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Every day, thousands of Ugandan schools lose time, money, and parent trust because of
                manual attendance systems. These are the hidden costs you may not be counting.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              {painPoints.map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-red-100 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{point.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{point.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DRAIS Features */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                How DRAIS Solves Attendance in Ugandan Schools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Built specifically for African school infrastructure — works with or without stable
                electricity and internet.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draísFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Manual vs DRAIS Comparison */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Manual Attendance vs DRAIS — The Honest Comparison
              </h2>
            </motion.div>
            <div className="overflow-x-auto rounded-2xl shadow">
              <table className="w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-semibold">
                      Category
                    </th>
                    <th className="text-left p-4 text-red-600 font-semibold">Manual System</th>
                    <th className="text-left p-4 text-green-600 font-semibold">DRAIS System</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr
                      key={row.category}
                      className={i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"}
                    >
                      <td className="p-4 font-medium text-gray-900 dark:text-white border-b dark:border-gray-700">
                        {row.category}
                      </td>
                      <td className="p-4 text-red-600 dark:text-red-400 text-sm border-b dark:border-gray-700">
                        ✗ {row.manual}
                      </td>
                      <td className="p-4 text-green-600 dark:text-green-400 text-sm border-b dark:border-gray-700">
                        ✓ {row.drais}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Real Deployments */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Schools Using DRAIS Right Now
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Real schools. Real results. Not pilots — live deployments.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              {deployments.map((dep, i) => (
                <motion.div
                  key={dep.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border-l-4 border-blue-500"
                >
                  <div className="flex items-start gap-3">
                    <School className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{dep.name}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{dep.location}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{dep.result}</p>
                      <p className="text-xs text-gray-400 mt-2">{dep.contact}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                The Attendance Crisis in African Schools
              </h2>
              <p className="text-lg text-blue-100 max-w-3xl mx-auto">
                The data makes a compelling case for why digital attendance is no longer optional for
                serious schools.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { stat: "42%", label: "of African students miss 10+ days per year without detection", source: "UNESCO 2023" },
                { stat: "3hrs", label: "wasted weekly per teacher on manual attendance calls", source: "Internal Analysis" },
                { stat: "67%", label: "of Ugandan parents want real-time attendance updates", source: "DRAIS Survey" },
                { stat: "35+", label: "Ugandan institutions already using DRAIS attendance", source: "Xhenvolt Data" },
              ].map((item, i) => (
                <motion.div
                  key={item.stat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-extrabold text-white mb-2">{item.stat}</div>
                  <div className="text-blue-100 text-sm leading-relaxed">{item.label}</div>
                  <div className="text-blue-200/60 text-xs mt-2">{item.source}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Long-Form Article Content */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                Why Ugandan Schools Need a Digital Attendance System Now
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Across Uganda, the average class teacher spends 30–40 minutes every single school day
                calling names from a paper register. In a school with 50 teachers, that is 25–33
                teacher-hours wasted per day — time that should be spent teaching. Over a full school
                year, that amounts to over 4,500 hours of lost instruction time per school. This is not
                a small problem.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Beyond time, manual attendance creates a security vacuum. Students who know a teacher is
                slow to mark attendance exploit the gap. Proxy signing — where one student signs for
                absent classmates — is endemic in Ugandan secondary schools. By the time a parent
                discovers their child has been absent for three weeks, irreversible academic damage has
                been done.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                What Makes DRAIS Different from Generic School Software
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Most school software sold in Uganda is adapted from Western markets. It assumes reliable
                high-speed internet, consistent electricity, and large IT budgets. DRAIS was built from
                scratch for African school conditions:
              </p>
              <ul className="list-none space-y-3 mb-6">
                {[
                  "Fully functional offline — biometric devices store data locally and sync when connected",
                  "Designed for Uganda&apos;s school calendar (three-term system, holiday management)",
                  "Affordable pricing structured around Ugandan school fee cycles",
                  "Training and support by Ugandan team who understand local context",
                  "Works with standard fingerprint scanners — no expensive proprietary hardware required",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                The Cost of Doing Nothing
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Consider a school with 400 students and 20 teachers. With manual attendance, the school
                loses approximately 700 teacher-hours per term to roll-call. If teacher salaries average
                UGX 800,000/month, that is UGX 1.4 million in wasted salary costs per term — money you
                are already paying but getting no value from. DRAIS costs a fraction of that.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Beyond cost, consider the reputational damage when parents send their child to school
                trusting that you know where their child is — and you don&apos;t. In competitive school
                markets like Kampala, Wakiso, and Jinja, parents choose schools based on trust.
                Automated attendance SMS alerts are increasingly a deciding factor for parents choosing
                between two otherwise equal schools.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                How to Get DRAIS in Your School
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Getting DRAIS deployed is a simple three-step process:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                <li>Contact us via WhatsApp or phone for a free consultation (30 minutes)</li>
                <li>We visit your school, assess your setup, and provide a custom proposal</li>
                <li>Installation takes 1–2 days; your school is live within the same week</li>
              </ol>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Everything school owners and administrators ask before adopting DRAIS.
              </p>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t dark:border-gray-700">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Ready to Automate Attendance in Your School?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join 35+ Ugandan schools that have eliminated manual attendance. Book a free demo
                today — we come to your school.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/256741341483?text=Hello%20Xhenvolt!%20I%20want%20to%20test%20DRAIS%20in%20my%20school."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
                >
                  WhatsApp for Free Demo
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="tel:+256741341483"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  0741 341 483
                </a>
              </div>
              <p className="text-sm text-gray-400 mt-6">
                Or explore:{" "}
                <Link href="/biometric-attendance-uganda" className="text-blue-600 hover:underline">
                  Biometric Attendance Uganda
                </Link>{" "}
                ·{" "}
                <Link href="/school-management-system-uganda" className="text-blue-600 hover:underline">
                  School Management System Uganda
                </Link>{" "}
                ·{" "}
                <Link href="/drais-attendance-system" className="text-blue-600 hover:underline">
                  DRAIS Product Page
                </Link>
              </p>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}
