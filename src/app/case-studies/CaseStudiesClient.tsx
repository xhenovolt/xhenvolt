"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const caseStudies = [
	{
		title: "Lypha POS System",
		client: "Multiple pharmacies and retail stores",
		challenge:
			"Manual sales tracking and inventory management leading to errors and delays.",
		solution:
			"Implemented a cloud-based POS system with real-time inventory management, sales reporting, and analytics.",
		results:
			"Reduced stock discrepancies, improved sales tracking, and enabled faster decision-making.",
	},
	{
		title: "EduConnect",
		client: "Various schools in Uganda",
		challenge:
			"Traditional manual administration was time-consuming and error-prone.",
		solution:
			"Developed a comprehensive school management system covering attendance, grading, parent communication, and reporting.",
		results:
			"Streamlined school operations, improved communication with parents, and enhanced overall efficiency.",
	},
	{
		title: "AgroTech Platform",
		client: "Agricultural cooperatives and marketplaces",
		challenge:
			"Farmers lacked access to reliable buyer connections and market analytics.",
		solution:
			"Created a web platform connecting farmers with buyers, integrated with real-time data analytics and reporting.",
		results:
			"Expanded market reach for farmers, improved transparency, and enabled data-driven decision-making.",
	},
	{
		title: "Custom Web & Mobile Solutions",
		client: "Various SMEs and startups",
		challenge:
			"Businesses needed modern digital platforms to engage customers effectively.",
		solution:
			"Designed and developed responsive websites and mobile apps tailored to client requirements.",
		results:
			"Improved online presence, customer engagement, and operational efficiency.",
	},
];

export default function CaseStudiesClient() {
	return (
		<main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
			<div className="pt-24 md:pt-32 max-w-5xl mx-auto px-6">
				{/* Headline */}
				<section className="text-center mb-12">
					<motion.h1
						initial={{ opacity: 0, y: -30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-4"
					>
						Case Studies
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="text-lg md:text-xl text-gray-700 dark:text-gray-200"
					>
						Real Projects, Real Results, Real Impact
					</motion.p>
				</section>
				{/* Introduction */}
				<section className="mb-12 text-center">
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto"
					>
						At Xhenvolt Uganda, we take pride in delivering{" "}
						<b>practical, innovative solutions</b> that transform businesses.
						<br className="hidden md:block" /> Explore our case studies to see
						how we&apos;ve helped clients streamline operations, increase
						efficiency, and achieve their goals.
					</motion.p>
				</section>
				{/* Featured Projects */}
				<section className="mb-16">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{caseStudies.map((cs, i) => (
							<motion.div
								key={cs.title}
								whileHover={{
									scale: 1.03,
									boxShadow: "0 8px 32px rgba(59,130,246,0.10)",
								}}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 flex flex-col gap-3 group cursor-pointer border border-transparent hover:border-blue-400"
							>
								<h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 group-hover:text-yellow-400 transition-colors mb-2">
									{cs.title}
								</h3>
								<div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
									<b>Client:</b> {cs.client}
								</div>
								<div className="mb-1">
									<b>Challenge:</b>{" "}
									<span className="text-gray-700 dark:text-gray-200">
										{cs.challenge}
									</span>
								</div>
								<div className="mb-1">
									<b>Solution:</b>{" "}
									<span className="text-gray-700 dark:text-gray-200">
										{cs.solution}
									</span>
								</div>
								<div>
									<b>Results:</b>{" "}
									<span className="text-gray-700 dark:text-gray-200">
										{cs.results}
									</span>
								</div>
							</motion.div>
						))}
					</div>
				</section>
				{/* Call-to-Action Banner */}
				<section className="mb-16">
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.7 }}
						className="bg-blue-700 dark:bg-blue-800 rounded-xl shadow p-12 flex flex-col items-center text-center text-white"
					>
						<h2 className="text-2xl md:text-3xl font-bold mb-4">
							Interested in Similar Results?
						</h2>
						<p className="mb-8">
							Let Xhenvolt Uganda build tailored solutions that solve your
							business challenges and drive growth.
						</p>
						<div className="flex gap-4">
							<Link
								href="/contact"
								className="px-6 py-3 bg-yellow-400 text-blue-900 rounded-lg font-semibold shadow hover:bg-yellow-300 transition-colors"
							>
								Contact Us
							</Link>
							<Link
								href="/contact"
								className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-100 transition-colors"
							>
								Request a Demo
							</Link>
						</div>
					</motion.div>
				</section>
			</div>
		</main>
	);
}
