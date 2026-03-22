"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Smartphone, 
  ShoppingCart, 
  GraduationCap, 
  Workflow, 
  Palette,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Users,
  Trophy
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const services = [
	{
		title: "Custom Software Development",
		icon: <Code2 size={32} />,
		description: "Transform your business operations with tailor-made software solutions that scale with your growth.",
		detailedDesc: "We build enterprise-grade systems that automate workflows, manage resources, and provide real-time insights to drive informed decision-making.",
		features: [
			"Enterprise Resource Planning (ERP)",
			"Customer Relationship Management (CRM)",
			"Business Process Automation",
			"Data Analytics & Reporting",
			"API Development & Integration"
		],
		technologies: ["Enterprise-Grade", "Scalable", "Secure", "Cloud-Ready", "Reliable"],
		projects: ["Custom Business Management Systems", "Zyra SACCO System"],
		color: "from-blue-500 to-cyan-500"
	},
	{
		title: "Mobile App Development",
		icon: <Smartphone size={32} />,
		description: "Reach your customers anywhere with powerful, intuitive mobile applications for iOS and Android.",
		detailedDesc: "Our cross-platform mobile solutions deliver native performance while maintaining consistent user experiences across all devices.",
		features: [
			"iOS & Android Development",
			"Cross-Platform Solutions",
			"Progressive Web Apps (PWA)",
			"Mobile Commerce Integration",
			"Push Notifications & Analytics"
		],
		technologies: ["Cross-Platform", "High Performance", "Offline-Capable", "Secure", "Responsive"],
		projects: ["E-commerce Mobile Apps", "Service Booking Platforms"],
		color: "from-purple-500 to-pink-500"
	},
	{
		title: "POS & Inventory Systems",
		icon: <ShoppingCart size={32} />,
		description: "Streamline your retail operations with intelligent point-of-sale and inventory management solutions.",
		detailedDesc: "Our POS systems integrate seamlessly with your business processes, providing real-time inventory tracking, sales analytics, and customer management.",
		features: [
			"Real-time Inventory Tracking",
			"Multi-location Management",
			"Sales Analytics & Reporting",
			"Customer Loyalty Programs",
			"Offline Mode Capability"
		],
		technologies: ["Real-Time", "Multi-Location", "Reliable", "Fast", "Offline-Ready"],
		projects: ["Retail POS Systems", "Lypha Pharmacy System"],
		color: "from-green-500 to-emerald-500"
	},
	{
		title: "School Management Systems",
		icon: <GraduationCap size={32} />,
		description: "Digitize educational institutions with comprehensive academic and administrative management platforms.",
		detailedDesc: "From student enrollment to grade management, our education solutions streamline every aspect of school administration.",
		features: [
			"Student Information System",
			"Grade & Attendance Management",
			"Parent-Teacher Communication",
			"Fee Management & Billing",
			"Online Learning Integration"
		],
		technologies: ["Biometric-Enabled", "Cloud-Hosted", "Scalable", "Real-Time", "Secure"],
		projects: ["DRAIS School Management System"],
		color: "from-orange-500 to-red-500"
	},
	{
		title: "Process Automation",
		icon: <Workflow size={32} />,
		description: "Eliminate manual tasks and optimize workflows with intelligent automation solutions.",
		detailedDesc: "We design and implement automation systems that reduce operational costs, minimize errors, and increase productivity across your organization.",
		features: [
			"Workflow Automation",
			"Document Management",
			"Email & Communication Automation",
			"Data Processing & Migration",
			"Integration with Existing Systems"
		],
		technologies: ["Automated", "Integrated", "Scalable", "Enterprise-Ready"],
		projects: ["Document Processing Systems", "HR Automation Platforms"],
		color: "from-indigo-500 to-purple-500"
	},
	{
		title: "UI/UX Design",
		icon: <Palette size={32} />,
		description: "Create stunning, user-centric designs that engage customers and drive conversions.",
		detailedDesc: "Our design team crafts intuitive interfaces that not only look beautiful but also provide exceptional user experiences across all touchpoints.",
		features: [
			"User Experience Research",
			"Interface Design & Prototyping",
			"Brand Identity Development",
			"Responsive Web Design",
			"Usability Testing & Optimization"
		],
		technologies: ["User-Centered", "Responsive", "Accessible", "Modern", "Brand-Focused"],
		projects: ["Corporate Websites", "Mobile App Interfaces"],
		color: "from-pink-500 to-rose-500"
	}
];

const whyChooseUs = [
	{
		icon: <Zap className="w-8 h-8" />,
		title: "Lightning Fast Delivery",
		description: "Agile development processes ensure rapid deployment without compromising quality."
	},
	{
		icon: <Shield className="w-8 h-8" />,
		title: "Enterprise Security",
		description: "Bank-level security protocols protect your data and business operations."
	},
	{
		icon: <Users className="w-8 h-8" />,
		title: "Expert Team",
		description: "Seasoned professionals with deep expertise in cutting-edge technologies."
	},
	{
		icon: <Trophy className="w-8 h-8" />,
		title: "Proven Success",
		description: "Track record of delivering successful projects across various industries."
	}
];

export default function ServicesClient() {
	const [activeService, setActiveService] = useState(0);

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
							Technology Solutions That Drive Success
						</h1>
						<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
							From concept to deployment, we deliver innovative digital solutions that transform businesses and create lasting value for our clients across Africa.
						</p>
					</motion.div>
				</div>
			</section>

			<div className="max-w-7xl mx-auto px-6 pb-16">
				{/* Services Grid */}
				<section className="mb-20">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{services.map((service, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.05, y: -10 }}
								onClick={() => setActiveService(index)}
								className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 cursor-pointer hover:shadow-3xl transition-all duration-500 group"
							>
								<div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
									{service.icon}
								</div>
								
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
									{service.title}
								</h3>
								
								<p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
									{service.description}
								</p>
								
								<div className="space-y-3 mb-6">
									{service.features.slice(0, 3).map((feature, idx) => (
										<div key={idx} className="flex items-center gap-2">
											<CheckCircle className="w-4 h-4 text-green-500" />
											<span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
										</div>
									))}
								</div>
								
								<div className="flex items-center justify-between">
									<div className="flex flex-wrap gap-2">
										{service.technologies.slice(0, 3).map((tech, idx) => (
											<span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400">
												{tech}
											</span>
										))}
									</div>
									<ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-2 transition-transform" />
								</div>
							</motion.div>
						))}
					</div>
				</section>

				{/* Service Detail Modal/Section */}
				<motion.section
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="mb-20"
				>
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/50">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div>
								<div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${services[activeService].color} flex items-center justify-center text-white mb-6`}>
									{services[activeService].icon}
								</div>
								<h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
									{services[activeService].title}
								</h2>
								<p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
									{services[activeService].detailedDesc}
								</p>
								<div className="flex flex-wrap gap-3">
									{services[activeService].technologies.map((tech, idx) => (
										<span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-xl text-sm font-medium text-blue-700 dark:text-blue-300">
											{tech}
										</span>
									))}
								</div>
							</div>
							
							<div>
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h3>
								<div className="space-y-4">
									{services[activeService].features.map((feature, idx) => (
										<motion.div
											key={idx}
											initial={{ opacity: 0, x: 20 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{ delay: idx * 0.1 }}
											className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl"
										>
											<CheckCircle className="w-6 h-6 text-green-500" />
											<span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
										</motion.div>
									))}
								</div>
								
								<div className="mt-8">
									<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Projects</h4>
									<div className="space-y-2">
										{services[activeService].projects.map((project, idx) => (
											<div key={idx} className="flex items-center gap-2">
												<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
												<span className="text-gray-600 dark:text-gray-400">{project}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.section>

				{/* Why Choose Us */}
				<section className="mb-20">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
							Why Choose Xhenvolt?
						</h2>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
							We combine technical excellence with deep industry knowledge to deliver solutions that exceed expectations.
						</p>
					</motion.div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{whyChooseUs.map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.05, y: -5 }}
								className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 text-center hover:shadow-2xl transition-all duration-300"
							>
								<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
									{item.icon}
								</div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
								<p className="text-gray-600 dark:text-gray-300">{item.description}</p>
							</motion.div>
						))}
					</div>
				</section>

				{/* CTA Section */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl">
						<h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
						<p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
							Let&apos;s discuss your project and discover how our technology solutions can accelerate your growth and success.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.a
								href="/contact"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
							>
								Start Your Project
								<ArrowRight className="w-5 h-5" />
							</motion.a>
							<motion.a
								href="/contact"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
							>
								Schedule a Demo
							</motion.a>
						</div>
					</div>
				</motion.section>
			</div>
			
			<Footer />
		</main>
	);
}
