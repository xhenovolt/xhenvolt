"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileText, Scale, Shield, AlertTriangle, Mail, Calendar } from "lucide-react";

const sections = [
	{
		icon: <FileText className="w-6 h-6" />,
		title: "Acceptance of Terms",
		content:
			"By accessing, browsing, or using the Xhenvolt Uganda website, mobile applications, or any of our digital services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Xhenvolt Uganda. If you do not agree with any part of these terms, please discontinue use of our services immediately.",
	},
	{
		icon: <Shield className="w-6 h-6" />,
		title: "Services Description",
		content:
			"Xhenvolt Uganda provides comprehensive technology solutions including but not limited to: custom software development, mobile application development, web development, UI/UX design services, point-of-sale systems, school management platforms, business automation solutions, and digital consultation services. Our services are provided on a project basis or through ongoing service agreements as mutually agreed upon with clients.",
	},
	{
		icon: <Scale className="w-6 h-6" />,
		title: "User Responsibilities",
		items: [
			"Provide accurate, complete, and current information when submitting forms or requests",
			"Use our services in compliance with all applicable laws and regulations",
			"Respect intellectual property rights of Xhenvolt Uganda and third parties",
			"Maintain confidentiality of any access credentials or sensitive information shared",
			"Report any security vulnerabilities or unauthorized access immediately",
			"Use our services for legitimate business purposes only",
		],
	},
	{
		icon: <AlertTriangle className="w-6 h-6" />,
		title: "Limitation of Liability",
		content:
			"To the maximum extent permitted by law, Xhenvolt Uganda shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from or related to your use of our services. Our total liability for any claims shall not exceed the amount paid by you for the specific service giving rise to the claim.",
	},
	{
		icon: <FileText className="w-6 h-6" />,
		title: "Intellectual Property",
		content:
			"All content, software, designs, logos, trademarks, and proprietary technologies on our website and in our services are owned by Xhenvolt Uganda or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without explicit written permission. Client-specific work products are subject to separate intellectual property agreements.",
	},
	{
		icon: <Shield className="w-6 h-6" />,
		title: "Privacy and Data Protection",
		content:
			"Your privacy is important to us. Our collection, use, and protection of personal information is governed by our Privacy Policy, which is incorporated into these terms by reference. By using our services, you consent to our data practices as described in the Privacy Policy. We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.",
	},
];

export default function TermsOfServicePage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">

			{/* Hero Section */}
			<section className="pt-32 pb-16">
				<div className="max-w-7xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center max-w-4xl mx-auto"
					>
						<h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6">
							Terms of Service
						</h1>
						<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
							Clear guidelines for using our services and protecting both our clients
							and our business.
						</p>
						<div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
							<Calendar className="w-4 h-4" />
							<span>Last updated: January 2024</span>
						</div>
					</motion.div>
				</div>
			</section>

			<div className="max-w-5xl mx-auto px-6 pb-16">
				{/* Introduction */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mb-16"
				>
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
						<div className="flex items-center gap-4 mb-6">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
								<Scale className="w-6 h-6" />
							</div>
							<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
								Legal Framework
							</h2>
						</div>
						<p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
							These Terms of Service outline the rules, responsibilities, and expectations for all users of Xhenvolt Uganda&apos;s digital services and platforms. By establishing clear guidelines, we ensure a professional, secure, and mutually beneficial relationship with our clients and website visitors.
						</p>
						<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
							Our terms are designed to protect both your interests and ours while
							fostering innovation, trust, and successful project outcomes. Please review
							these terms carefully as they constitute a binding legal agreement.
						</p>
					</div>
				</motion.section>

				{/* Terms Sections */}
				{sections.map((section, index) => (
					<motion.section
						key={index}
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.1 }}
						className="mb-12"
					>
						<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
									{section.icon}
								</div>
								<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
									{section.title}
								</h2>
							</div>

							{section.content && (
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
									{section.content}
								</p>
							)}

							{section.items && (
								<ul className="space-y-4">
									{section.items.map((item, itemIndex) => (
										<motion.li
											key={itemIndex}
											initial={{ opacity: 0, x: 20 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{ delay: itemIndex * 0.05 }}
											className="flex items-start gap-3"
										>
											<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
											<span className="text-gray-600 dark:text-gray-300 leading-relaxed">
												{item}
											</span>
										</motion.li>
									))}
								</ul>
							)}
						</div>
					</motion.section>
				))}

				{/* Additional Terms */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mb-16"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
								Termination
							</h3>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								We reserve the right to suspend or terminate access to our services if
								these terms are violated or if we reasonably believe that continued
								access may harm our business, other clients, or third parties.
							</p>
						</div>

						<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
								Governing Law
							</h3>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								These terms are governed by the laws of Uganda. Any disputes arising from
								these terms or our services shall be resolved through appropriate legal
								channels in Uganda.
							</p>
						</div>
					</div>
				</motion.section>

				{/* Contact Section */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mb-16"
				>
					<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl">
						<div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
							<Mail className="w-8 h-8" />
						</div>
						<h2 className="text-3xl md:text-4xl font-bold mb-6">
							Questions About These Terms?
						</h2>
						<p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
							Our team is available to clarify any aspects of these terms and discuss how
							they apply to your specific situation.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.a
								href="mailto:info@xhenvolt.com"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
							>
								<Mail className="w-5 h-5" />
								Email Legal Team
							</motion.a>
							<motion.a
								href="/contact"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
							>
								Contact Us
							</motion.a>
						</div>
					</div>
				</motion.section>

				{/* Updates Notice */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Terms Updates
						</h3>
						<p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
							Xhenvolt Uganda may update these Terms of Service periodically to reflect
							changes in our services, business practices, or legal requirements.
							Material changes will be communicated through our website and, where
							appropriate, via direct notification to affected users. Continued use of
							our services after any modifications constitutes acceptance of the updated
							terms.
						</p>
					</div>
				</motion.section>
			</div>

		</main>
	);
}