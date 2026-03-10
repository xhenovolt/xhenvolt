"use client";
import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Zap, Shield, Globe, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TeamSection from "../../components/TeamSection";

const values = [
	{
		icon: <Heart className="w-8 h-8" />,
		title: "Client-Centric Approach",
		description: "Every solution is tailored to meet our clients&apos; unique needs and business objectives."
	},
	{
		icon: <Zap className="w-8 h-8" />,
		title: "Innovation & Excellence",
		description: "We stay at the forefront of technology to deliver cutting-edge solutions that drive success."
	},
	{
		icon: <Shield className="w-8 h-8" />,
		title: "Integrity & Transparency",
		description: "We build trust through honest communication and transparent business practices."
	},
	{
		icon: <Globe className="w-8 h-8" />,
		title: "African Focus",
		description: "We understand the unique challenges and opportunities in Africa&apos;s growing tech landscape."
	}
];

const milestones = [
	{
		year: "June 2025",
		title: "Company Founded",
		description: "Xhenvolt Uganda was established with a vision to transform businesses through technology, marking the beginning of our journey in digital innovation."
	},
	{
		year: "July 2025",
		title: "First Major Clients",
		description: "Successfully launched with major clients: delivered DRAIS School Management System to Northgate School and Zyra SACCO Management System to Bumwena Scrap SACCO, establishing our foundation in educational and financial technology solutions."
	},
	{
		year: "August 2025",
		title: "Islamic Education Solutions",
		description: "Expanded into specialized educational solutions, developing custom systems for Bugembe Islamic Institute and Albayan Quran Memorization Center, along with several other educational institutions."
	},
	{
		year: "September 2025",
		title: "Rapid Growth Phase",
		description: "Achieved 25+ successful project deliveries across education, healthcare, finance, and other sectors, establishing ourselves as a trusted technology partner in East Africa."
	}
];

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
			<Navbar />
			
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
							Pioneering Digital Transformation in East Africa
						</h1>
						<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
							Since June 2025, we&apos;ve been rapidly empowering organizations across East Africa with innovative technology solutions that drive growth, efficiency, and success.
						</p>
					</motion.div>
				</div>
			</section>

			<div className="max-w-7xl mx-auto px-6 pb-16">
				{/* Mission, Vision, Values */}
				<section className="mb-20">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50"
						>
							<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6">
								<Target className="w-8 h-8" />
							</div>
							<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								To empower African businesses and institutions with cutting-edge technology solutions that drive sustainable growth, improve efficiency, and create lasting positive impact in communities across the continent.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.1 }}
							className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50"
						>
							<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-6">
								<Eye className="w-8 h-8" />
							</div>
							<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								To become the leading technology partner for organizations across Africa, driving digital transformation that bridges the gap between traditional operations and modern innovation, creating a more connected and prosperous continent.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50"
						>
							<div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mb-6">
								<CheckCircle className="w-8 h-8" />
							</div>
							<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Impact</h3>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								In just 3 months since our founding in June 2025, we&apos;ve delivered 25+ successful projects, serving 25+ satisfied clients across education, healthcare, finance, and construction sectors throughout East Africa.
							</p>
						</motion.div>
					</div>
				</section>

				{/* Story Section */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mb-20"
				>
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/50">
						<div className="text-center mb-12">
							<h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
							<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
								Since our founding in June 2025, we&apos;ve been on a mission to transform African businesses through innovative technology solutions that make a real difference.
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div>
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
									From Vision to Reality
								</h3>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
									Founded by visionary entrepreneur Hamuza Ibrahim, Xhenvolt Uganda emerged from a simple yet powerful idea: that every African business deserves access to world-class technology solutions. What started as a vision has quickly become a reality, with 25+ successful projects delivered in just our first three months of operation.
								</p>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
									Our rapid growth isn&apos;t just about numbers—it&apos;s about the real impact we&apos;re making. From helping schools reduce administrative burden by 60% to enabling SACCOs to serve 500+ members efficiently, we&apos;re proving that great technology can transform lives and communities across East Africa.
								</p>
							</div>
							
							<div className="hidden lg:block">
								<img src="/images/story-illustration.png" alt="Our Story Illustration" className="w-full h-auto" />
							</div>
						</div>
					</div>
				</motion.section>

				{/* Core Values */}
				<section className="mb-20">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
							Our Core Values
						</h2>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
							These principles guide every decision we make and every solution we build.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{values.map((value, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.05, y: -10 }}
								className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 text-center hover:shadow-3xl transition-all duration-500"
							>
								<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
									{value.icon}
								</div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
									{value.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
									{value.description}
								</p>
							</motion.div>
						))}
					</div>
				</section>

				{/* Timeline */}
				<section className="mb-20">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
							Our Journey
						</h2>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
							Remarkable milestones achieved in just 3 months since our founding in June 2025.
						</p>
					</motion.div>

					<div className="relative">
						<div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-purple-600 h-full rounded-full"></div>
						
						{milestones.map((milestone, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className={`relative flex items-center mb-12 ${
									index % 2 === 0 ? "flex-row" : "flex-row-reverse"
								}`}
							>
								<div className={`w-1/2 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
									<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
										<div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
											{milestone.year}
										</div>
										<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
											{milestone.title}
										</h3>
										<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
											{milestone.description}
										</p>
									</div>
								</div>
								
								<div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-gray-900"></div>
							</motion.div>
						))}
					</div>
				</section>
			</div>

			{/* Team Section */}
			<TeamSection />

			<Footer />
		</main>
	);
}
