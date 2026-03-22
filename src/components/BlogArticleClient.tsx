"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, ChevronDown, ChevronUp, User, Calendar, Tag } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface ArticleSection {
  heading: string;
  content: string;
}

interface FAQ {
  q: string;
  a: string;
}

interface RelatedLink {
  text: string;
  href: string;
}

interface Article {
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  slug: string;
  sections: ArticleSection[];
  relatedLinks: RelatedLink[];
  faqs: FAQ[];
}

export default function BlogArticleClient({ article }: { article: Article }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.subtitle,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Xhenvolt Uganda",
      url: "https://xhenvolt.com",
    },
    datePublished: article.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://xhenvolt.com/blog/${article.slug}`,
    },
  };

  const faqLd = article.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <Navbar />

        {/* Article Header */}
        <header className="pt-28 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <Link href="/blog" className="text-sm text-blue-600 hover:underline">← Blog</Link>
                <span className="text-gray-300">/</span>
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                {article.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {article.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
                <span className="flex items-center gap-1"><User className="w-4 h-4" />{article.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{article.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readTime}</span>
              </div>
              {/* CTA Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-lg">Ready to see DRAIS in action?</p>
                    <p className="text-blue-100 text-sm">Get a free demo for your school — we come to you.</p>
                  </div>
                  <a
                    href="https://wa.me/256741341483?text=I%20read%20your%20blog%20and%20want%20a%20DRAIS%20demo%20for%20my%20school."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white text-blue-700 font-bold py-2 px-6 rounded-xl text-sm hover:bg-blue-50 flex-shrink-0"
                  >
                    Get Free Demo <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Article Content */}
        <article className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
              {article.sections.map((section, i) => (
                <motion.section
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="mb-10"
                >
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                    {section.heading}
                  </h2>
                  {section.content.split("\n\n").map((para, j) => (
                    <p key={j} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 last:mb-0">
                      {para}
                    </p>
                  ))}
                </motion.section>
              ))}
            </div>
          </div>
        </article>

        {/* FAQs */}
        {article.faqs.length > 0 && (
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {article.faqs.map((faq, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50"
                    >
                      <span>{faq.q}</span>
                      {openFaq === i ? <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t dark:border-gray-700">
                        <p className="pt-3">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Pages */}
        <section className="py-12 px-6 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">
              Explore More from Xhenvolt Uganda
            </h2>
            <div className="flex flex-wrap gap-3">
              {article.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-white dark:bg-gray-800 text-blue-600 border border-blue-200 dark:border-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                >
                  {link.text} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
              <Link
                href="/blog"
                className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                All Articles <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-extrabold mb-3">
              Transform Attendance at Your School
            </h2>
            <p className="text-blue-100 mb-6">
              DRAIS is already live in 35+ Ugandan schools. Join them.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/256741341483?text=I%20read%20your%20blog%20and%20want%20to%20get%20DRAIS%20for%20my%20school."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-3 px-6 rounded-xl text-sm hover:bg-blue-50"
              >
                WhatsApp for Demo <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/school-attendance-system-uganda"
                className="flex items-center justify-center gap-2 border-2 border-white/50 text-white font-bold py-3 px-6 rounded-xl text-sm hover:bg-white/10"
              >
                Learn About DRAIS
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
