import Navbar, { type NavItem } from "./Navbar";
import { listNavigation } from "@/lib/repositories";

export default async function NavbarServer() {
  const rows = await listNavigation("primary");

  const parents = rows.filter((r) => !r.parentId);
  const childrenByParent = new Map<string, typeof rows>();
  for (const r of rows) {
    if (!r.parentId) continue;
    if (!childrenByParent.has(r.parentId)) childrenByParent.set(r.parentId, []);
    childrenByParent.get(r.parentId)!.push(r);
  }

  const items: NavItem[] = parents.map((p) => {
    const kids = childrenByParent.get(p.id) ?? [];
    return {
      name: p.label,
      href: p.href,
      isExternal: p.isExternal,
      dropdown:
        kids.length > 0
          ? kids.map((k) => ({ name: k.label, href: k.href, isExternal: k.isExternal }))
          : undefined,
    };
  });

  return <Navbar items={items} />;
}
