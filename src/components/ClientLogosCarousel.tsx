"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { School, Building2, Award } from "lucide-react";

const allClients = [
  { name: "Northgate Schools", logo: "northgateschool.png", badge: false },
  { name: "Albayan Quran Memorization Center", logo: "albayan.png", badge: false },
  { name: "Bugembe Islamic Institute", logo: "Bugembe.jpeg", badge: false },
  { name: "Bumwena Scrap SACCO", logo: "bumwenascrap.jpeg", badge: false },
  { name: "Excel Islamic Schools", logo: null, badge: false },
  { name: "Ibun Baz Girls Secondary School", logo: null, badge: false },
  { name: "Hill Side Ways Nursery and Primary School", logo: null, badge: false },
  { name: "Vision International Academy", logo: null, badge: false },
  { name: "Walugogo Vocational Secondary School", logo: null, badge: false },
  { name: "Al Hanan Education Center", logo: null, badge: false },
  { name: "Al Muntahha Online School", logo: null, badge: false },
  { name: "Seek and Give Charity Organization", logo: null, badge: false },
  { name: "Unity Bridge Foundation", logo: null, badge: false },
  { name: "Excel Islamic Secondary School", logo: null, badge: false },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 2 || name.split(" ").length <= 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const gradients = [
  ["#3b82f6", "#1d4ed8"],
  ["#8b5cf6", "#6d28d9"],
  ["#06b6d4", "#0891b2"],
  ["#10b981", "#059669"],
  ["#f59e0b", "#d97706"],
  ["#ef4444", "#dc2626"],
  ["#ec4899", "#be185d"],
];

function LogoPlaceholder({ name, size = 64 }: { name: string; size?: number }) {
  const initials = getInitials(name);
  const idx = name.length % gradients.length;
  const [c1, c2] = gradients[idx];
  const id = `lg-${name.replace(/\s+/g, "")}`;

  return (
    <div
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ color: "white", fontSize: size * 0.32, fontWeight: 700, fontFamily: "Arial, sans-serif" }}>
        {initials}
      </span>
    </div>
  );
}

function ClientLogoImage({ client, size = 64 }: { client: (typeof allClients)[0]; size?: number }) {
  const [ok, setOk] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!client.logo) {
      setChecked(true);
      return;
    }
    const img = new window.Image();
    img.onload = () => { setOk(true); setChecked(true); };
    img.onerror = () => { setOk(false); setChecked(true); };
    img.src = `/clients_logos/${client.logo}`;
  }, [client.logo]);

  if (!checked) return <div style={{ width: size, height: size }} className="rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  if (ok && client.logo) return (
    <Image
      src={`/clients_logos/${client.logo}`}
      alt={client.name}
      width={size}
      height={size}
      className="rounded-xl object-contain"
      loading="lazy"
    />
  );
  return <LogoPlaceholder name={client.name} size={size} />;
}

export default function ClientLogosCarousel() {
  const doubled = [...allClients, ...allClients];

  return (
    <section className="py-20 bg-white/50 dark:bg-gray-800/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            37+ Institutions Supported
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Schools, NGOs, and organizations running on Xhenvolt systems every day across Uganda.
          </p>
          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800">
              <School className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-700 dark:text-blue-300">29+ Schools on DRAIS</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-full border border-purple-100 dark:border-purple-800">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">8+ Organizations</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-yellow-50 dark:bg-yellow-900/30 rounded-full border border-yellow-100 dark:border-yellow-800">
              <Award className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">Real-time Attendance Tracking</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Infinite scrolling row */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: { duration: 35, repeat: Infinity, ease: "linear" },
          }}
          style={{ width: "fit-content" }}
        >
          {doubled.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex flex-col items-center gap-3 min-w-[120px]"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <ClientLogoImage client={client} size={64} />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center max-w-[100px] leading-tight">
                {client.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
