import { createFileRoute, Link } from "@tanstack/react-router";
import { Hash } from "lucide-react";
import type React from "react";
import PlatformIntegration from "@/components/LandingPlatformIntegration";
import PlatformIcon from "../components/PlatformIcon";

const ChatMeshLandingPage: React.FC = () => {
	return (
		<div className="bg-gray-50 font-sans text-gray-800">
			<nav className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<span className="text-xl font-bold text-blue-600">ChatMesh</span>
						</div>
						<div className="flex items-center space-x-8">
							<div className="hidden md:flex space-x-6">
								<div className="relative group">
									<button className="font-medium hover:text-blue-600 focus:outline-none">
										Products
										<span className="ml-1 text-gray-400">↓</span>
									</button>
									<div className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
										<div
											className="py-1"
											role="menu"
											aria-orientation="vertical"
										>
											<a
												href="#features"
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											>
												Features
											</a>
											<a
												href="#integrations"
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											>
												Integrations
											</a>
											<a
												href="#pricing"
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											>
												Pricing
											</a>
										</div>
									</div>
								</div>
								<a
									href="#use-cases"
									className="font-medium hover:text-blue-600"
								>
									Use Cases
								</a>
								<a href="#pricing" className="font-medium hover:text-blue-600">
									Pricing
								</a>
							</div>
						</div>
						<div className="flex items-center">
							<button className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">
								Get a demo
							</button>
							<Link className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-700">
								Start for free
							</Link>
						</div>
					</div>
				</div>
			</nav>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div>
						<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
							<span className="text-red-600">Boost</span> Your Customer Support
							Efficiency
						</h1>
						<p className="text-xl text-gray-600 mb-8">
							ChatMesh helps businesses streamline customer support with
							powerful features across all messaging channels.
						</p>

						{/* Key Metrics - Accurate for Startup */}
						<div className="grid grid-cols-3 gap-4 mb-8">
							<div className="bg-blue-50 rounded-lg p-4 text-center">
								<div className="text-2xl font-bold text-blue-600">50%</div>
								<div className="text-sm text-gray-600">
									Faster Response Time
								</div>
								<div className="text-xs text-gray-500 mt-1">
									With unified inbox & replies
								</div>
							</div>
							<div className="bg-green-50 rounded-lg p-4 text-center">
								<div className="text-2xl font-bold text-green-600">100%</div>
								<div className="text-sm text-gray-600">
									Improved Collaboration
								</div>
								<div className="text-xs text-gray-500 mt-1">
									Internal notes & conversation history
								</div>
							</div>
							<div className="bg-purple-50 rounded-lg p-4 text-center">
								<div className="text-2xl font-bold text-purple-600">
									up to 80%
								</div>
								<div className="text-sm text-gray-600">Lower Costs</div>
								<div className="text-xs text-gray-500 mt-1">
									Much more affordable than competition
								</div>
							</div>
						</div>

						<div className="space-y-4 mb-8">
							<p className="flex items-start">
								<svg
									className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span>
									Unified inbox for Telegram, Zalo, WhatsApp, Messenger,
									Instagram & more
								</span>
							</p>
							<p className="flex items-start">
								<svg
									className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span>Auto-replies & conversation templates</span>
							</p>
							<p className="flex items-start">
								<svg
									className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span>Free plan available</span>
							</p>
						</div>

						<div className="flex justify-center sm:flex-row gap-3 mb-8">
							<button
								type="button"
								className="cursor-pointer inline-flex select-none items-center justify-center text-lg font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary bg-primary text-primary-foreground hover:bg-primary/90 px-6 w-full py-[13px] rounded-full border-none shadow-md"
							>
								<div className="flex items-center gap-2">
									<Hash />
									<span className="hidden sm:inline">Start for Free</span>
								</div>
							</button>
						</div>
					</div>

					<div className="relative">
						<div className="bg-blue-50 rounded-2xl p-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-white rounded-xl p-4 border border-gray-200">
									<div className="text-sm text-gray-500 mb-1">Telegram</div>
									<div className="flex justify-between items-center">
										<div className="font-medium">New order notification</div>
										<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
											Unread
										</span>
									</div>
								</div>
								<div className="bg-white rounded-xl p-4 border border-gray-200">
									<div className="text-sm text-gray-500 mb-1">WhatsApp</div>
									<div className="flex justify-between items-center">
										<div className="font-medium">Payment issue</div>
										<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
											New
										</span>
									</div>
								</div>
								<div className="bg-white rounded-xl p-4 border border-gray-200">
									<div className="text-sm text-gray-500 mb-1">Zalo</div>
									<div className="flex justify-between items-center">
										<div className="font-medium">Account verification</div>
										<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
											Resolved
										</span>
									</div>
								</div>
								<div className="bg-white rounded-xl p-4 border border-gray-200">
									<div className="text-sm text-gray-500 mb-1">Instagram</div>
									<div className="flex justify-between items-center">
										<div className="font-medium">Product inquiry</div>
										<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
											Unread
										</span>
									</div>
								</div>
							</div>

							<div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
								<div className="flex items-center justify-between mb-3">
									<h3 className="font-medium">Support Dashboard</h3>
									<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
										Live
									</span>
								</div>
								<div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
									<div className="text-center">
										<svg
											className="w-12 h-12 text-blue-500 mx-auto mb-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
											/>
										</svg>
										<p className="text-gray-600">
											Unified inbox for all channels
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="grid grid-cols-2 md:grid-cols-4 items-stretch">
				{[
					{
						title: "End Fragmented Support",
						content:
							"Stop juggling 5+ apps to answer customers. ChatMesh unifies Telegram, WhatsApp, Zalo, Instagram, Messenger, SMS, and more into one clean inbox.",
						metrics: [
							"No more missed messages",
							"Single workspace for all channels",
						],
					},
					{
						title: "Cut Response Times",
						content:
							"Respond faster with auto-replies, templates and notifications. Don't let your customers wait!",
						metrics: ["Automatic first reply", "Fewer follow-ups needed"],
					},
					{
						title: "Empower Your Support Team",
						content:
							"Assign conversations, add private notes, and see full customer history — all without leaving the chat. Perfect for teams of 2, 20 or 200.",
						metrics: [
							"Zero context switching",
							"Seamless handoffs between agents",
						],
					},
					{
						title: "Automate Routine Queries",
						content:
							"Let AI handle FAQs like “Where’s my order?” or “How do I reset my password?” — freeing your team for complex issues that need a human touch.",
						metrics: [
							"Up to 40% of tickets auto-resolved",
							"Train bots per channel",
						],
					},
					{
						title: "Start Free. Scale Confidently.",
						content:
							"Launch with our $0 plan (2 seats, 3 channels). Upgrade to Pro for unlimited channels, AI, and priority support.",
						metrics: ["Easy start", "Smooth upgrade"],
					},
					{
						title: "Built for Real Businesses",
						content:
							"From solopreneurs to growing SaaS teams — ChatMesh scales with you. Add seats, connect new channels, and maintain consistent support as you grow.",
						metrics: [
							"Used by e-commerce, SaaS, and local services",
							"Setup in minutes",
						],
					},
					{
						title: "Own Your Customer Data",
						content:
							"Every message, note, and interaction is stored securely in one place. No more lost context or repeating questions — just personalized, efficient support.",
						metrics: ["Full conversation history", "GDPR-ready data practices"],
					},
					{
						title: "Why Customers Choose ChatMesh",
						content:
							"Because support shouldn’t mean chaos. Get clarity, speed, and control — without enterprise complexity or pricing.",
						metrics: [
							"Simple UI, powerful results",
							"Made for teams who value time",
						],
					},
				].map((card, index) => (
					<div
						key={index}
						className="bg-white border border-secondary-200 p-6 hover:shadow-lg transition duration-300 flex flex-col h-full"
					>
						<h3 className="font-bold text-blue-600 mb-3">{card.title}</h3>
						<p className="text-gray-600 mb-4 text-sm">{card.content}</p>
						<div className="mt-auto">
							{card.metrics.map((metric, i) => (
								<div
									key={i}
									className="text-xs text-gray-500 mt-auto flex items-center"
								>
									<svg
										className="w-3 h-3 text-green-500 mr-1"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
									{metric}
								</div>
							))}
						</div>
					</div>
				))}
			</section>

			<PlatformIntegration />

			<section
				id="pricing"
				className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
			>
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">
						Simple, Transparent Pricing
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						No hidden fees. Start free and upgrade as you grow
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					<div className="bg-white rounded-2xl border border-gray-200 p-8">
						<h3 className="text-2xl font-bold mb-2">Free Plan</h3>
						<div className="text-4xl font-bold mb-4">
							$0<span className="text-xl font-normal">/month</span>
						</div>
						<ul className="space-y-3 mb-8">
							<li className="flex items-center">
								<svg
									className="w-5 h-5 text-green-500 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								2 seats
							</li>
							<li className="flex items-center">
								<svg
									className="w-5 h-5 text-green-500 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								3 integrations (website widget + 2 more)
							</li>
							<li className="flex items-center">
								<svg
									className="w-5 h-5 text-green-500 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Basic message management
							</li>
						</ul>
						<button className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
							Start for Free
						</button>
					</div>

					<div className="bg-white rounded-2xl border-2 border-blue-600 p-8 relative">
						<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
							POPULAR
						</div>
						<h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
						<div className="text-4xl font-bold mb-4">
							$39<span className="text-xl font-normal">/month</span>
						</div>
						<ul className="space-y-3 mb-8">
							<li className="flex items-center">
								<svg
									className="w-5 h-5 text-green-500 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								10 seats
							</li>
							<li className="flex items-center">
								<svg
									className="w-5 h-5 text-green-500 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Unlimited integrations
							</li>
							<li className="flex items-center">
								<svg
									className="w-5 h-5 text-green-500 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								All AI features
							</li>
							<li className="flex items-center">
								<svg
									className="w-5 h-5 text-green-500 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Additional seats at $5/month
							</li>
							<li className="flex items-center">
								<svg
									className="w-5 h-5 text-green-500 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Priority support
							</li>
						</ul>
						<button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
							Start Free Trial
						</button>
						<p className="text-center text-sm text-gray-500 mt-3">
							No credit card required • 30-day money-back guarantee
						</p>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl my-12">
				<div className="text-center">
					<h3 className="text-3xl font-bold mb-4">
						Ready to Simplify Your Customer Support?
					</h3>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
						Join businesses using ChatMesh to streamline their customer
						communication
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition duration-300">
							Start Free Trial
						</button>
						<button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-50 transition duration-300">
							Get a Demo
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ChatMeshLandingPage;

export const Route = createFileRoute("/")({
	component: ChatMeshLandingPage,
});
