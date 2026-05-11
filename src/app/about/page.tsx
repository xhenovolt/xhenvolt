import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { listTeam, getSeoMetadata } from "@/lib/repositories";
import type { TeamMemberItem } from "../../components/TeamSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/about");
  if (!seo) {
    return {
      title: "About Xhenvolt Uganda | Tech Company Building Digital Africa",
      description:
        "Xhenvolt is a Ugandan technology company founded in June 2025. We build DRAIS, Jeton, Xhaira, Consty and custom software for institutions across Uganda.",
      alternates: { canonical: "https://xhenvolt.com/about" },
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

export default async function Page() {
  const rows = await listTeam();
  const teamMembers: TeamMemberItem[] = rows.map((m) => {
    const socials = (m.socials ?? {}) as Record<string, string | undefined>;
    return {
      name: m.name,
      role: m.role,
      bio: m.bio ?? "",
      specialties: (m.specialties as string[] | null) ?? [],
      social: {
        linkedin: socials.linkedin,
        twitter: socials.twitter,
        github: socials.github,
      },
    };
  });
  return <AboutClient teamMembers={teamMembers} />;
}
