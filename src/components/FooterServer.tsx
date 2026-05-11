import Footer, { type FooterContact, type FooterLinkItem, type FooterSocial } from "./Footer";
import {
  listFooterLinks,
  listSocialLinks,
  getSetting,
} from "@/lib/repositories";

interface ContactSetting {
  address?: string;
  phones?: string[];
  email?: string;
}

const FALLBACK: FooterContact = {
  address: "Bulubandi, Iganga, Uganda",
  phones: ["0741 341 483", "0760 700 954", "0745 726 350"],
  email: "drais@xhenvolt.com",
};

export default async function FooterServer() {
  const [links, socials, contactSetting] = await Promise.all([
    listFooterLinks(),
    listSocialLinks(),
    getSetting<ContactSetting>("contact", {}),
  ]);

  const columns: Record<string, FooterLinkItem[]> = {};
  for (const l of links) {
    if (!columns[l.column]) columns[l.column] = [];
    columns[l.column].push({
      name: l.label,
      href: l.href,
      external: l.isExternal,
    });
  }

  const contact: FooterContact = {
    address: contactSetting.address ?? FALLBACK.address,
    phones:
      contactSetting.phones && contactSetting.phones.length > 0
        ? contactSetting.phones
        : FALLBACK.phones,
    email: contactSetting.email ?? FALLBACK.email,
  };

  const socialProps: FooterSocial[] = socials.map((s) => ({
    platform: s.platform,
    label: s.label,
    href: s.href,
    icon: s.icon,
  }));

  return <Footer columns={columns} contact={contact} socials={socialProps} />;
}
