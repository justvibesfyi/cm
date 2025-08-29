import { createFileRoute, redirect } from "@tanstack/react-router";
import {
	BarChart2,
	Check,
	Facebook,
	Github,
	Linkedin,
	Mail,
	MessageCircle,
	MessageSquare,
	MessageSquareMore,
	MessageSquareText,
	Send,
	Settings,
	Shield,
	Twitter,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import isAuthenticated from "../lib/isAuthenticated";

export const Route = createFileRoute("/")({
	component: ChatMeshLanding,
	beforeLoad: async () => {
		if (isAuthenticated()) {
			throw redirect({
				to: "/app",
				replace: false,
			});
		}
	},
});

function ChatMeshLanding() {
	const [email, setEmail] = useState("");

	// Platform data for the icons grid
	const platforms = [
		{
			name: "WhatsApp",
			icon: <MessageSquare className="w-8 h-8" />,
			color: "#25D366",
		},
		{ name: "Telegram", icon: <Send className="w-8 h-8" />, color: "#0088CC" },
		{
			name: "Messenger",
			icon: <MessageCircle className="w-8 h-8" />,
			color: "#1877F2",
		},
		{ name: "Email", icon: <Mail className="w-8 h-8" />, color: "#EA4335" },
		{
			name: "SMS",
			icon: <MessageSquareText className="w-8 h-8" />,
			color: "#34B7F1",
		},
		{
			name: "Slack",
			icon: <MessageSquareMore className="w-8 h-8" />,
			color: "#4A154B",
		},
	];

	// Features data for the cards
	const features = [
		{
			title: "Unified Inbox",
			icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
			description: "Manage all customer conversations from a single dashboard",
		},
		{
			title: "24/7 Availability",
			icon: <Zap className="w-8 h-8 text-blue-500" />,
			description: "Never miss a customer message with automated responses",
		},
		{
			title: "Team Collaboration",
			icon: <Users className="w-8 h-8 text-blue-500" />,
			description: "Assign conversations and collaborate with your team",
		},
		{
			title: "Analytics",
			icon: <BarChart2 className="w-8 h-8 text-blue-500" />,
			description: "Track response times and customer satisfaction metrics",
		},
		{
			title: "Security",
			icon: <Shield className="w-8 h-8 text-blue-500" />,
			description: "Enterprise-grade security for all your customer data",
		},
		{
			title: "Customization",
			icon: <Settings className="w-8 h-8 text-blue-500" />,
			description: "Tailor workflows to match your business processes",
		},
	];

	// Pricing plans data
	const pricingPlans = [
		{
			name: "Starter Plan",
			price: "Free",
			features: [
				"Up to 3 messaging platforms",
				"Basic analytics",
				"Email support",
				"1 user",
			],
			highlighted: false,
			ctaText: "Get Started",
		},
		{
			name: "Professional Plan",
			price: "$29/user/month",
			features: [
				"Unlimited messaging platforms",
				"Advanced analytics",
				"Priority support",
				"Unlimited users",
				"Team collaboration",
				"Custom workflows",
			],
			highlighted: true,
			ctaText: "Start Free Trial",
		},
	];

	// Footer links
	const footerLinks = {
		product: ["Features", "Integrations", "Pricing", "Updates"],
		company: ["About", "Blog", "Careers", "Contact"],
		support: ["Help Center", "Documentation", "Community", "API Status"],
	};

	return (
		<div className="font-sans text-gray-900">
			{/* Hero Section */}
			<section className="bg-black text-white py-20 px-4">
				<div className="max-w-6xl mx-auto text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						UNIFY YOUR <span className="text-blue-500">CUSTOMER</span>{" "}
						CONVERSATIONS
					</h1>
					<p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
						Connect all your messaging platforms in one place and provide
						seamless customer support.
					</p>

					{/* Platform Icons Grid */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12 max-w-4xl mx-auto">
						{platforms.map((platform, index) => (
							<div key={index} className="flex flex-col items-center">
								<div
									className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
									style={{ backgroundColor: `${platform.color}20` }}
								>
									<div style={{ color: platform.color }}>{platform.icon}</div>
								</div>
								<span className="text-gray-400">{platform.name}</span>
							</div>
						))}
					</div>

					{/* CTA */}
					<div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-2xl mx-auto mb-6">
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="px-4 py-3 rounded-lg text-gray-200 border-gray-400 border-1 w-full md:w-auto flex-grow"
						/>
						<button
							className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition duration-300 w-full md:w-auto cursor-pointer"
							onClick={async () => await login(email)}
						>
							Start Free Trial
						</button>
					</div>
					<p className="text-green-400"> ✓ No credit card required</p>
				</div>
			</section>

			{/* Why Choose ChatMesh Section */}
			<section className="bg-white py-20 px-4">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
						Why Choose ChatMesh?
					</h2>
					<p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
						Our platform helps you streamline customer communication, improve
						response times, and increase satisfaction.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
							>
								<div className="mb-4">{feature.icon}</div>
								<h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Messaging Platform Section */}
			<section className="bg-black text-white py-20 px-4">
				<div className="max-w-6xl mx-auto text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						CONNECT ALL YOUR{" "}
						<span className="text-blue-500">MESSAGING PLATFORMS</span>
					</h2>
					<p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto">
						Integrate with all popular messaging platforms and manage
						conversations from a single dashboard.
					</p>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12 max-w-4xl mx-auto">
						{platforms.map((platform, index) => (
							<div key={index} className="flex flex-col items-center">
								<div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 bg-white">
									<div style={{ color: platform.color }}>{platform.icon}</div>
								</div>
								<span className="text-gray-300">{platform.name}</span>
							</div>
						))}
					</div>

					<button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition duration-300">
						See All Integrations
					</button>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="bg-white py-20 px-4">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
						Simple, Transparent Pricing
					</h2>
					<p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
						Choose the plan that works best for your team.
					</p>

					<div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
						{pricingPlans.map((plan, index) => (
							<div
								key={index}
								className={`flex-1 rounded-xl p-8 ${plan.highlighted ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50"}`}
							>
								<h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
								<p className="text-3xl font-bold mb-6">{plan.price}</p>

								<ul className="mb-8 space-y-3">
									{plan.features.map((feature, idx) => (
										<li key={idx} className="flex items-start">
											<Check className="text-green-500 mr-2 mt-1 flex-shrink-0" />
											<span>{feature}</span>
										</li>
									))}
								</ul>

								<button
									className={`w-full py-3 rounded-lg font-medium transition duration-300 ${
										plan.highlighted
											? "bg-blue-500 hover:bg-blue-600 text-white"
											: "bg-white border border-gray-300 hover:bg-gray-100 text-gray-800"
									}`}
								>
									{plan.ctaText}
								</button>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className="bg-black text-white py-20 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-8">
						READY TO UNIFY YOUR CUSTOMER SUPPORT?
					</h2>

					<div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
						<input
							type="email"
							placeholder="Enter your email"
							className="px-4 py-3 rounded-lg text-gray-900 w-full md:w-auto flex-grow"
						/>
						<button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition duration-300 w-full md:w-auto">
							Start Free Trial
						</button>
					</div>
					<p className="text-gray-400">
						✓ No credit card required • 14-day trial
					</p>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-gray-400 py-12 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between">
						<div className="mb-8 md:mb-0 md:w-1/3">
							<div className="flex items-center mb-4">
								<MessageSquare className="w-8 h-8 text-blue-500 mr-2" />
								<span className="text-white text-xl font-bold">ChatMesh</span>
							</div>
							<p className="mb-4">
								Unify all your customer conversations in one place and provide
								exceptional support across all platforms.
							</p>
							<div className="flex space-x-4">
								<Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
								<Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
								<Linkedin className="w-5 h-5 hover:text-white cursor-pointer" />
								<Github className="w-5 h-5 hover:text-white cursor-pointer" />
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:w-2/3">
							<div>
								<h4 className="text-white font-semibold mb-4">Product</h4>
								<ul className="space-y-2">
									{footerLinks.product.map((link, index) => (
										<li key={index} className="hover:text-white cursor-pointer">
											{link}
										</li>
									))}
								</ul>
							</div>
							<div>
								<h4 className="text-white font-semibold mb-4">Company</h4>
								<ul className="space-y-2">
									{footerLinks.company.map((link, index) => (
										<li key={index} className="hover:text-white cursor-pointer">
											{link}
										</li>
									))}
								</ul>
							</div>
							<div>
								<h4 className="text-white font-semibold mb-4">Support</h4>
								<ul className="space-y-2">
									{footerLinks.support.map((link, index) => (
										<li key={index} className="hover:text-white cursor-pointer">
											{link}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-12 pt-6 text-center">
						<p>© 2024 ChatMesh. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default ChatMeshLanding;
