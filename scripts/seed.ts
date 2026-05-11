import "dotenv/config";
import { config } from "dotenv";
import { neonClient, type NeonSqlResult } from "./neon-http";

config({ path: ".env.local" });

const client = neonClient(process.env.DATABASE_URL!);

async function q<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<NeonSqlResult<T>> {
  return client.exec<T>(sql, params);
}

async function upsertReturningId(
  table: string,
  conflictCol: string,
  cols: string[],
  values: unknown[],
): Promise<string> {
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  const updates = cols
    .filter((c) => c !== conflictCol)
    .map((c) => `"${c}" = EXCLUDED."${c}"`)
    .join(", ");
  const sql = `
    INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(", ")})
    VALUES (${placeholders})
    ON CONFLICT ("${conflictCol}") DO UPDATE SET ${updates}
    RETURNING id
  `;
  const res = await q<{ id: string }>(sql, values);
  return res.rows[0].id;
}

async function clearTable(name: string): Promise<void> {
  await q(`DELETE FROM "${name}"`);
}

async function seedSettings() {
  console.log("seed: settings");
  const items: Array<[string, unknown, string]> = [
    [
      "contact",
      {
        phones: ["+256 741 341 483", "+256 760 700 954", "+256 745 726 350"],
        email: "drais@xhenvolt.com",
        secondaryEmail: "info@xhenvolt.com",
        address: "Bulubandi, Iganga, Uganda",
        hours: "Mon–Fri, 8:00 AM – 6:00 PM EAT",
      },
      "Primary contact info",
    ],
    [
      "whatsapp",
      {
        number: "256741341483",
        prefilledMessage:
          "Hello Xhenvolt! I'm interested in DRAIS school management system. Please tell me more.",
        tooltip:
          "Chat with us on WhatsApp. Get a free DRAIS demo for your school. We reply within minutes!",
      },
      "WhatsApp floating CTA config",
    ],
    [
      "branding",
      {
        companyName: "Xhenvolt",
        tagline: "Building real digital infrastructure for institutions.",
        foundedMonth: "June",
        foundedYear: 2025,
        country: "Uganda",
      },
      "Brand/identity facts",
    ],
    [
      "floating_ui",
      {
        order: ["announcement", "chatbot", "whatsapp", "scroll_top"],
        spacingPx: 16,
        bottomOffsetPx: 24,
        sideOffsetPx: 20,
        mobileBreakpointPx: 640,
      },
      "Stacking rules for floating buttons (chatbot, whatsapp, scroll top) to avoid overlap",
    ],
    [
      "ai_assistant",
      {
        name: "Xhenvolt AI",
        introMessage:
          "Hi! I'm Xhenvolt AI — ask me anything about DRAIS, our systems, or how we work with schools and SACCOs across Uganda.",
        suggestions: [
          "What is DRAIS?",
          "How much does DRAIS cost?",
          "Book a demo",
          "Who is on the Xhenvolt team?",
          "Tell me about Xhaira SACCO",
        ],
        fallbackMessage:
          "I don't have that one yet — but a human teammate does. WhatsApp +256 741 341 483 and we'll reply in minutes.",
        legacyBranding: ["gemini", "google ai"],
      },
      "Xhenvolt AI assistant configuration",
    ],
  ];
  for (const [key, value, description] of items) {
    await upsertReturningId(
      "settings",
      "key",
      ["key", "value", "description"],
      [key, JSON.stringify(value), description],
    );
  }
}

async function seedNavigation() {
  console.log("seed: navigation");
  await clearTable("navigation_links");
  const top = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "DRAIS Solutions", href: "/drais-attendance-system" },
    { label: "Services", href: "/services" },
    { label: "Resources", href: "#" },
    { label: "Contact", href: "/contact" },
  ];
  const parents: Record<string, string> = {};
  for (let i = 0; i < top.length; i++) {
    const t = top[i];
    const r = await q<{ id: string }>(
      `INSERT INTO navigation_links (label, href, location, sort_order, is_external)
       VALUES ($1, $2, 'primary', $3, false)
       RETURNING id`,
      [t.label, t.href, i],
    );
    parents[t.label] = r.rows[0].id;
  }
  const drops: Array<[string, string, string]> = [
    ["DRAIS Solutions", "School Attendance System", "/school-attendance-system-uganda"],
    ["DRAIS Solutions", "Biometric Attendance", "/biometric-attendance-uganda"],
    ["DRAIS Solutions", "School Management System", "/school-management-system-uganda"],
    ["DRAIS Solutions", "DRAIS Product Overview", "/drais-attendance-system"],
    ["Services", "Custom Software", "/services#software"],
    ["Services", "Mobile Apps", "/services#mobile"],
    ["Services", "POS Systems", "/services#pos"],
    ["Services", "UI/UX Design", "/services#design"],
    ["Resources", "Case Studies", "/case-studies"],
    ["Resources", "Testimonials", "/testimonials"],
    ["Resources", "Blog", "/blog"],
    ["Resources", "FAQ", "/faq"],
  ];
  let order = 0;
  for (const [parent, label, href] of drops) {
    await q(
      `INSERT INTO navigation_links (label, href, parent_id, location, sort_order, is_external)
       VALUES ($1, $2, $3, 'primary', $4, false)`,
      [label, href, parents[parent], order++],
    );
  }
}

async function seedFooter() {
  console.log("seed: footer + social");
  await clearTable("footer_links");
  await clearTable("social_links");
  const cols: Array<[string, string, string, boolean]> = [
    ["Company", "About Us", "/about", false],
    ["Company", "Our Team", "/about#team", false],
    ["Company", "Contact", "/contact", false],
    ["Products", "DRAIS — School System", "https://drais.pro", true],
    ["Products", "School Attendance System Uganda", "/school-attendance-system-uganda", false],
    ["Products", "Jeton — Financial System", "https://jeton.xhenvolt.com", true],
    ["Products", "Xhaira — HR System", "https://xhaira.xhenvolt.com", true],
    ["Products", "Consty — Project Management", "https://consty.xhenvolt.com", true],
    ["Products", "Custom Software", "/services", false],
    ["Resources", "Case Studies", "/case-studies", false],
    ["Resources", "Testimonials", "/testimonials", false],
    ["Resources", "Blog", "/blog", false],
    ["Resources", "FAQ", "/faq", false],
    ["Legal", "Privacy Policy", "/privacy-policy", false],
    ["Legal", "Terms of Service", "/terms-of-service", false],
    ["Legal", "Cookie Policy", "/cookie-policy", false],
    ["Legal", "Sitemap", "/sitemap", false],
  ];
  let order = 0;
  for (const [col, label, href, external] of cols) {
    await q(
      `INSERT INTO footer_links (label, href, "column", sort_order, is_external) VALUES ($1,$2,$3,$4,$5)`,
      [label, href, col, order++, external],
    );
  }

  const socials: Array<[string, string, string, string]> = [
    ["whatsapp", "WhatsApp", "https://wa.me/256741341483", "whatsapp"],
    ["email", "Email", "mailto:drais@xhenvolt.com", "mail"],
    ["phone", "Phone", "tel:+256741341483", "phone"],
  ];
  for (let i = 0; i < socials.length; i++) {
    const [platform, label, href, icon] = socials[i];
    await q(
      `INSERT INTO social_links (platform, label, href, icon, sort_order) VALUES ($1,$2,$3,$4,$5)`,
      [platform, label, href, icon, i],
    );
  }
}

async function seedHero() {
  console.log("seed: hero + announcements");
  await clearTable("hero_slides");
  await clearTable("announcements");
  await q(
    `INSERT INTO hero_slides (scope, eyebrow, headline, subheadline,
      cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href, media, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      "home",
      "Uganda's #1 School Management System · Trusted by 37+ Institutions",
      "School Management & Attendance Tracking for Uganda",
      "DRAIS is Uganda's leading school management system — automating attendance tracking, student reporting, and real-time monitoring for schools that demand excellence.",
      "Explore DRAIS",
      "https://drais.pro",
      "Book a Free Demo",
      "/contact",
      JSON.stringify({
        tags: [
          "Biometric Attendance",
          "Real-time Monitoring",
          "School Analytics",
          "Parent Alerts",
          "Multi-School",
        ],
      }),
      0,
    ],
  );
}

async function seedSystems() {
  console.log("seed: systems + features");
  await clearTable("system_screenshots");
  await clearTable("system_features");
  await clearTable("systems");

  type SysSeed = {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    category: string;
    url: string | null;
    accent: string;
    deployments: number;
    features: string[];
    flagship: boolean;
  };
  const systems: SysSeed[] = [
    {
      slug: "drais",
      name: "DRAIS",
      tagline: "School Management & Biometric Attendance System",
      description:
        "Uganda's leading school management and biometric attendance system. Real-time tracking, academic reporting, multi-campus management, and parent engagement — built specifically for African schools.",
      category: "Education",
      url: "https://drais.pro",
      accent: "#2563EB",
      deployments: 31,
      flagship: true,
      features: [
        "Biometric fingerprint & face recognition attendance",
        "Automated academic reporting & transcripts",
        "Multi-campus admin from one dashboard",
        "Real-time SMS parent notifications",
        "Fee management & financial tracking",
      ],
    },
    {
      slug: "jeton",
      name: "Jeton",
      tagline: "Financial Management System",
      description:
        "Comprehensive financial management for SMEs, NGOs, and institutions. Handles accounting, payroll, invoicing, and real-time reporting — built for East Africa.",
      category: "Finance",
      url: "https://jeton.xhenvolt.com",
      accent: "#16A34A",
      deployments: 0,
      flagship: true,
      features: [
        "Invoicing, billing & payments",
        "Payroll & staff management",
        "Multi-currency & multi-branch support",
        "Real-time financial analytics",
        "Audit trail & compliance",
      ],
    },
    {
      slug: "consty",
      name: "Consty",
      tagline: "Construction & Project Management",
      description:
        "Purpose-built construction project management for contractors, engineers, and construction firms. Track sites, materials, budgets, and teams from a single platform.",
      category: "Construction",
      url: "https://consty.xhenvolt.com",
      accent: "#F59E0B",
      deployments: 0,
      flagship: true,
      features: [
        "Project & site progress tracking",
        "Material procurement & inventory",
        "Budget control & cost tracking",
        "Contractor & team management",
        "Daily progress reports",
      ],
    },
    {
      slug: "xhaira",
      name: "Xhaira",
      tagline: "SACCO & Microfinance Management",
      description:
        "Robust microfinance and SACCO management covering member registration, loan cycles, savings products, group lending, and compliance — built for institutions across Uganda.",
      category: "Microfinance",
      url: "https://xhaira.xhenvolt.com",
      accent: "#7C3AED",
      deployments: 1,
      flagship: true,
      features: [
        "Member & group registration",
        "Loan application & approval workflows",
        "Savings, deposits & withdrawals",
        "Mobile money integration",
        "Compliance reports & audit logs",
      ],
    },
    {
      slug: "sentra",
      name: "Sentra",
      tagline: "Point-of-Sale System",
      description:
        "Lightweight, reliable POS for retailers and small businesses. Inventory, sales, receipts, and daily reporting on one stack.",
      category: "Retail",
      url: null,
      accent: "#DC2626",
      deployments: 0,
      flagship: false,
      features: [
        "Inventory & barcode scanning",
        "Daily sales & shift reports",
        "Receipts & customer history",
      ],
    },
    {
      slug: "lypha",
      name: "Lypha",
      tagline: "Pharmacy Management System",
      description:
        "Pharmacy workflow management with stock control, prescriptions, expiry tracking, and sales analytics tailored for Ugandan pharmacies.",
      category: "Healthcare",
      url: null,
      accent: "#0EA5E9",
      deployments: 0,
      flagship: false,
      features: [
        "Prescription & drug dispensing",
        "Stock control with expiry alerts",
        "Sales analytics & reports",
      ],
    },
  ];

  for (let i = 0; i < systems.length; i++) {
    const s = systems[i];
    const sysId = await upsertReturningId(
      "systems",
      "slug",
      [
        "slug",
        "name",
        "tagline",
        "description",
        "category",
        "external_url",
        "accent_color",
        "deployments",
        "is_flagship",
        "sort_order",
        "highlights",
      ],
      [
        s.slug,
        s.name,
        s.tagline,
        s.description,
        s.category,
        s.url,
        s.accent,
        s.deployments,
        JSON.stringify(s.flagship),
        i,
        JSON.stringify(s.features),
      ],
    );

    for (let j = 0; j < s.features.length; j++) {
      await q(
        `INSERT INTO system_features (system_id, title, sort_order) VALUES ($1,$2,$3)`,
        [sysId, s.features[j], j],
      );
    }
  }
}

async function seedServices() {
  console.log("seed: services");
  await clearTable("services");
  const services = [
    {
      slug: "custom-software",
      title: "Custom Software Development",
      tagline: "Bespoke systems for institutions across East Africa",
      description:
        "We design and build production-grade web and mobile platforms tailored to your operations — school management, microfinance, financial systems, ERPs, and more.",
      icon: "code",
    },
    {
      slug: "school-systems",
      title: "DRAIS School Management",
      tagline: "Uganda's #1 school operating system",
      description:
        "Deploy DRAIS at your school for biometric attendance, academic reporting, parent communication, fee management, and multi-campus admin.",
      icon: "graduation-cap",
    },
    {
      slug: "mobile-apps",
      title: "Mobile App Development",
      tagline: "Android & iOS apps that ship",
      description:
        "Native and cross-platform mobile applications for your business — built with Flutter, React Native, or Swift/Kotlin.",
      icon: "smartphone",
    },
    {
      slug: "pos-systems",
      title: "POS & Retail Systems",
      tagline: "Reliable point-of-sale built for Uganda",
      description:
        "Lightweight POS systems (Sentra) and pharmacy management (Lypha) tailored for the realities of operating in East Africa.",
      icon: "shopping-cart",
    },
    {
      slug: "ui-ux-design",
      title: "UI/UX Design",
      tagline: "Interfaces people actually want to use",
      description:
        "Brand identity, user research, prototyping, and production-ready design systems for web and mobile.",
      icon: "palette",
    },
    {
      slug: "websites",
      title: "Business & Organization Websites",
      tagline: "Professional websites that convert",
      description:
        "Custom-built websites for schools, businesses, NGOs, and government bodies — fast, SEO-ready, and on-brand.",
      icon: "globe",
    },
  ];
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await q(
      `INSERT INTO services (slug, title, tagline, description, icon, sort_order) VALUES ($1,$2,$3,$4,$5,$6)`,
      [s.slug, s.title, s.tagline, s.description, s.icon, i],
    );
  }
}

async function seedClients() {
  console.log("seed: clients");
  await clearTable("clients");
  type C = { slug: string; name: string; kind: string; logo: string; featured: boolean };
  const clients: C[] = [
    { slug: "city-parents-school", name: "City Parents School", kind: "school", logo: "/client_logos/city Parents-Photoroom.png", featured: true },
    { slug: "northgate-schools", name: "Northgate Schools", kind: "school", logo: "/client_logos/northgateschool-Photoroom.png", featured: true },
    { slug: "excel-islamic-schools", name: "Excel Islamic Schools", kind: "school", logo: "/client_logos/excel_islamic.svg", featured: true },
    { slug: "albayan-center", name: "Albayan Center", kind: "school", logo: "/client_logos/albayan-Photoroom.png", featured: false },
    { slug: "al-hanan", name: "Al Hanan", kind: "school", logo: "/client_logos/al-hanan.svg", featured: false },
    { slug: "almuntahha", name: "Almuntahha", kind: "school", logo: "/client_logos/almuntahha.svg", featured: false },
    { slug: "bugembe-institute", name: "Bugembe Institute", kind: "school", logo: "/client_logos/Bugembe-Photoroom.png", featured: false },
    { slug: "ibun-baz", name: "Ibun Baz Girls", kind: "school", logo: "/client_logos/ibunbaz-photoroom.png", featured: false },
    { slug: "hillside-ways", name: "Hill Side Ways", kind: "school", logo: "/client_logos/Hillsideways badge-Photoroom.png", featured: false },
    { slug: "vision-international", name: "Vision International Academy", kind: "school", logo: "/client_logos/vision-international.svg", featured: false },
    { slug: "walugogo-vocational", name: "Walugogo Vocational", kind: "school", logo: "/client_logos/walugogo-vocational.svg", featured: false },
    { slug: "seek-and-give", name: "Seek and Give", kind: "school", logo: "/client_logos/seek_and_give.svg", featured: false },
    { slug: "northgate-school", name: "Northgate School", kind: "school", logo: "/client_logos/northgate-school.svg", featured: false },
    { slug: "bumwena-scrap-sacco", name: "Bumwena Scrap SACCO", kind: "sacco", logo: "/client_logos/bumwenascrap-Photoroom.png", featured: true },
    { slug: "lypha-retail", name: "Lypha Retail", kind: "business", logo: "/client_logos/lypha-retail.svg", featured: false },
  ];
  for (let i = 0; i < clients.length; i++) {
    const c = clients[i];
    await q(
      `INSERT INTO clients (slug, name, kind, logo_url, featured, sort_order) VALUES ($1,$2,$3,$4,$5,$6)`,
      [c.slug, c.name, c.kind, c.logo, c.featured, i],
    );
  }
}

async function seedTestimonials() {
  console.log("seed: testimonials");
  await clearTable("testimonials");
  const sysIds = (
    await q<{ slug: string; id: string }>(`SELECT slug, id FROM systems`)
  ).rows.reduce<Record<string, string>>((acc, r) => {
    acc[r.slug] = r.id;
    return acc;
  }, {});

  const items: Array<{
    author: string;
    role: string;
    org: string;
    quote: string;
    rating: number;
    featured: boolean;
    systemSlug?: string;
  }> = [
    {
      author: "Sheikh Isabirye Bilaal",
      role: "School Director",
      org: "City Parents School",
      quote:
        "Before Xhenvolt, tracking the whereabouts of both learners and staff was a constant struggle. Our manual systems failed to provide the level of control and visibility we needed. Since implementing Xhenvolt, we now have precise, real-time tracking that has completely transformed our operations.",
      rating: 5,
      featured: true,
      systemSlug: "drais",
    },
    {
      author: "Ngobi Peter",
      role: "General Director",
      org: "Northgate Schools",
      quote:
        "We needed a fully customizable academic reporting system that matched our curriculum perfectly. DRAIS delivered exactly that — and more. Our operations have never been smoother, and the reporting capabilities are truly world-class.",
      rating: 5,
      featured: true,
      systemSlug: "drais",
    },
    {
      author: "Sheikh Hassan Mwaita",
      role: "Director & Principal",
      org: "Excel Islamic Schools",
      quote:
        "Attendance tracking was our biggest challenge across multiple schools. With DRAIS biometric integration, we now have 100% accurate records. Parents love the real-time SMS updates and our administrative workload has dropped significantly.",
      rating: 5,
      featured: true,
      systemSlug: "drais",
    },
    {
      author: "Wekesa Muhammad",
      role: "Chairperson",
      org: "Bumwena Scrap SACCO",
      quote:
        "The Xhaira SACCO Management System has transformed our scrap metal dealers' cooperative completely. Before this system, managing member contributions, loans, and savings was a manual nightmare. Now everything is automated and transparent — 500+ members served with full satisfaction.",
      rating: 5,
      featured: true,
      systemSlug: "xhaira",
    },
    {
      author: "Okurut Sylver",
      role: "Head Teacher",
      org: "Vision International Academy",
      quote:
        "Since adopting DRAIS, our teachers save hours every week on paperwork. The automated report generation alone was worth the investment — parents are impressed with the professional quality of reports.",
      rating: 5,
      featured: false,
      systemSlug: "drais",
    },
  ];
  for (let i = 0; i < items.length; i++) {
    const t = items[i];
    await q(
      `INSERT INTO testimonials
        (author_name, author_role, organization, quote, rating, featured, sort_order, system_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        t.author,
        t.role,
        t.org,
        t.quote,
        t.rating,
        t.featured,
        i,
        t.systemSlug ? sysIds[t.systemSlug] ?? null : null,
      ],
    );
  }
}

async function seedStatistics() {
  console.log("seed: statistics");
  await clearTable("statistics");
  const items: Array<[string, string, string, string, string]> = [
    ["schools_drais", "Schools Running DRAIS", "31", "+", "global"],
    ["orgs_served", "Organizations Served", "37", "+", "global"],
    ["systems_deployed", "Systems Deployed", "37", "+", "global"],
    ["uptime", "System Uptime", "99.9", "%", "global"],
    ["admin_reduction", "Admin Workload Reduction", "60", "%", "impact"],
    ["productivity_increase", "Staff Productivity Increase", "45", "%", "impact"],
    ["completion_rate", "Student Completion Rate Improvement", "40", "%", "impact"],
    ["client_satisfaction", "Client Satisfaction", "100", "%", "impact"],
    ["projects_delivered", "Projects Delivered", "25", "+", "global"],
    ["websites_deployed", "Websites Deployed", "6", "+", "global"],
    ["biometric_accuracy", "Biometric Accuracy", "96", "%", "drais"],
  ];
  for (let i = 0; i < items.length; i++) {
    const [key, label, value, suffix, scope] = items[i];
    await q(
      `INSERT INTO statistics (key, label, value, suffix, scope, sort_order) VALUES ($1,$2,$3,$4,$5,$6)`,
      [key, label, value, suffix, scope, i],
    );
  }
}

async function seedTimeline() {
  console.log("seed: timeline");
  await clearTable("timeline_entries");
  type T = {
    title: string;
    description: string;
    occurredOn: string;
    label: string;
    icon: string;
    accent: string;
    highlight: boolean;
    events: string[];
  };
  const items: T[] = [
    {
      title: "Foundation & First Clients",
      description:
        "Xhenvolt was founded with the first DRAIS prototype, early school partnerships, and the foundations of the company's product engineering culture.",
      occurredOn: "2025-06-01",
      label: "June 2025",
      icon: "rocket",
      accent: "#3b82f6",
      highlight: false,
      events: [
        "Company established — June 2025",
        "First DRAIS prototype developed",
        "Initial school partnerships formed",
      ],
    },
    {
      title: "DRAIS Launch & Early Adoption",
      description:
        "DRAIS was officially launched as our flagship school management system. Early adopters included Northgate Schools and Albayan Quran Memorization Center, both deploying biometric attendance in this period.",
      occurredOn: "2025-09-01",
      label: "Jul–Sep 2025",
      icon: "school",
      accent: "#8b5cf6",
      highlight: false,
      events: [
        "DRAIS v1.0 launched",
        "Northgate Schools onboarded — advanced reporting",
        "Albayan Center — customized program-based system",
        "Biometric attendance integration completed",
      ],
    },
    {
      title: "Rapid Expansion + Website Wave",
      description:
        "Growing trust led to rapid expansion across multiple schools and organizations. Excel Islamic Schools, Al Hanan, and more adopted DRAIS. Six organizational websites were launched in this quarter.",
      occurredOn: "2025-12-01",
      label: "Oct–Dec 2025",
      icon: "globe",
      accent: "#06b6d4",
      highlight: false,
      events: [
        "Excel Islamic Schools adopted DRAIS",
        "Al Hanan Education Center — DRAIS deployment",
        "Seek and Give Charity — website launched",
        "Al Muntahha Online School — website launched",
        "Vision International Academy — website launched",
        "Walugogo Vocational Secondary School — website launched",
      ],
    },
    {
      title: "Major Installation Wave — 31 Schools",
      description:
        "A landmark quarter — Xhenvolt deployed multiple biometric attendance systems and completed several website projects simultaneously. Reached 31 schools running DRAIS across Uganda.",
      occurredOn: "2026-03-01",
      label: "Jan–Mar 2026",
      icon: "fingerprint",
      accent: "#f59e0b",
      highlight: true,
      events: [
        "Ibun Baz Girls Secondary School — attendance system deployed",
        "Hill Side Ways Nursery and Primary School — attendance system deployed",
        "DRAIS analytics module enhanced",
        "Parent notification system upgraded",
        "31 schools now running DRAIS",
      ],
    },
    {
      title: "37+ Organizations & Continuing Growth",
      description:
        "Xhenvolt now serves 37+ organizations across Uganda — 31 schools running DRAIS and 6+ organizations on other Xhenvolt solutions. Launched less than a year ago, the growth continues.",
      occurredOn: "2026-04-15",
      label: "Apr 2026 — present",
      icon: "users",
      accent: "#ef4444",
      highlight: true,
      events: [
        "37+ total organizations served",
        "31 schools running DRAIS",
        "6+ organizations on websites & other systems",
        "Continuous feature development & support",
      ],
    },
  ];
  for (let i = 0; i < items.length; i++) {
    const t = items[i];
    await q(
      `INSERT INTO timeline_entries
        (title, description, occurred_on, label, icon, accent_color, highlight, events, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        t.title,
        t.description,
        t.occurredOn,
        t.label,
        t.icon,
        t.accent,
        JSON.stringify(t.highlight),
        JSON.stringify(t.events),
        i,
      ],
    );
  }
}

async function seedTeam() {
  console.log("seed: team");
  await clearTable("team_members");
  const members = [
    {
      slug: "hamuza-ibrahim",
      name: "Hamuza Ibrahim",
      role: "Founder & Chief Executive Officer",
      bio: "Visionary leader driving digital transformation across Uganda with over 10 years of experience in technology innovation.",
      specialties: ["Strategic Planning", "Digital Transformation", "Business Development"],
    },
    {
      slug: "ganiyu-kule-hussein",
      name: "Ganiyu Kule Hussein",
      role: "Marketing & Growth Lead",
      bio: "Strategic marketing professional focused on driving growth and building lasting relationships with clients across Africa.",
      specialties: ["Digital Marketing", "Growth Strategy", "Content Creation"],
    },
    {
      slug: "sinsiga-shafic",
      name: "Sinsiga Shafic",
      role: "Client Success Officer",
      bio: "Dedicated to ensuring client satisfaction and success, bridging the gap between clients and the development team with precision and care.",
      specialties: ["Client Relationship Management", "Project Coordination", "Customer Success"],
      socials: {
        linkedin: "https://www.linkedin.com/in/sinsiga-shafic",
        twitter: "https://twitter.com/sinsiga_shafic",
        github: "https://github.com/sinsiga-shafic",
      },
    },
    {
      slug: "mubeezi-calebu-ashiraf",
      name: "Mubeezi Calebu Ashiraf",
      role: "Lead UI/UX Designer",
      bio: "Creative designer crafting intuitive user experiences and beautiful interfaces that drive engagement and conversions.",
      specialties: ["UI/UX Design", "Brand Identity", "User Research"],
    },
    {
      slug: "nasa-matovu",
      name: "Nasa Matovu",
      role: "Lead Full-Stack Developer",
      bio: "Expert developer specializing in scalable web applications and enterprise systems with modern technologies.",
      specialties: ["Full-Stack Development", "System Architecture", "Database Design"],
    },
  ];
  for (let i = 0; i < members.length; i++) {
    const m = members[i] as { slug: string; name: string; role: string; bio: string; specialties: string[]; socials?: Record<string, string> };
    await q(
      `INSERT INTO team_members (slug, name, role, bio, specialties, socials, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        m.slug,
        m.name,
        m.role,
        m.bio,
        JSON.stringify(m.specialties),
        JSON.stringify(m.socials ?? {}),
        i,
      ],
    );
  }
}

async function seedFaqs() {
  console.log("seed: faqs");
  await clearTable("faqs");
  type F = { slug: string; q: string; a: string; cat: string; kw: string[] };
  const items: F[] = [
    {
      slug: "what-is-drais",
      cat: "product",
      kw: ["drais", "school", "management"],
      q: "What is DRAIS?",
      a: "DRAIS is Xhenvolt's comprehensive school management system. It covers biometric attendance, academic reporting, parent–teacher communication, fee management, and multi-campus admin. 31 schools across Uganda currently run DRAIS, with documented 60% reductions in administrative workload.",
    },
    {
      slug: "what-is-xhaira",
      cat: "product",
      kw: ["xhaira", "sacco", "microfinance"],
      q: "What is Xhaira?",
      a: "Xhaira is our SACCO and microfinance management platform. It handles member registration, loan workflows, savings, mobile money integration, and compliance reporting. Bumwena Scrap SACCO uses it to manage 500+ members.",
    },
    {
      slug: "what-is-jeton",
      cat: "product",
      kw: ["jeton", "finance", "accounting"],
      q: "What is Jeton?",
      a: "Jeton is Xhenvolt's financial management system — invoicing, payroll, multi-branch accounting, and real-time financial analytics for SMEs, NGOs, and institutions across East Africa.",
    },
    {
      slug: "what-is-consty",
      cat: "product",
      kw: ["consty", "construction", "project"],
      q: "What is Consty?",
      a: "Consty is a construction project management platform for contractors and engineering firms. It tracks site progress, materials, budgets, contractor teams, and daily reports from one dashboard.",
    },
    {
      slug: "pricing",
      cat: "pricing",
      kw: ["price", "cost", "pricing", "how much"],
      q: "How much does DRAIS cost?",
      a: "Pricing depends on school size, modules, and deployment scope. We offer a free demo and a tailored quote — message us on WhatsApp at +256 741 341 483 or email drais@xhenvolt.com for a same-day response.",
    },
    {
      slug: "book-a-demo",
      cat: "demo",
      kw: ["demo", "trial", "book", "see"],
      q: "Can I book a free demo?",
      a: "Yes. Book a free demo at /contact or WhatsApp +256 741 341 483 — we usually schedule within 24 hours and can deploy DRAIS at your school in days, not months.",
    },
    {
      slug: "contact",
      cat: "contact",
      kw: ["contact", "reach", "phone", "email", "office"],
      q: "How do I contact Xhenvolt?",
      a: "Phone +256 741 341 483, email drais@xhenvolt.com, or visit our office in Bulubandi, Iganga, Uganda. We're available Monday–Friday, 8:00 AM – 6:00 PM EAT.",
    },
    {
      slug: "success-stories",
      cat: "company",
      kw: ["success", "results", "case studies", "stories"],
      q: "What results have your clients seen?",
      a: "60% reduction in admin workload at schools, 45% increase in staff productivity, 40% improvement in student completion rates, and 100% client satisfaction across 25+ projects delivered.",
    },
    {
      slug: "founded",
      cat: "company",
      kw: ["founded", "history", "when", "started"],
      q: "When was Xhenvolt founded?",
      a: "Xhenvolt was founded in June 2025 in Iganga, Uganda. In under a year we've reached 37+ organizations served and 31 schools running DRAIS.",
    },
    {
      slug: "team",
      cat: "company",
      kw: ["team", "founders", "ceo", "staff"],
      q: "Who runs Xhenvolt?",
      a: "Xhenvolt is led by founder & CEO Hamuza Ibrahim, with Ganiyu Kule Hussein (Marketing & Growth), Sinsiga Shafic (Client Success), Mubeezi Calebu Ashiraf (Lead Design), and Nasa Matovu (Lead Engineering).",
    },
    {
      slug: "why-xhenvolt",
      cat: "company",
      kw: ["why", "different", "competitors", "best"],
      q: "Why choose Xhenvolt over a foreign vendor?",
      a: "We build for Ugandan realities — intermittent connectivity, mobile-first parents, multi-language environments, mobile money. Foreign vendors don't ship that. We deploy in days and stay reachable on WhatsApp.",
    },
    {
      slug: "support",
      cat: "support",
      kw: ["support", "help", "training", "onboarding"],
      q: "What support do you offer after deployment?",
      a: "Hands-on onboarding, staff training, and continuous support over WhatsApp and phone. Most issues are resolved within minutes during business hours.",
    },
  ];
  for (let i = 0; i < items.length; i++) {
    const f = items[i];
    await q(
      `INSERT INTO faqs (slug, question, answer, category, keywords, scope, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [f.slug, f.q, f.a, f.cat, JSON.stringify(f.kw), "public", i],
    );
  }
}

async function seedAiDocs() {
  console.log("seed: ai_training_documents");
  await clearTable("ai_training_documents");
  type D = { slug: string; title: string; category: string; kw: string[]; content: string; summary: string };
  const docs: D[] = [
    {
      slug: "company-overview",
      title: "About Xhenvolt",
      category: "company",
      kw: ["xhenvolt", "company", "uganda", "founded"],
      summary: "Xhenvolt is a Ugandan software company founded June 2025 in Iganga.",
      content:
        "Xhenvolt is a Ugandan technology company founded in June 2025, headquartered in Bulubandi, Iganga. Our mission is to build real digital infrastructure for African institutions — schools, SACCOs, pharmacies, construction firms, and small businesses. In under a year we have served 37+ organizations and deployed DRAIS in 31 schools. The team is led by founder Hamuza Ibrahim, supported by leads in marketing, client success, design, and full-stack engineering. We are reachable on WhatsApp at +256 741 341 483 and at drais@xhenvolt.com.",
    },
    {
      slug: "drais-overview",
      title: "DRAIS — School Management System",
      category: "product",
      kw: ["drais", "school", "attendance", "biometric"],
      summary:
        "DRAIS is Uganda's leading school management & biometric attendance system, running in 31 schools.",
      content:
        "DRAIS is Xhenvolt's flagship product — a comprehensive school management and biometric attendance system. Modules include biometric (fingerprint + face) attendance, automated academic reporting and transcripts, multi-campus administration, real-time SMS notifications to parents, fee management, and financial tracking. 31 schools across Uganda currently run DRAIS, with documented results: 60% admin workload reduction, 45% productivity uplift, 40% improvement in student completion rates, 96% biometric accuracy. Visit drais.pro for product detail.",
    },
    {
      slug: "xhaira-overview",
      title: "Xhaira — SACCO & Microfinance",
      category: "product",
      kw: ["xhaira", "sacco", "microfinance", "loans"],
      summary:
        "Xhaira is the Xhenvolt SACCO/microfinance system; Bumwena Scrap SACCO runs it for 500+ members.",
      content:
        "Xhaira is the Xhenvolt SACCO and microfinance management platform. Features include member and group registration, loan application and approval workflows, savings, deposits and withdrawals, mobile money integration, and compliance/audit reports. Our reference customer is Bumwena Scrap SACCO, a 500+ member cooperative chaired by Wekesa Muhammad.",
    },
    {
      slug: "jeton-overview",
      title: "Jeton — Financial Management",
      category: "product",
      kw: ["jeton", "finance", "accounting", "payroll"],
      summary: "Jeton handles invoicing, payroll, accounting and analytics for SMEs and NGOs.",
      content:
        "Jeton is a financial management system for SMEs, NGOs, and institutions. It covers invoicing, billing & payments; payroll & staff management; multi-currency and multi-branch accounting; real-time financial analytics; and audit trail & compliance. Live at jeton.xhenvolt.com.",
    },
    {
      slug: "consty-overview",
      title: "Consty — Construction Project Management",
      category: "product",
      kw: ["consty", "construction", "project", "site"],
      summary:
        "Consty is the Xhenvolt construction project management platform for contractors and engineers.",
      content:
        "Consty is the Xhenvolt construction project management platform. It tracks project and site progress, material procurement and inventory, budget control and cost tracking, contractor and team management, and daily progress reports. Live at consty.xhenvolt.com.",
    },
    {
      slug: "contact-and-support",
      title: "How to contact Xhenvolt",
      category: "contact",
      kw: ["contact", "phone", "email", "whatsapp", "support"],
      summary:
        "Phone +256 741 341 483, email drais@xhenvolt.com, Bulubandi, Iganga — Mon–Fri 8am–6pm EAT.",
      content:
        "Reach Xhenvolt via phone at +256 741 341 483 (also 0760 700 954 and 0745 726 350), email drais@xhenvolt.com or info@xhenvolt.com, WhatsApp +256 741 341 483, or visit our office in Bulubandi, Iganga, Uganda. Office hours: Monday–Friday, 8:00 AM – 6:00 PM EAT. Demos are typically scheduled within 24 hours.",
    },
    {
      slug: "pricing-philosophy",
      title: "Pricing & how we quote",
      category: "pricing",
      kw: ["price", "cost", "quote", "pricing", "affordable"],
      summary:
        "Pricing is tailored to deployment size and modules. Free demo, same-day quote on request.",
      content:
        "Xhenvolt does not publish a fixed price list. Pricing depends on the size of the institution, modules selected (e.g. DRAIS biometric vs. reporting-only), deployment scope, and ongoing support. We offer free demos and same-day tailored quotes via WhatsApp at +256 741 341 483 or email drais@xhenvolt.com.",
    },
    {
      slug: "key-results",
      title: "Documented client results",
      category: "results",
      kw: ["results", "impact", "kpi", "metrics", "case study"],
      summary:
        "60% admin reduction, 45% productivity uplift, 40% completion rate gain, 100% satisfaction.",
      content:
        "Across deployments, Xhenvolt clients report: 60% reduction in administrative workload (schools on DRAIS), 45% staff productivity increase, 40% improvement in student completion rates at memorization centers, 100% client satisfaction across 25+ delivered projects, and 99.9% platform uptime. DRAIS biometric attendance achieves 96% accuracy in field conditions.",
    },
    {
      slug: "key-clients",
      title: "Reference clients",
      category: "clients",
      kw: ["clients", "customers", "schools", "references"],
      summary:
        "Northgate, City Parents, Excel Islamic, Albayan, Al Hanan, Ibun Baz, Hill Side Ways, Bumwena SACCO.",
      content:
        "Reference clients include Northgate Schools (Ngobi Peter, General Director), City Parents School (Sheikh Isabirye Bilaal, Director), Excel Islamic Schools (Sheikh Hassan Mwaita, Director & Principal), Vision International Academy (Okurut Sylver, Head Teacher), Albayan Center, Al Hanan, Ibun Baz Girls, Hill Side Ways, Almuntahha, Bugembe Institute, Walugogo Vocational, Seek and Give. SACCO reference: Bumwena Scrap SACCO (Wekesa Muhammad, Chairperson — 500+ members on Xhaira).",
    },
    {
      slug: "deployment-timeline",
      title: "How fast can we deploy?",
      category: "process",
      kw: ["timeline", "deploy", "install", "setup", "how long"],
      summary: "DRAIS can be live at a school in days, not months.",
      content:
        "Typical DRAIS deployment runs in days, not months. We provision the platform, import student/staff data, install biometric hardware, train staff, and go live. For SACCO (Xhaira) or financial (Jeton) systems, timelines depend on data complexity but most deployments complete in two to four weeks.",
    },
  ];
  for (let i = 0; i < docs.length; i++) {
    const d = docs[i];
    await q(
      `INSERT INTO ai_training_documents (slug, title, category, keywords, content, summary, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [d.slug, d.title, d.category, JSON.stringify(d.kw), d.content, d.summary, i],
    );
  }
}

async function seedSeo() {
  console.log("seed: seo_metadata (key routes)");
  await clearTable("seo_metadata");
  const items: Array<{
    route: string;
    title: string;
    description: string;
    keywords: string;
  }> = [
    {
      route: "/",
      title: "Xhenvolt — School Management & Software for Uganda",
      description:
        "Uganda's #1 school management system (DRAIS) and software platform for SACCOs, finance, construction and pharmacies. Trusted by 37+ institutions.",
      keywords:
        "DRAIS, school management Uganda, biometric attendance, Xhaira SACCO, Jeton finance, Consty construction, Xhenvolt",
    },
    {
      route: "/about",
      title: "About Xhenvolt — Built for African Institutions",
      description:
        "Xhenvolt builds real digital infrastructure for schools, SACCOs, NGOs and businesses across Uganda. Founded June 2025, Bulubandi, Iganga.",
      keywords: "Xhenvolt about, Uganda tech company, DRAIS team",
    },
    {
      route: "/services",
      title: "Services — Custom Software & DRAIS",
      description:
        "Xhenvolt services: DRAIS school management, Xhaira SACCO, Jeton finance, Consty construction, custom software, mobile apps, websites.",
      keywords: "custom software Uganda, school management, SACCO software, mobile apps Uganda",
    },
    {
      route: "/contact",
      title: "Contact Xhenvolt — Book a Free DRAIS Demo",
      description:
        "Reach Xhenvolt at +256 741 341 483 or drais@xhenvolt.com. Office in Bulubandi, Iganga. Free demos scheduled within 24 hours.",
      keywords: "contact Xhenvolt, DRAIS demo, Iganga office",
    },
    {
      route: "/testimonials",
      title: "Testimonials — What Our Clients Say",
      description:
        "Hear from schools and SACCOs across Uganda about DRAIS, Xhaira and other Xhenvolt platforms.",
      keywords: "Xhenvolt testimonials, DRAIS reviews, Uganda school feedback",
    },
  ];
  for (const it of items) {
    await q(
      `INSERT INTO seo_metadata (route, title, description, keywords, og_title, og_description, og_type, twitter_card)
       VALUES ($1,$2,$3,$4,$5,$6,'website','summary_large_image')`,
      [
        it.route,
        it.title,
        it.description,
        it.keywords,
        it.title,
        it.description,
      ],
    );
  }
}

async function main() {
  await seedSettings();
  await seedNavigation();
  await seedFooter();
  await seedHero();
  await seedSystems();
  await seedServices();
  await seedClients();
  await seedTestimonials();
  await seedStatistics();
  await seedTimeline();
  await seedTeam();
  await seedFaqs();
  await seedAiDocs();
  await seedSeo();
  console.log("seed: done.");
}

main().catch((err) => {
  console.error("seed failed:", err.message ?? err);
  process.exit(1);
});
