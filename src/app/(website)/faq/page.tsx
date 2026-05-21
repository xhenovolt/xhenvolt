"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Search, HelpCircle, MessageCircle, Phone } from "lucide-react";

const faqs = [
	{
		category: "Services",
		questions: [
			{
				q: "What services does Xhenvolt offer?",
				a: "We provide comprehensive technology solutions including custom software development, mobile app development, UI/UX design, POS systems, school management systems, and process automation. Our expertise spans across web applications, enterprise solutions, and digital transformation consulting.",
			},
			{
				q: "Do you work with international clients?",
				a: "Yes, while we're based in Uganda, we serve clients across Africa and internationally. Our remote collaboration tools and project management systems enable us to work effectively with clients worldwide.",
			},
			{
				q: "What industries do you specialize in?",
				a: "We work across various industries including education, retail, healthcare, construction, finance (SACCOs), agriculture, and manufacturing. Our solutions are tailored to meet specific industry requirements and compliance standards.",
			},
		],
	},
	{
		category: "Process",
		questions: [
			{
				q: "How do I request a demo or consultation?",
				a: "You can request a demo by visiting our Contact page, calling us directly at +256 741 341 483, or emailing info@xhenvolt.com. We'll schedule a convenient time to discuss your requirements and demonstrate relevant solutions.",
			},
			{
				q: "What's your typical project timeline?",
				a: "Project timelines vary based on complexity and scope. Simple websites take 2-4 weeks, mobile apps 6-12 weeks, and enterprise systems 3-6 months. We provide detailed timelines during project planning and keep you updated throughout development.",
			},
			{
				q: "How do you handle project changes and revisions?",
				a: "We follow an agile development approach with regular check-ins and feedback sessions. Minor changes are included, while major scope changes are discussed and may affect timeline and budget. We maintain transparent communication throughout.",
			},
		],
	},
	{
		category: "Support",
		questions: [
			{
				q: "Do you provide support after implementation?",
				a: "Yes, all our solutions come with comprehensive support packages including technical support, maintenance, updates, and user training. We offer different support tiers based on your needs and budget.",
			},
			{
				q: "How secure are your systems?",
				a: "Security is our top priority. We implement bank-level security protocols including data encryption, secure hosting, regular security audits, user authentication, and compliance with international security standards like GDPR and ISO 27001.",
			},
			{
				q: "Can you integrate with our existing systems?",
				a: "Absolutely. We specialize in system integration and can connect our solutions with your existing software, databases, and third-party services through APIs and custom connectors, ensuring seamless data flow.",
			},
		],
	},
	{
		category: "Pricing",
		questions: [
			{
				q: "How do you price your services?",
				a: "We offer flexible pricing models including fixed-price projects, hourly rates, and monthly retainers. Pricing depends on project complexity, timeline, and required features. We provide detailed quotes after understanding your requirements.",
			},
			{
				q: "Do you offer payment plans?",
				a: "Yes, we offer flexible payment plans for larger projects, typically structured as milestone-based payments. This helps manage cash flow while ensuring project progress and quality delivery.",
			},
			{
				q: "What's included in your maintenance packages?",
				a: "Our maintenance packages include regular updates, security patches, bug fixes, performance monitoring, backup management, technical support, and user training. Packages are customized based on your system complexity.",
			},
		],
	},
];

export default function FAQPage() {
	const [openQuestion, setOpenQuestion] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");

	const categories = ["All", ...Array.from(new Set(faqs.map((faq) => faq.category)))];

	const filteredFaqs = faqs.filter(
		(faq) =>
			(activeCategory === "All" || faq.category === activeCategory) &&
			(searchTerm === "" ||
				faq.questions.some(
					(q) => q.q.toLowerCase().includes(searchTerm.toLowerCase()) || q.a.toLowerCase().includes(searchTerm.toLowerCase())
				))
	);

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
							Frequently Asked Questions
						</h1>
						<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
							Get instant answers to common questions about our services, processes, and support.
						</p>
					</motion.div>
				</div>
			</section>

			<div className="max-w-5xl mx-auto px-6 pb-16">
				{/* Search and Filter */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-12"
				>
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
						<div className="relative mb-6">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Search frequently asked questions..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
							/>
						</div>

						<div className="flex flex-wrap gap-3">
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => setActiveCategory(category)}
									className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
										activeCategory === category
											? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
											: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>
				</motion.section>

				{/* FAQ Content */}
				<section className="space-y-8">
					{filteredFaqs.map((faqCategory, categoryIndex) => (
						<motion.div
							key={faqCategory.category}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: categoryIndex * 0.1 }}
							className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50"
						>
							<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
								<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
									<HelpCircle className="w-5 h-5 text-white" />
								</div>
								{faqCategory.category}
							</h2>

							<div className="space-y-4">
								{faqCategory.questions
									.filter(
										(q) =>
											searchTerm === "" ||
											q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
											q.a.toLowerCase().includes(searchTerm.toLowerCase())
									)
									.map((faq, index) => {
										const questionId = `${faqCategory.category}-${index}`;
										const isOpen = openQuestion === questionId;

										return (
											<motion.div
												key={index}
												initial={{ opacity: 0 }}
												whileInView={{ opacity: 1 }}
												viewport={{ once: true }}
												transition={{ delay: index * 0.05 }}
												className="border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
											>
												<button
													onClick={() => setOpenQuestion(isOpen ? null : questionId)}
													className="w-full text-left p-6 flex justify-between items-center bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors duration-300"
												>
													<span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.q}</span>
													<div className="flex-shrink-0">{isOpen ? <Minus className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}</div>
												</button>

												<motion.div
													initial={false}
													animate={{ height: isOpen ? "auto" : 0 }}
													transition={{ duration: 0.3 }}
													className="overflow-hidden"
												>
													<div className="p-6 pt-0 bg-white/30 dark:bg-gray-800/30">
														<p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.a}</p>
													</div>
												</motion.div>
											</motion.div>
										);
									})}
							</div>
						</motion.div>
					))}
				</section>

				{/* Contact Section */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mt-16"
				>
					<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl">
						<h2 className="text-3xl md:text-4xl font-bold mb-6">Still Have Questions?</h2>
						<p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
							Can&apos;t find what you&apos;re looking for? Our team is here to help with personalized answers to your specific questions.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.a
								href="/contact"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
							>
								<MessageCircle className="w-5 h-5" />
								Send us a Message
							</motion.a>
							<motion.a
								href="tel:+256741341483"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
							>
								<Phone className="w-5 h-5" />
								Call Us Now
							</motion.a>
						</div>
					</div>
				</motion.section>
			</div>

		</main>
	);
}
