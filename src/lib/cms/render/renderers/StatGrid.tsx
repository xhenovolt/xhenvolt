import { listStatistics } from "@/lib/repositories";
import type { SectionRenderProps } from "../registry";

interface StatGridContent {
  scope?: string;
  /** If set, only stats whose key is in this array are shown, in this order. */
  keys?: string[];
}

export default async function StatGridRenderer({
  title,
  subtitle,
  content,
}: SectionRenderProps) {
  const c = (content as StatGridContent) ?? {};
  const all = await listStatistics(c.scope);
  const items = c.keys
    ? c.keys
        .map((k) => all.find((s) => s.key === k))
        .filter((s): s is NonNullable<typeof s> => Boolean(s))
    : all;

  if (items.length === 0) return null;

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((s) => (
            <div
              key={s.id}
              className="text-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {s.value}
                <span className="text-gray-500">{s.suffix ?? ""}</span>
              </div>
              <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
