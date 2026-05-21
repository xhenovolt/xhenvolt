import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SectionRenderProps } from "../registry";

interface HeroContent {
  eyebrow?: string | null;
  tags?: string[];
  ctaPrimary?: { label: string; href: string } | null;
  ctaSecondary?: { label: string; href: string } | null;
  backgroundUrl?: string | null;
}

export default function HeroRenderer({
  title,
  subtitle,
  content,
}: SectionRenderProps) {
  const c = (content as HeroContent) ?? {};
  return (
    <section className="pt-32 pb-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          {c.eyebrow && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-6">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {c.eyebrow}
              </span>
            </div>
          )}
          {title && (
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}
          {c.tags && c.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            {c.ctaPrimary && (
              <Link
                href={c.ctaPrimary.href}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg gap-2"
                {...(c.ctaPrimary.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {c.ctaPrimary.label}
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            {c.ctaSecondary && (
              <Link
                href={c.ctaSecondary.href}
                className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-semibold gap-2"
              >
                {c.ctaSecondary.label}
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
