import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { listSystems } from "@/lib/repositories";
import type { SectionRenderProps } from "../registry";

interface SystemGridContent {
  flagshipOnly?: boolean;
  limit?: number;
}

export default async function SystemGridRenderer({
  title,
  subtitle,
  content,
}: SectionRenderProps) {
  const c = (content as SystemGridContent) ?? {};
  let systems = await listSystems();
  if (c.flagshipOnly) systems = systems.filter((s) => Boolean(s.isFlagship));
  if (c.limit) systems = systems.slice(0, c.limit);
  if (systems.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systems.map((s) => {
            const highlights = Array.isArray(s.highlights) ? (s.highlights as string[]) : [];
            const external = Boolean(s.externalUrl);
            return (
              <article
                key={s.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {s.name}
                  </h3>
                  {s.tagline && (
                    <span className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                      {s.tagline.split(" ").slice(0, 3).join(" ")}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                  {s.description}
                </p>
                {highlights.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {highlights.slice(0, 5).map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {external && s.externalUrl && (
                  <Link
                    href={s.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
                  >
                    Visit {new URL(s.externalUrl).hostname}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
