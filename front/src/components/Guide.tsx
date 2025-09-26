import { Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";

interface GuideStep {
	id: string;
	title: string;
	description: string;
	content: {
		type: "text" | "image" | "text-image";
		text?: string;
		image?: string;
		imageAlt?: string;
	};
	tip?: string;
}

interface Guide {
	id: string;
	title: string;
	description: string;
	platform: string;
	estimatedTime: string;
	steps: GuideStep[];
}

// Sample guide data
const telegramGuide: Guide = {
	id: "telegram-setup",
	title: "Telegram Bot API Setup",
	description: "Learn how to create a Telegram bot and get your API token",
	platform: "Telegram",
	estimatedTime: "5 minutes",
	steps: [
		{
			id: "step-1",
			title: "Open Telegram and Find BotFather",
			description:
				"Start by opening Telegram and searching for the official BotFather",
			content: {
				type: "text-image",
				text: 'Open your Telegram app and search for "@BotFather" in the search bar. BotFather is the official bot that helps you create and manage your Telegram bots.',
				image:
					"https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600",
				imageAlt: "Telegram search interface",
			},
			tip: "Make sure you're messaging the official @BotFather account with the blue checkmark",
		},
		{
			id: "step-2",
			title: "Create a New Bot",
			description: "Use the /newbot command to start creating your bot",
			content: {
				type: "text-image",
				text: 'Send the command "/newbot" to BotFather. It will ask you to choose a name for your bot. This name will be displayed in contact details and elsewhere.',
				image:
					"https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600",
				imageAlt: "Creating new bot in BotFather",
			},
		},
		{
			id: "step-3",
			title: "Choose Bot Username",
			description: "Set a unique username for your bot",
			content: {
				type: "text",
				text: 'After choosing a name, BotFather will ask for a username. The username must be unique and end with "bot" (e.g., "mychatmesh_bot"). This username will be used in links and mentions.',
			},
			tip: 'Bot usernames are case-insensitive and must end with "bot"',
		},
		{
			id: "step-4",
			title: "Get Your API Token",
			description: "Copy the API token provided by BotFather",
			content: {
				type: "text-image",
				text: 'Once your bot is created, BotFather will provide you with an API token. This token looks like "123456789:ABCdefGHIjklMNOpqrsTUVwxyz". Copy this token - you\'ll need it for ChatMesh.',
				image:
					"https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=600",
				imageAlt: "API token from BotFather",
			},
			tip: "Keep your API token secure and never share it publicly",
		},
	],
};

const whatsappGuide: Guide = {
	id: "whatsapp-setup",
	title: "WhatsApp Business API Setup",
	description: "Set up WhatsApp Business API for your ChatMesh integration",
	platform: "WhatsApp",
	estimatedTime: "10 minutes",
	steps: [
		{
			id: "step-1",
			title: "Create Facebook Developer Account",
			description:
				"Sign up for a Facebook Developer account to access WhatsApp Business API",
			content: {
				type: "text-image",
				text: "Go to developers.facebook.com and create a developer account. You'll need to verify your account with a phone number and email address.",
				image:
					"https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=600",
				imageAlt: "Facebook Developer portal",
			},
		},
		{
			id: "step-2",
			title: "Create a New App",
			description: "Create a new app in the Facebook Developer console",
			content: {
				type: "text-image",
				text: 'Click "Create App" and select "Business" as the app type. Give your app a name and provide your contact email.',
				image:
					"https://images.pexels.com/photos/270366/pexels-photo-270366.jpeg?auto=compress&cs=tinysrgb&w=600",
				imageAlt: "Creating Facebook app",
			},
			tip: "Choose a descriptive name that represents your business",
		},
		{
			id: "step-3",
			title: "Add WhatsApp Product",
			description: "Add the WhatsApp product to your Facebook app",
			content: {
				type: "text",
				text: 'In your app dashboard, find the "WhatsApp" product and click "Set up". This will add WhatsApp Business API capabilities to your app.',
			},
		},
		{
			id: "step-4",
			title: "Get Access Token",
			description: "Generate your WhatsApp Business API access token",
			content: {
				type: "text-image",
				text: "Navigate to the WhatsApp > Getting Started section. Here you'll find your temporary access token. For production use, you'll need to generate a permanent token.",
				image:
					"https://images.pexels.com/photos/270557/pexels-photo-270557.jpeg?auto=compress&cs=tinysrgb&w=600",
				imageAlt: "WhatsApp access token",
			},
			tip: "Temporary tokens expire after 24 hours - generate a permanent one for production",
		},
		{
			id: "step-5",
			title: "Configure Webhook",
			description: "Set up webhook URL for receiving messages",
			content: {
				type: "text",
				text: "In the WhatsApp configuration, add your webhook URL where ChatMesh will receive incoming messages. Make sure to verify the webhook with the provided verify token.",
			},
		},
	],
};

const guides = {
	telegram: telegramGuide,
	whatsapp: whatsappGuide,
};

interface GuidePageProps {
	guideId?: keyof typeof guides;
}

function GuidePage({ guideId = "telegram" }: GuidePageProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const guide = guides[guideId];

	if (!guide) {
		return <div>Guide not found</div>;
	}

	const currentStepData = guide.steps[currentStep];
	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === guide.steps.length - 1;
	const progress = ((currentStep + 1) / guide.steps.length) * 100;

	const handleNext = () => {
		if (!isLastStep) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (!isFirstStep) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleStepClick = (stepIndex: number) => {
		setCurrentStep(stepIndex);
	};

	const renderStepContent = () => {
		const { content } = currentStepData;

		switch (content.type) {
			case "text":
				return (
					<div className="prose prose-lg max-w-none">
						<p className="text-zinc-700 leading-relaxed">{content.text}</p>
					</div>
				);

			case "image":
				return (
					<div className="w-full">
						<img
							src={content.image}
							alt={content.imageAlt || "Guide step image"}
							className="w-full max-w-2xl mx-auto rounded-xl shadow-lg border border-zinc-100"
						/>
					</div>
				);

			case "text-image":
				return (
					<div className="space-y-8">
						<div className="prose prose-lg max-w-none text-zinc-700">
							<p className="text-lg leading-relaxed">{content.text}</p>
						</div>
						<div className="w-full">
							<img
								src={content.image}
								alt={content.imageAlt || "Guide step image"}
								className="w-full max-w-2xl mx-auto rounded-xl shadow-lg border border-zinc-100"
							/>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-zinc-100">
				<div className="max-w-4xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link
							to="/manage"
							className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-50"
						>
							<ArrowLeft className="w-5 h-5" />
							<span>Back to Dashboard</span>
						</Link>

						<div className="text-center">
							<h1 className="text-xl font-semibold text-zinc-900">
								{guide.title}
							</h1>
							<p className="text-sm text-zinc-500">
								{guide.estimatedTime} • {guide.platform}
							</p>
						</div>

						<div className="flex items-center gap-2 text-sm text-zinc-500">
							<span>
								{currentStep + 1} of {guide.steps.length}
							</span>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="mt-4">
						<div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
							<div
								className="bg-blue-500 h-2 transition-all duration-300 ease-out rounded-full"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Step Navigation Sidebar */}
					<div className="lg:col-span-1 lg:max-w-xs">
						<div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-zinc-100 p-4">
							<h3 className="text-sm font-medium text-zinc-900 mb-4">Steps</h3>
							<nav className="space-y-3">
								{guide.steps.map((step, index) => (
									<Button
										key={step.id}
										onClick={() => handleStepClick(index)}
										className={`w-full text-left p-3 rounded-xl transition-all ${
											index === currentStep
												? "bg-blue-50 border border-blue-200"
												: index < currentStep
													? "bg-green-50 border border-green-200"
													: "bg-white border border-zinc-100 hover:border-zinc-200 hover:shadow-sm"
										}`}
									>
										<div className="flex items-center gap-3">
											<div
												className={`w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full flex-shrink-0 ${
													index === currentStep
														? "bg-blue-500 text-white"
														: index < currentStep
															? "bg-green-500 text-white"
															: "bg-zinc-100 text-zinc-500"
												}`}
											>
												{index < currentStep ? (
													<Check className="w-4 h-4" />
												) : (
													<span>{index + 1}</span>
												)}
											</div>
											<span
												className={`text-sm leading-tight ${
													index === currentStep
														? "text-blue-700 font-medium"
														: index < currentStep
															? "text-green-700"
															: "text-zinc-600"
												}`}
											>
												{step.title}
											</span>
										</div>
									</Button>
								))}
							</nav>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-2">
						<div className="space-y-8">
							{/* Step Header */}
							<div>
								<div className="flex items-center gap-4 mb-6">
									<div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
										{currentStep + 1}
									</div>
									<div>
										<h2 className="text-3xl font-bold text-zinc-900 mb-2">
											{currentStepData.title}
										</h2>
										<p className="text-lg text-zinc-600">
											{currentStepData.description}
										</p>
									</div>
								</div>
							</div>

							{/* Step Content */}
							<div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
								{renderStepContent()}

								{/* Tip */}
								{currentStepData.tip && (
									<div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
										<div className="flex items-start gap-3">
											<div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
												!
											</div>
											<div>
												<p className="text-sm font-semibold text-blue-900 mb-2">
													💡 Pro Tip
												</p>
												<p className="text-sm text-blue-800 leading-relaxed">
													{currentStepData.tip}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Navigation */}
							<div className="flex items-center justify-between pt-8">
								<Button
									onClick={handlePrevious}
									disabled={isFirstStep}
									className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
										isFirstStep
											? "text-zinc-400 cursor-not-allowed"
											: "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-zinc-200"
									}`}
								>
									<ChevronLeft className="w-4 h-4" />
									Previous
								</Button>

								<div className="flex items-center gap-4">
									{isLastStep ? (
										<Link
											to="/manage"
											className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
										>
											Complete Setup
											<ExternalLink className="w-4 h-4" />
										</Link>
									) : (
										<Button
											onClick={handleNext}
											className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
										>
											Next Step
											<ChevronRight className="w-4 h-4" />
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GuidePage;
