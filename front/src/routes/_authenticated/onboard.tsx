import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Upload, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { handleFileUpload } from "@/lib/utils";
import { useAuth } from "@/providers/auth";

interface OnboardingData {
	firstName: string;
	lastName: string;
	profilePicture: string;
}

export const Route = createFileRoute("/_authenticated/onboard")({
	beforeLoad: (ctx) => {
		console.log(ctx.context.auth.user?.onboarded)
		if (ctx.context.auth.user?.onboarded) {
			throw redirect({
				to: "/app",
			});
		}
	},
	component: OnboardingEmployee,
});

function OnboardingEmployee() {
	const [currentStep, setCurrentStep] = useState(0);
	const [data, setData] = useState<OnboardingData>({
		firstName: "",
		lastName: "",
		profilePicture: "",
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
	];

	const currentStepData = steps[currentStep];
	const isLastStep = currentStep === steps.length - 1;
	const progress = ((currentStep + 1) / steps.length) * 100;
	const auth = useAuth();

	const handleNext = async () => {
		if (currentStep < steps.length - 1) {
			console.log("not last step");
			setCurrentStep(currentStep + 1);
		} else {
			// Save data
			try {
				const res = await api.employee.onboard.$post({
					json: {
						firstName: data.firstName,
						lastName: data.lastName,
						avatar: data.profilePicture
					},
				});

				if (!res.ok) {
					throw new Error("Failed to save personal data");
				}

				await auth.refreshUser();
			} catch (error) {
				console.error("Failed to save personal data:", error);
			}
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

	const canProceed = () => {
		const currentValue = data[currentStepData.key];
		if (currentStepData.type === "file") {
			return true; // File uploads are optional
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
							className="w-full px-6 py-4 text-xl border border-zinc-300 focus:border-zinc-900 focus:outline-none transition-colors bg-white"
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
										className="w-32 h-32 object-cover border border-zinc-300"
									/>
								</div>
							) : (
								<div className="w-32 h-32 border border-dashed border-zinc-300 flex items-center justify-center mb-6">
									<User className="w-12 h-12 text-zinc-400" />
								</div>
							)}

							<label className="cursor-pointer bg-zinc-100 hover:bg-zinc-200 px-6 py-3 transition-colors flex items-center gap-2">
								<Upload className="w-5 h-5" />
								<span>Choose Image</span>
								<input
									type="file"
									accept="image/*"
									onChange={async (e) => {
										const url = await handleFileUpload(e);
										if (!url) return;
										handleInputChange(url);
									}}
									className="hidden"
								/>
							</label>
						</div>
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
					<div className="w-full bg-zinc-200 h-1">
						<div
							className="bg-zinc-900 h-1 transition-all duration-500 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<div className="flex justify-between mt-3 text-sm text-zinc-500">
						<span>
							Step {currentStep + 1} of {steps.length}
						</span>
						<span>{Math.round(progress)}% complete</span>
					</div>
				</div>

				{/* Step Content */}
				<div className="text-center mb-12">
					<div className="transition-all duration-500 ease-out transform">
						<h1 className="text-4xl md:text-5xl font-medium text-zinc-900 mb-4 leading-tight">
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
						className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
						Back
					</Button>

					<Button
						onClick={handleNext}
						disabled={!canProceed()}
						className={`flex items-center gap-2 px-8 py-4 font-medium transition-all ${
							canProceed()
								? "bg-zinc-900 hover:bg-zinc-800 text-white"
								: "bg-zinc-200 text-zinc-400 cursor-not-allowed"
						}`}
					>
						{isLastStep ? "Complete Setup" : "Continue"}
						{!isLastStep && <ArrowRight className="w-5 h-5" />}
					</Button>
				</div>
			</div>
		</div>
	);
}
