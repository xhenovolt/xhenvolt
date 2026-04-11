"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    "Company": [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/about#team" },
      { name: "Contact", href: "/contact" }
    ],
    "Products": [
      { name: "DRAIS — School System", href: "https://drais.pro", external: true },
      { name: "School Attendance System Uganda", href: "/school-attendance-system-uganda" },
      { name: "Biometric Attendance Uganda", href: "/biometric-attendance-uganda" },
      { name: "School Management System Uganda", href: "/school-management-system-uganda" },
      { name: "Jeton — Financial System", href: "https://jeton.xhenvolt.com", external: true },
      { name: "Xhaira — HR System", href: "https://xhaira.xhenvolt.com", external: true },
      { name: "Consty — Project Management", href: "https://consty.xhenvolt.com", external: true },
      { name: "Custom Software", href: "/services" }
    ],
    "Resources": [
      { name: "Case Studies", href: "/case-studies" },
      { name: "Testimonials", href: "/testimonials" },
      { name: "Blog", href: "/blog" },
      { name: "FAQ", href: "/faq" }
    ],
    "Legal": [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
      { name: "Cookie Policy", href: "/cookie-policy" },
      { name: "Sitemap", href: "/sitemap" }
    ]
  };

  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-white/20 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Xhenvolt Uganda
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Building digital infrastructure for modern institutions. We develop powerful software systems that help schools, organizations, and institutions manage operations and build strong digital presence.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-300">Bulubandi, Iganga, Uganda</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div className="text-gray-600 dark:text-gray-300">
                    <div>0741 341 483</div>
                    <div>0760 700 954</div>
                    <div>0745 726 350</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-300">drais@xhenvolt.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => {
                  const isExternal = (link as any).external;
                  const LinkComponent = isExternal ? 'a' : Link;
                  const linkProps = isExternal 
                    ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
                    : { href: link.href };
                  return (
                    <li key={linkIndex}>
                      <LinkComponent
                        {...linkProps}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                      >
                        {link.name}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </LinkComponent>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl p-8 mb-12"
        >
          <div className="text-center text-white">
            <h4 className="text-2xl font-bold mb-4">Stay Updated</h4>
            <p className="mb-6 opacity-90">
              Get the latest insights on technology trends and digital transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Xhenvolt Uganda. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {/*
              { name: "LinkedIn", href: "#", icon: "linkedin" },
              { name: "Twitter", href: "#", icon: "twitter" },
              { name: "Facebook", href: "#", icon: "facebook" },
              { name: "Instagram", href: "#", icon: "instagram" }
            ].map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                aria-label={social.name}
              >
                <div className="w-5 h-5 bg-current" />
              </motion.a>
            ))}
            */}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
