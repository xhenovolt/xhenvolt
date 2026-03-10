"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, Zap, TrendingUp, Users, Bell } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const benefits = [
	{
		icon: <Zap className="w-6 h-6" />,
		title: "Latest Tech Insights",
		description: "Get exclusive insights on emerging technologies and digital transformation trends.",
	},
	{
		icon: <TrendingUp className="w-6 h-6" />,
		title: "Industry Updates",
		description: "Stay ahead with updates on technology solutions that drive business growth.",
	},
	{
		icon: <Users className="w-6 h-6" />,
		title: "Success Stories",
		description: "Learn from real case studies and client success stories from across Africa.",
	},
	{
		icon: <Bell className="w-6 h-6" />,
		title: "Exclusive Offers",
		description: "Be the first to know about special promotions and early access to new services.",
	},
];

export default function NewsletterPage() {
	const [form, setForm] = useState({ name: "", email: "", interests: [] as string[] });
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const interests = [
		"Custom Software Development",
		"Mobile App Development",
		"UI/UX Design",
		"POS Systems",
		"School Management",
		"Digital Marketing",
		"Cloud Solutions",
		"E-commerce",
	];

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		setError("");
	};

	const handleInterestChange = (interest: string) => {
		setForm((prev) => ({
			...prev,
			interests: prev.interests.includes(interest)
				? prev.interests.filter((i) => i !== interest)
				: [...prev.interests, interest],
		}));
	};

	const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.name || !form.email) {
			setError("Name and email are required.");
			return;
		}
		if (!validateEmail(form.email)) {
			setError("Please enter a valid email address.");
			return;
		}
		setIsLoading(true);
		// Simulate form submission
		setTimeout(() => {
			setSubmitted(true);
			setIsLoading(false);
			setForm({ name: "", email: "", interests: [] });
		}, 1500);
	};

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
							Stay Ahead of the Tech Curve
						</h1>
						<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
							Join thousands of forward-thinking professionals who rely on our newsletter for the latest technology insights, industry trends, and exclusive updates.
						</p>
					</motion.div>
				</div>
			</section>

			<div className="max-w-4xl mx-auto px-6 pb-16">
				{/* Benefits Section */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mb-16"
				>
					<h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
						What You&apos;ll Get
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{benefits.map((benefit, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.05, y: -5 }}
								className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
							>
								<div className="flex items-center gap-4 mb-4">
									<div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
										{benefit.icon}
									</div>
									<h3 className="font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
								</div>
								<p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
							</motion.div>
						))}
					</div>
				</motion.section>

				{/* Newsletter Form */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mb-16"
				>
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
						<div className="text-center mb-8">
							<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
								<Mail className="w-8 h-8" />
							</div>
							<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
								Subscribe to Our Newsletter
							</h2>
							<p className="text-gray-600 dark:text-gray-300">
								Join our community and never miss important updates about technology trends and opportunities.
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Full Name *
									</label>
									<input
										name="name"
										value={form.name}
										onChange={handleChange}
										required
										type="text"
										placeholder="Your full name"
										className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Email Address *
									</label>
									<input
										name="email"
										value={form.email}
										onChange={handleChange}
										required
										type="email"
										placeholder="your@email.com"
										className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
									What interests you? (Optional)
								</label>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
									{interests.map((interest) => (
										<button
											key={interest}
											type="button"
											onClick={() => handleInterestChange(interest)}
											className={`px-3 py-2 text-sm rounded-lg border transition-all duration-300 ${
												form.interests.includes(interest)
													? "bg-blue-600 text-white border-blue-600"
													: "bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400"
											}`}
										>
											{interest}
										</button>
									))}
								</div>
							</div>

							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl"
								>
									<AlertCircle className="w-5 h-5" />
									<span className="text-sm">{error}</span>
								</motion.div>
							)}

							{submitted && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl"
								>
									<CheckCircle className="w-5 h-5" />
									<span className="text-sm">Welcome to the Xhenvolt community! Check your email for confirmation.</span>
								</motion.div>
							)}

							<motion.button
								type="submit"
								disabled={isLoading}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								) : (
									<>
										<Mail className="w-5 h-5" />
										Subscribe Now
									</>
								)}
							</motion.button>

							<p className="text-xs text-gray-500 dark:text-gray-400 text-center">
								We respect your privacy. Unsubscribe at any time.
							</p>
						</form>
					</div>
				</motion.section>

				{/* Stats Section */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl">
						<h2 className="text-3xl md:text-4xl font-bold mb-8">Join Our Growing Community</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div>
								<div className="text-4xl font-bold mb-2">500+</div>
								<div className="text-lg opacity-90">Newsletter Subscribers</div>
							</div>
							<div>
								<div className="text-4xl font-bold mb-2">25+</div>
								<div className="text-lg opacity-90">Successful Projects</div>
							</div>
							<div>
								<div className="text-4xl font-bold mb-2">100%</div>
								<div className="text-lg opacity-90">Client Satisfaction</div>
							</div>
						</div>
					</div>
				</motion.section>
			</div>

			<Footer />
		</main>
	);
}
