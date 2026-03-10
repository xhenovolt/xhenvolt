"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const allClients = [
  { name: "Northgate Schools", logo: "northgateschool.png" },
  { name: "Albayan Quran Memorization Center", logo: "albayan.png" },
  { name: "Bugembe Islamic Institute", logo: "Bugembe.jpeg" },
  { name: "Bumwena Scrap SACCO", logo: "bumwenascrap.jpeg" },
  { name: "Excel Islamic Schools", logo: null },
  { name: "Ibun Baz Girls Secondary School", logo: null },
  { name: "Hillside Ways Secondary School", logo: null },
  { name: "Vision International Academy", logo: null },
  { name: "Walugogo Vocational Secondary School", logo: null },
  { name: "Al Hanan Education Center", logo: null },
  { name: "Al Muntahha Online School", logo: null },
  { name: "Seek and Give Charity Organization", logo: null },
  { name: "Unity Bridge Foundation", logo: null },
  { name: "Excel Islamic Secondary School", logo: null },
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
    <svg width={size} height={size} viewBox="0 0 64 64" className="rounded-xl flex-shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="12" fill={`url(#${id})`} />
      <text
        x="32"
        y="34"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="20"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        {initials}
      </text>
    </svg>
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
    img.src = `/client_logos/${client.logo}`;
  }, [client.logo]);

  if (!checked) return <div style={{ width: size, height: size }} className="rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  if (ok && client.logo) return <Image src={`/client_logos/${client.logo}`} alt={client.name} width={size} height={size} className="rounded-xl object-cover" />;
  return <LogoPlaceholder name={client.name} size={size} />;
}

export default function ClientLogosCarousel() {
  // Double the list for seamless infinite scroll
  const doubled = [...allClients, ...allClients];

  return (
    <section className="py-16 bg-white/50 dark:bg-gray-800/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trusted by Institutions Across Uganda
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Schools, NGOs, and organizations running on Xhenvolt systems every day.
          </p>
        </motion.div>
      </div>

      {/* Infinite scrolling row */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: { duration: 30, repeat: Infinity, ease: "linear" },
          }}
          style={{ width: "fit-content" }}
        >
          {doubled.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex flex-col items-center gap-3 min-w-[120px]"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
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
