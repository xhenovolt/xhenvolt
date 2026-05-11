"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "Why Ugandan Schools Are Switching to Digital Attendance Systems",
    excerpt: "Manual roll-call wastes 35+ minutes per class daily. Discover why hundreds of Ugandan schools are making the switch to automated attendance in 2026.",
    link: "/blog/why-ugandan-schools-are-switching-to-digital-attendance",
    date: "March 2026",
    readTime: "8 min read",
    category: "Education",
    featured: true,
  },
  {
    title: "Best Attendance System for Schools in Uganda (2026 Guide)",
    excerpt: "A comprehensive comparison of school attendance solutions — what to look for, what to avoid, and why DRAIS leads the market.",
    link: "/blog/best-attendance-system-for-schools-in-uganda-2026",
    date: "March 2026",
    readTime: "10 min read",
    category: "Reviews",
    featured: false,
  },
  {
    title: "How Biometric Attendance is Transforming African Schools",
    excerpt: "From Kenya to Uganda to Nigeria — biometric attendance is changing how African schools manage students.",
    link: "/blog/how-biometric-attendance-transforms-african-schools",
    date: "February 2026",
    readTime: "9 min read",
    category: "Technology",
    featured: false,
  },
  {
    title: "Manual vs Digital Attendance: True Cost Analysis for Ugandan Schools",
    excerpt: "What manual attendance actually costs your school in teacher time, admin hours, and parent trust.",
    link: "/blog/manual-vs-digital-attendance-cost-analysis",
    date: "February 2026",
    readTime: "7 min read",
    category: "Analysis",
    featured: false,
  },
  {
    title: "Top School Management Systems in Uganda (DRAIS Ranked #1)",
    excerpt: "An objective review of the top school management systems available in Uganda for 2026.",
    link: "/blog/top-school-management-systems-uganda",
    date: "January 2026",
    readTime: "12 min read",
    category: "Reviews",
    featured: false,
  },
  {
    title: "How to Automate Student Attendance Tracking Step by Step",
    excerpt: "A practical guide for school administrators ready to move from paper registers to automated biometric attendance.",
    link: "/blog/how-to-automate-student-attendance-tracking",
    date: "January 2026",
    readTime: "8 min read",
    category: "Guides",
    featured: false,
  },
  {
    title: "School ERP Uganda: Complete Guide for School Directors (2026)",
    excerpt: "What is a school ERP? Do you need one? Everything Ugandan school directors need to know.",
    link: "/blog/school-erp-uganda-complete-guide",
    date: "December 2025",
    readTime: "11 min read",
    category: "Guides",
    featured: false,
  },
  {
    title: "Fingerprint Attendance & School Security in Uganda",
    excerpt: "How biometric systems are improving security and protecting students in Ugandan schools.",
    link: "/blog/fingerprint-attendance-school-security-uganda",
    date: "December 2025",
    readTime: "7 min read",
    category: "Security",
    featured: false,
  },
  {
    title: "How to Reduce Student Absenteeism in Ugandan Schools",
    excerpt: "Proven strategies including automated alerts that actually reduce chronic absenteeism.",
    link: "/blog/reduce-absenteeism-schools-uganda",
    date: "November 2025",
    readTime: "8 min read",
    category: "Education",
    featured: false,
  },
  {
    title: "DRAIS vs Manual Attendance: A Ugandan School Case Study",
    excerpt: "A head teacher shares exactly what changed after switching from paper registers to DRAIS — in numbers.",
    link: "/blog/drais-vs-manual-attendance-comparison",
    date: "November 2025",
    readTime: "6 min read",
    category: "Case Studies",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  Education: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  Reviews: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Technology: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Analysis: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  Guides: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  Security: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "Case Studies": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
};

export default function BlogPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <main className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
      <div className="pt-24 md:pt-32 max-w-6xl mx-auto px-6">
        <section className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold px-4 py-2 rounded-full mb-4"
          >
            School Management · EdTech Africa · DRAIS
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4"
          >
            Insights for Ugandan School Leaders
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Expert articles on school attendance systems, biometric technology, and digital transformation in Ugandan education.
          </motion.p>
        </section>

        {/* Featured Post */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link href={featured.link} className="block group">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2 hover:shadow-xl transition-shadow">
              <div className="h-64 md:h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-8">
                <div className="text-center text-white">
                  <div className="text-6xl font-extrabold opacity-20 mb-4">DRAIS</div>
                  <div className="text-lg font-semibold">Featured Article</div>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit ${categoryColors[featured.category]}`}>
                  {featured.category}
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                </div>
                <span className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  Read Article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Grid */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <motion.div
              key={post.title}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              <div className="h-36 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <div className="text-4xl font-extrabold text-blue-300 dark:text-gray-500 opacity-50">DRAIS</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3 w-fit ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>
                  {post.category}
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                  <Link href={post.link} className="text-blue-600 dark:text-blue-300 hover:underline font-semibold text-sm flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="pb-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ready to implement digital attendance in your school?
          </p>
          <Link
            href="/school-attendance-system-uganda"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl"
          >
            Explore DRAIS Attendance System <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
