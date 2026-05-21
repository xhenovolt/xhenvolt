"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Lock, FileText, Mail, Calendar } from "lucide-react";

const sections = [
	{
		icon: <FileText className="w-6 h-6" />,
		title: "Information We Collect",
		content: [
			{
				subtitle: "Personal Information",
				items: [
					"Name, email address, and phone number from contact forms",
					"Company information and project requirements",
					"Communication preferences and interests",
					"Professional background and business needs",
				],
			},
			{
				subtitle: "Technical Information",
				items: [
					"Browser type, device information, and IP address",
					"Website usage patterns and navigation behavior",
					"Performance metrics and error logs",
					"Cookies and similar tracking technologies",
				],
			},
		],
	},
	{
		icon: <Eye className="w-6 h-6" />,
		title: "How We Use Information",
		content: [
			{
				subtitle: "Service Delivery",
				items: [
					"Respond to inquiries and provide technical support",
					"Deliver requested services and maintain client relationships",
					"Process project requirements and proposals",
					"Facilitate communication throughout project lifecycle",
				],
			},
			{
				subtitle: "Business Operations",
				items: [
					"Improve our services, website, and user experience",
					"Conduct market research and analyze industry trends",
					"Send relevant updates and promotional information (with consent)",
					"Ensure system security and prevent fraudulent activities",
				],
			},
		],
	},
	{
		icon: <Lock className="w-6 h-6" />,
		title: "Data Protection & Security",
		content: [
			{
				subtitle: "Security Measures",
				items: [
					"Industry-standard encryption for data transmission and storage",
					"Regular security audits and vulnerability assessments",
					"Secure hosting infrastructure with 24/7 monitoring",
					"Access controls and authentication protocols",
				],
			},
			{
				subtitle: "Data Retention",
				items: [
					"Personal data retained only as long as necessary for business purposes",
					"Automatic deletion of outdated information",
					"Secure disposal of physical and digital records",
					"Compliance with legal retention requirements",
				],
			},
		],
	},
	{
		icon: <Shield className="w-6 h-6" />,
		title: "Your Rights & Choices",
		content: [
			{
				subtitle: "Privacy Rights",
				items: [
					"Access and review your personal information",
					"Request corrections or updates to your data",
					"Delete your personal information (subject to legal requirements)",
					"Opt-out of marketing communications at any time",
				],
			},
			{
				subtitle: "Cookie Management",
				items: [
					"Control cookie preferences through browser settings",
					"Opt-out of analytics and tracking cookies",
					"Receive notifications about cookie usage",
					"Understand the purpose of each cookie type",
				],
			},
		],
	},
];

export default function PrivacyPolicyPage() {
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
							Privacy Policy
						</h1>
						<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
							Your privacy is our priority. Learn how we collect, use, and protect
							your personal information.
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
								<Shield className="w-6 h-6" />
							</div>
							<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
								Our Commitment to Privacy
							</h2>
						</div>
						<p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
							At Xhenvolt Uganda, we are committed to protecting your privacy and
							ensuring the security of your personal information. This comprehensive
							privacy policy explains our practices regarding the collection, use,
							and protection of your data when you interact with our website,
							services, or team.
						</p>
						<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
							We believe in transparency and your right to understand how your
							information is handled. This policy complies with applicable data
							protection laws and industry best practices to ensure your trust and
							confidence in our services.
						</p>
					</div>
				</motion.section>

				{/* Policy Sections */}
				{sections.map((section, sectionIndex) => (
					<motion.section
						key={sectionIndex}
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: sectionIndex * 0.1 }}
						className="mb-12"
					>
						<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
							<div className="flex items-center gap-4 mb-8">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
									{section.icon}
								</div>
								<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
									{section.title}
								</h2>
							</div>

							<div className="space-y-8">
								{section.content.map((subsection, subsectionIndex) => (
									<div key={subsectionIndex}>
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
											{subsection.subtitle}
										</h3>
										<ul className="space-y-3">
											{subsection.items.map((item, itemIndex) => (
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
									</div>
								))}
							</div>
						</div>
					</motion.section>
				))}

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
							Questions About Your Privacy?
						</h2>
						<p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
							We&apos;re here to help. If you have any questions about this privacy
							policy or how we handle your data, don&apos;t hesitate to reach out.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.a
								href="mailto:info@xhenvolt.com"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
							>
								<Mail className="w-5 h-5" />
								Email Our Privacy Team
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

				{/* Legal Notice */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Policy Updates
						</h3>
						<p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
							We may update this privacy policy from time to time to reflect changes
							in our practices, technology, or legal requirements. Material changes
							will be prominently posted on our website and, where appropriate,
							communicated directly to affected users. Your continued use of our
							services after any modifications indicates your acceptance of the
							updated policy.
						</p>
					</div>
				</motion.section>
			</div>

		</main>
	);
}
