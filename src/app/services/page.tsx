import type { Metadata } from "next";
import ServicesClient, {
  type ServiceSystem,
  type ProofPoint,
} from "./ServicesClient";
import {
  listSystems,
  listStatistics,
  getSeoMetadata,
} from "@/lib/repositories";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/services");
  if (!seo) {
    return {
      title:
        "Xhenvolt Solutions | DRAIS, Jeton, Consty, Xhaira & Custom Software Uganda",
      description:
        "Xhenvolt delivers DRAIS, Jeton, Consty, Xhaira and custom digital solutions for institutions across Uganda.",
      alternates: { canonical: "https://xhenvolt.com/services" },
    };
  }
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ?? undefined,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      type: "website",
    },
  };
}

const COLOR_BY_SLUG: Record<string, string> = {
  drais: "from-blue-600 to-indigo-600",
  jeton: "from-emerald-600 to-teal-600",
  consty: "from-amber-500 to-orange-500",
  xhaira: "from-violet-600 to-purple-600",
  sentra: "from-red-500 to-rose-500",
  lypha: "from-sky-500 to-cyan-500",
};

const EMOJI_BY_SLUG: Record<string, string> = {
  drais: "🎓",
  jeton: "💳",
  consty: "🏗️",
  xhaira: "🛡️",
  sentra: "🛒",
  lypha: "💊",
};

export default async function Page() {
  const [systemRows, statRows] = await Promise.all([
    listSystems(),
    listStatistics(),
  ]);

  const flagshipFirst = [...systemRows].sort((a, b) => {
    const af = Boolean(a.isFlagship);
    const bf = Boolean(b.isFlagship);
    if (af !== bf) return af ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  const systems: ServiceSystem[] = flagshipFirst.map((s) => {
    const highlights = Array.isArray(s.highlights) ? (s.highlights as string[]) : [];
    const external = Boolean(s.externalUrl);
    return {
      name: s.name,
      emoji: EMOJI_BY_SLUG[s.slug] ?? "✨",
      color: COLOR_BY_SLUG[s.slug] ?? "from-pink-500 to-rose-500",
      badge: s.tagline ?? s.category ?? "",
      description: s.description,
      highlights,
      cta: external
        ? {
            label: `Visit ${new URL(s.externalUrl!).hostname}`,
            href: s.externalUrl!,
            external: true,
          }
        : { label: "Request a Demo", href: "/contact", external: false },
    };
  });

  const proofPoints: ProofPoint[] = statRows
    .filter((s) =>
      ["schools_drais", "orgs_served", "systems_deployed", "uptime"].includes(
        s.key,
      ),
    )
    .slice(0, 4)
    .map((s) => ({
      stat: `${s.value}${s.suffix ?? ""}`,
      label: s.label,
    }));

  return <ServicesClient systems={systems} proofPoints={proofPoints} />;
}
