import TeamSection, { type TeamMemberItem } from "./TeamSection";
import { listTeam } from "@/lib/repositories";

export default async function TeamSectionServer() {
  const rows = await listTeam();
  const members: TeamMemberItem[] = rows.map((m) => {
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
  return <TeamSection members={members} />;
}
