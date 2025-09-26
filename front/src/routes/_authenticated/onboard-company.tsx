import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Building2,
	CheckCircle,
	Clock,
	Loader2,
	Mail,
	Upload,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { handleFileUpload } from "@/lib/utils";
import { useAuth } from "@/providers/auth";

interface BusinessData {
	name: string;
	avatar: string;
}

interface Invitation {
	id: string;
	email: string;
	company_id: number;
	created_by: string;
	created_at: string;
	expires_at: string;
}

export const Route = createFileRoute("/_authenticated/onboard-company")({
	component: CompanyOnboardingPage,
});

type OnboardingStep = "role-selection" | "business-setup" | "employee-waiting";

function CompanyOnboardingPage() {
	const nav = useNavigate();
	const { user, refreshUser } = useAuth();

	useEffect(() => {
		if (user && user.company_id !== null) {
			nav({
				to: "/app",
			});
		}
	}, [user, nav]);

	const [currentStep, setCurrentStep] =
		useState<OnboardingStep>("role-selection");
	const [businessData, setBusinessData] = useState<BusinessData>({
		name: "",
		avatar: "",
	});
	const [businessFormStep, setBusinessFormStep] = useState(0);
	const [invitations, setInvitations] = useState<Invitation[]>([]);
	const [loadingInvitations, setLoadingInvitations] = useState(false);
	const [acceptingInvitation, setAcceptingInvitation] = useState<string | null>(null);

	const businessSteps = [
		{
			id: "businessName",
			title: "What's your business name?",
			subtitle: "This will appear in your customer conversations",
			type: "text",
			placeholder: "Enter your business name",
			key: "name" as keyof BusinessData,
		},
		{
			id: "businessAvatar",
			title: "Add your business logo",
			subtitle: "This will represent your brand (optional)",
			type: "file",
			key: "avatar" as keyof BusinessData,
		},
	];

	const currentBusinessStep = businessSteps[businessFormStep];
	const isLastBusinessStep = businessFormStep === businessSteps.length - 1;
	const businessProgress =
		((businessFormStep + 1) / businessSteps.length) * 100;

	const handleRoleSelection = async (role: "business" | "employee") => {
		if (role === "business") {
			setBusinessFormStep(0);
			setCurrentStep("business-setup");
		} else {
			setCurrentStep("employee-waiting");
			await loadInvitations();
		}
	};

	const loadInvitations = async () => {
		setLoadingInvitations(true);
		try {
			const response = await api.invitation["my-invitations"].$get();
			if (response.ok) {
				const data = await response.json();
				setInvitations(data.invitations || []);
			}
		} catch (error) {
			console.error("Failed to load invitations:", error);
		} finally {
			setLoadingInvitations(false);
		}
	};

	const handleAcceptInvitation = async (invitationId: string) => {
		setAcceptingInvitation(invitationId);
		try {
			const response = await api.invitation.accept.$post({
				json: { invitation_id: invitationId }
			});

			if (response.ok) {
				await refreshUser();
				// User will be redirected by the useEffect when company_id is updated
			} else {
				console.error("Failed to accept invitation");
			}
		} catch (error) {
			console.error("Error accepting invitation:", error);
		} finally {
			setAcceptingInvitation(null);
		}
	};

	const handleBusinessNext = async () => {
		if (businessFormStep < businessSteps.length - 1) {
			setBusinessFormStep(businessFormStep + 1);
		} else {
			// Complete business setup and redirect
			try {
				const res = await api.company.onboard.$post({
					json: {
						name: businessData.name,
						description: "",
						icon: businessData.avatar,
					},
				});

				if (res.ok) {
					await refreshUser();
				} else {
					// Handle error gracefully
					console.error("Failed to onboard company");
				}
			} catch (error) {
				console.error("Error during onboarding:", error);
			}
		}
	};

	const handleBusinessBack = () => {
		if (businessFormStep > 0) {
			setBusinessFormStep(businessFormStep - 1);
		} else {
			setCurrentStep("role-selection");
		}
	};

	const handleBusinessInputChange = (value: string) => {
		setBusinessData((prev) => ({
			...prev,
			[currentBusinessStep.key]: value,
		}));
	};

	const canProceedBusiness = () => {
		const currentValue = businessData[currentBusinessStep.key];
		if (currentBusinessStep.type === "file") {
			return true; // File uploads are optional
		}
		return currentValue?.toString().trim() !== "";
	};

	const renderRoleSelection = () => (
		<div className="text-center max-w-3xl mx-auto">
			<h1 className="text-4xl md:text-3xl font-bold mb-6 text-zinc-900">
				I am a
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div
					onClick={() => handleRoleSelection("business")}
					className="group p-8 border border-zinc-200 hover:border-zinc-300 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					<div className="flex flex-col items-center space-y-6">
						<div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
							<Building2 className="w-10 h-10 text-blue-600" />
						</div>
						<div className="text-center">
							<h3 className="text-2xl font-semibold text-zinc-900 mb-3">
								Business Owner
							</h3>
							<p className="text-zinc-600 leading-relaxed">
								I'm setting up ChatMesh for my business
							</p>
						</div>
					</div>
				</div>

				<div
					onClick={() => handleRoleSelection("employee")}
					className="group p-8 border border-zinc-200 hover:border-zinc-300 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
				>
					<div className="flex flex-col items-center space-y-6">
						<div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
							<Users className="w-10 h-10 text-green-600" />
						</div>
						<div className="text-center">
							<h3 className="text-2xl font-semibold text-zinc-900 mb-3">
								Employee
							</h3>
							<p className="text-zinc-600 leading-relaxed">
								I'm joining my company's ChatMesh workspace
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderEmployeeWaiting = () => {
		if (loadingInvitations) {
			return (
				<div className="text-center max-w-2xl mx-auto py-12">
					<div className="w-24 h-24 mx-auto mb-8 bg-zinc-50 rounded-full flex items-center justify-center">
						<Loader2 className="w-12 h-12 text-zinc-400 animate-spin" />
					</div>
					<h1 className="text-3xl font-bold mb-4 text-zinc-900">
						Loading invitations...
					</h1>
					<p className="text-zinc-600">
						Checking for pending company invitations
					</p>
				</div>
			);
		}

		if (invitations.length > 0) {
			return (
				<div className="max-w-3xl mx-auto py-8">
					<div className="text-center mb-8">
						<div className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
							<Mail className="w-12 h-12 text-green-600" />
						</div>
						<h1 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900">
							You have invitations!
						</h1>
						<p className="text-lg text-zinc-600 max-w-xl mx-auto">
							Choose a company to join from your pending invitations
						</p>
					</div>

					<div className="space-y-4 mb-8">
						{invitations.map((invitation) => (
							<Card key={invitation.id} className="border border-zinc-200 hover:border-zinc-300 transition-colors">
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
												<Building2 className="w-6 h-6 text-blue-600" />
											</div>
											<div>
												<CardTitle className="text-lg">Company Invitation</CardTitle>
												<CardDescription>
													Expires {new Date(invitation.expires_at).toLocaleDateString()}
												</CardDescription>
											</div>
										</div>
										<Button
											onClick={() => handleAcceptInvitation(invitation.id)}
											disabled={acceptingInvitation === invitation.id}
											className="bg-green-600 hover:bg-green-700 text-white"
										>
											{acceptingInvitation === invitation.id ? (
												<>
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													Accepting...
												</>
											) : (
												<>
													<CheckCircle className="w-4 h-4 mr-2" />
													Accept Invitation
												</>
											)}
										</Button>
									</div>
								</CardHeader>
								<CardContent className="pt-0">
									<div className="text-sm text-zinc-600">
										<p>Invitation ID: {invitation.id.slice(0, 8)}...</p>
										<p>Received: {new Date(invitation.created_at).toLocaleDateString()}</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="text-center">
						<Button
							variant="ghost"
							onClick={() => setCurrentStep("role-selection")}
							className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to role selection
						</Button>
					</div>
				</div>
			);
		}

		return (
			<div className="text-center max-w-2xl mx-auto py-12">
				<div className="w-24 h-24 mx-auto mb-8 bg-zinc-50 rounded-full flex items-center justify-center">
					<Clock className="w-12 h-12 text-zinc-400" />
				</div>
				<h1 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900">
					Wait for an invite
				</h1>
				<p className="text-lg text-zinc-600 mb-4 max-w-xl mx-auto">
					Please wait for your business owner to invite you to join their ChatMesh
					workspace.
				</p>
				<p className="text-zinc-500 mb-10">
					You'll receive an email notification once you've been added to the
					company.
				</p>

				<Button
					variant="ghost"
					onClick={() => setCurrentStep("role-selection")}
					className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to role selection
				</Button>
			</div>
		);
	};

	const renderBusinessStepContent = () => {
		switch (currentBusinessStep.type) {
			case "text":
				return (
					<div className="w-full max-w-md mx-auto">
						<Input
							type="text"
							value={businessData[currentBusinessStep.key] as string}
							onChange={(e) => handleBusinessInputChange(e.target.value)}
							placeholder={currentBusinessStep.placeholder}
							className="w-full px-5 py-4 text-lg border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20 focus:outline-none transition-all rounded-lg bg-white"
							autoFocus
						/>
					</div>
				);

			case "file":
				return (
					<div className="w-full max-w-md mx-auto">
						<div className="flex flex-col items-center space-y-6">
							{businessData[currentBusinessStep.key] ? (
								<div className="relative">
									<img
										src={businessData[currentBusinessStep.key] as string}
										alt="Preview"
										className="w-32 h-32 object-cover rounded-lg border border-zinc-200 shadow-sm"
									/>
									<Button
										onClick={() => handleBusinessInputChange("")}
										className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
									>
										×
									</Button>
								</div>
							) : (
								<div className="w-32 h-32 border-2 border-dashed border-zinc-200 rounded-lg flex items-center justify-center">
									<Building2 className="w-12 h-12 text-zinc-400" />
								</div>
							)}

							<label className="cursor-pointer bg-zinc-100 hover:bg-zinc-200 px-6 py-3 rounded-lg transition-colors flex items-center gap-3 text-zinc-700 font-medium">
								<Upload className="w-5 h-5" />
								<span>Choose Image</span>
								<input
									type="file"
									accept="image/*"
									onChange={async (e) => {
										const url = await handleFileUpload(e);
										if (!url) return;
										handleBusinessInputChange(url);
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

	const renderBusinessSetup = () => (
		<div className="w-full max-w-2xl mx-auto">
			{/* Progress Bar */}
			<div className="mb-12">
				<div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
					<div
						className="bg-zinc-900 h-full transition-all duration-500 ease-out rounded-full"
						style={{ width: `${businessProgress}%` }}
					/>
				</div>
				<div className="flex justify-between mt-3 text-sm text-zinc-500">
					<span>
						Step {businessFormStep + 1} of {businessSteps.length}
					</span>
					<span>{Math.round(businessProgress)}% complete</span>
				</div>
			</div>

			{/* Step Content */}
			<div className="text-center mb-12">
				<h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
					{currentBusinessStep.title}
				</h1>
				<p className="text-lg text-zinc-600 mb-10 max-w-xl mx-auto">
					{currentBusinessStep.subtitle}
				</p>

				<div className="mb-12">{renderBusinessStepContent()}</div>
			</div>

			{/* Navigation */}
			<div className="flex items-center justify-between pt-6 border-t border-zinc-100">
				<Button
					variant="ghost"
					onClick={handleBusinessBack}
					className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
				>
					<ArrowLeft className="w-5 h-5" />
					Back
				</Button>

				<Button
					onClick={handleBusinessNext}
					disabled={!canProceedBusiness()}
					className={`flex items-center gap-2 px-8 py-3 font-medium rounded-lg transition-all ${
						canProceedBusiness()
							? "bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm hover:shadow"
							: "bg-zinc-100 text-zinc-400 cursor-not-allowed"
					}`}
				>
					{isLastBusinessStep ? "Complete Setup" : "Continue"}
					{!isLastBusinessStep && <ArrowRight className="w-5 h-5" />}
				</Button>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 md:p-6">
			<div className="w-full max-w-4xl">
				<div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 transition-all duration-300">
					{currentStep === "role-selection" && renderRoleSelection()}
					{currentStep === "employee-waiting" && renderEmployeeWaiting()}
					{currentStep === "business-setup" && renderBusinessSetup()}
				</div>
			</div>
		</div>
	);
}

export default CompanyOnboardingPage;
