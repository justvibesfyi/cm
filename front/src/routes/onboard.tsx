import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Building2,
	Check,
	Upload,
	User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/onboard")({
	component: OnboardingShadcn,
});

interface OnboardingData {
	firstName: string;
	lastName: string;
	profilePicture: string;
	businessName: string;
	businessDescription: string;
	businessPicture: string;
	userType: "regular" | "business";
}

function OnboardingShadcn() {
	const [currentStep, setCurrentStep] = useState(0);
	const [data, setData] = useState<OnboardingData>({
		firstName: "",
		lastName: "",
		profilePicture: "",
		businessName: "",
		businessDescription: "",
		businessPicture: "",
		userType: "regular",
	});

	const steps = [
		{
			id: "firstName",
			title: "What's your first name?",
			subtitle: "We'll use this to personalize your experience",
			type: "text",
			placeholder: "Enter your first name",
			key: "firstName" as keyof OnboardingData,
		},
		{
			id: "lastName",
			title: "And your last name?",
			subtitle: "This helps us create your complete profile",
			type: "text",
			placeholder: "Enter your last name",
			key: "lastName" as keyof OnboardingData,
		},
		{
			id: "profilePicture",
			title: "Add a profile picture",
			subtitle: "Help your team recognize you (optional)",
			type: "file",
			key: "profilePicture" as keyof OnboardingData,
		},
		{
			id: "userType",
			title: "How will you use ChatMesh?",
			subtitle: "This helps us customize your experience",
			type: "choice",
			key: "userType" as keyof OnboardingData,
		},
		{
			id: "businessName",
			title: "What's your business name?",
			subtitle: "This will appear in your customer conversations",
			type: "text",
			placeholder: "Enter your business name",
			key: "businessName" as keyof OnboardingData,
			businessOnly: true,
		},
		{
			id: "businessDescription",
			title: "Describe your business",
			subtitle: "A brief description of what you do",
			type: "textarea",
			placeholder: "We help businesses...",
			key: "businessDescription" as keyof OnboardingData,
			businessOnly: true,
		},
		{
			id: "businessPicture",
			title: "Add your business logo",
			subtitle: "This will represent your brand (optional)",
			type: "file",
			key: "businessPicture" as keyof OnboardingData,
			businessOnly: true,
		},
	];

	const getVisibleSteps = () => {
		if (data.userType === "regular") {
			return steps.filter((step) => !step.businessOnly);
		}
		return steps;
	};

	const visibleSteps = getVisibleSteps();
	const currentStepData = visibleSteps[currentStep];
	const isLastStep = currentStep === visibleSteps.length - 1;
	const progress = ((currentStep + 1) / visibleSteps.length) * 100;

	const handleNext = () => {
		if (currentStep < visibleSteps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			console.log("Onboarding completed:", data);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleInputChange = (value: string) => {
		setData((prev) => ({
			...prev,
			[currentStepData.key]: value,
		}));
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				handleInputChange(result);
			};
			reader.readAsDataURL(file);
		}
	};

	const canProceed = () => {
		const currentValue = data[currentStepData.key];
		if (currentStepData.type === "file") {
			return true;
		}
		if (currentStepData.type === "choice") {
			return data.userType !== "";
		}
		return currentValue.trim() !== "";
	};

	const renderStepContent = () => {
		switch (currentStepData.type) {
			case "text":
				return (
					<div className="w-full max-w-md">
						<Input
							type="text"
							value={data[currentStepData.key] as string}
							onChange={(e) => handleInputChange(e.target.value)}
							placeholder={currentStepData.placeholder}
							className="text-xl h-14 px-6"
							autoFocus
						/>
					</div>
				);

			case "textarea":
				return (
					<div className="w-full max-w-md">
						<Textarea
							value={data[currentStepData.key] as string}
							onChange={(e) => handleInputChange(e.target.value)}
							placeholder={currentStepData.placeholder}
							rows={4}
							className="text-xl px-6 py-4 resize-none border-zinc-900"
							autoFocus
						/>
					</div>
				);

			case "file":
				return (
					<div className="w-full max-w-md">
						<div className="flex flex-col items-center">
							{data[currentStepData.key] ? (
								<div className="mb-6">
									<img
										src={data[currentStepData.key] as string}
										alt="Preview"
										className="w-32 h-32 object-cover border"
									/>
								</div>
							) : (
								<div className="w-32 h-32 border border-dashed flex items-center justify-center mb-6">
									{currentStepData.id === "profilePicture" ? (
										<User className="w-12 h-12 text-zinc-400" />
									) : (
										<Building2 className="w-12 h-12 text-zinc-400" />
									)}
								</div>
							)}

							<Button variant="secondary" className="relative">
								<Upload className="w-4 h-4 mr-2" />
								Choose Image
								<input
									type="file"
									accept="image/*"
									onChange={handleFileUpload}
									className="absolute inset-0 opacity-0 cursor-pointer"
								/>
							</Button>
						</div>
					</div>
				);

			case "choice":
				return (
					<div className="w-full max-w-md space-y-4">
						<Card
							className={`cursor-pointer transition-all hover:shadow-md ${
								data.userType === "regular" ? "ring-2 ring-black" : ""
							}`}
							onClick={() => handleInputChange("regular")}
						>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="text-left">
										<h3 className="text-lg font-medium">Personal Use</h3>
										<p className="text-zinc-600">I'm using this for myself</p>
									</div>
									{data.userType === "regular" && <Check className="w-6 h-6" />}
								</div>
							</CardContent>
						</Card>

						<Card
							className={`cursor-pointer transition-all hover:shadow-md ${
								data.userType === "business" ? "ring-2 ring-black" : ""
							}`}
							onClick={() => handleInputChange("business")}
						>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="text-left">
										<h3 className="text-lg font-medium">Business</h3>
										<p className="text-zinc-600">
											I'm setting up for my business
										</p>
									</div>
									{data.userType === "business" && (
										<Check className="w-6 h-6" />
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			<div className="w-full max-w-2xl">
				{/* Progress Bar */}
				<div className="mb-12">
					<Progress value={progress} className="h-1" />
					<div className="flex justify-between mt-3 text-sm text-zinc-500">
						<span>
							Step {currentStep + 1} of {visibleSteps.length}
						</span>
						<span>{Math.round(progress)}% complete</span>
					</div>
				</div>

				{/* Step Content */}
				<div className="text-center mb-12">
					<div className="transition-all duration-500 ease-out transform">
						<h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight">
							{currentStepData.title}
						</h1>
						<p className="text-xl text-zinc-600 mb-12">
							{currentStepData.subtitle}
						</p>

						<div className="flex justify-center mb-12">
							{renderStepContent()}
						</div>
					</div>
				</div>

				{/* Navigation */}
				<div className="flex items-center justify-between">
					<Button
						variant="ghost"
						onClick={handleBack}
						disabled={currentStep === 0}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="w-4 h-4" />
						Back
					</Button>

					<Button
						onClick={handleNext}
						disabled={!canProceed()}
						className="flex items-center gap-2 px-8 rounded-xs"
					>
						{isLastStep ? "Complete Setup" : "Continue"}
						{!isLastStep && <ArrowRight className="w-4 h-4" />}
					</Button>
				</div>
			</div>
		</div>
	);
}