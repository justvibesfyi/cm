import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Eye,
	EyeOff,
	Globe,
	Hash,
	Mail,
	MessageCircle,
	Phone,
	Save,
	Send,
	Trash2,
	UserPlus,
	Users,
} from "lucide-react";
import { useState } from "react";
import ManageBusinessSettings from "@/components/ManageBusinessSettings";
import { Button } from "@/components/ui/button";

interface Platform {
	id: string;
	name: string;
	icon: React.ComponentType<any>;
	color: string;
	enabled: boolean;
	apiKey: string;
	showApiKey: boolean;
}

interface TeamMember {
	id: string;
	email: string;
	role: string;
	status: "pending" | "active";
}

export const Route = createFileRoute("/manage")({
	component: Manage,
});

function Manage() {
	const [platforms, setPlatforms] = useState<Platform[]>([
		{
			id: "telegram",
			name: "Telegram",
			icon: Send,
			color: "text-blue-400",
			enabled: true,
			apiKey: "1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi",
			showApiKey: false,
		},
		{
			id: "discord",
			name: "Discord",
			icon: Hash,
			color: "text-indigo-400",
			enabled: false,
			apiKey: "",
			showApiKey: false,
		},
		{
			id: "whatsapp",
			name: "WhatsApp",
			icon: MessageCircle,
			color: "text-green-500",
			enabled: true,
			apiKey: "EAABwzLixnjYBAOZD...",
			showApiKey: false,
		},
		{
			id: "messenger",
			name: "Messenger",
			icon: MessageCircle,
			color: "text-blue-600",
			enabled: false,
			apiKey: "",
			showApiKey: false,
		},
		{
			id: "slack",
			name: "Slack",
			icon: Hash,
			color: "text-purple-500",
			enabled: false,
			apiKey: "",
			showApiKey: false,
		},
		{
			id: "teams",
			name: "Teams",
			icon: Users,
			color: "text-blue-500",
			enabled: false,
			apiKey: "",
			showApiKey: false,
		},
		{
			id: "sms",
			name: "SMS",
			icon: Phone,
			color: "text-purple-500",
			enabled: false,
			apiKey: "",
			showApiKey: false,
		},
		{
			id: "email",
			name: "Email",
			icon: Mail,
			color: "text-red-500",
			enabled: false,
			apiKey: "",
			showApiKey: false,
		},
		{
			id: "webchat",
			name: "Web Chat",
			icon: Globe,
			color: "text-indigo-500",
			enabled: false,
			apiKey: "",
			showApiKey: false,
		},
	]);

	const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
		{
			id: "1",
			email: "john@acme.com",
			role: "Admin",
			status: "active",
		},
		{
			id: "2",
			email: "sarah@acme.com",
			role: "Agent",
			status: "active",
		},
		{
			id: "3",
			email: "mike@acme.com",
			role: "Agent",
			status: "pending",
		},
	]);

	const [newMemberEmail, setNewMemberEmail] = useState("");

	const togglePlatform = (id: string) => {
		setPlatforms(
			platforms.map((platform) =>
				platform.id === id
					? { ...platform, enabled: !platform.enabled }
					: platform,
			),
		);
	};

	const updateApiKey = (id: string, apiKey: string) => {
		setPlatforms(
			platforms.map((platform) =>
				platform.id === id ? { ...platform, apiKey } : platform,
			),
		);
	};

	const toggleApiKeyVisibility = (id: string) => {
		setPlatforms(
			platforms.map((platform) =>
				platform.id === id
					? { ...platform, showApiKey: !platform.showApiKey }
					: platform,
			),
		);
	};

	const selectedPlatformData = platforms.find((p) => p.id === selectedPlatform);

	const addTeamMember = () => {
		if (newMemberEmail && newMemberEmail.includes("@")) {
			const newMember: TeamMember = {
				id: Date.now().toString(),
				email: newMemberEmail,
				role: "Agent",
				status: "pending",
			};
			setTeamMembers([...teamMembers, newMember]);
			setNewMemberEmail("");
		}
	};

	const removeTeamMember = (id: string) => {
		setTeamMembers(teamMembers.filter((member) => member.id !== id));
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="border-b border-zinc-700 bg-white">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link
								to="/"
								className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
								<span>Back to Home</span>
							</Link>
							<div className="h-6 w-px bg-gray-300" />
							<div className="flex items-center gap-2">
								<MessageCircle className="w-8 h-8 text-blue-500" />
								<span className="text-2xl font-bold text-black">ChatMesh</span>
							</div>
						</div>
						<h1 className="text-2xl font-bold text-black">
							Management Dashboard
						</h1>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Platform Configuration */}
					<div className="space-y-6">
						<div className="bg-white border border-primary rounded-lg p-6">
							<h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
								<MessageCircle className="w-6 h-6" />
								Platform Configuration
							</h2>

							{/* Platform Grid */}
							<div className="grid grid-cols-3 gap-3 mb-6">
								{platforms.map((platform) => (
									<Button
										key={platform.id}
										onClick={() => setSelectedPlatform(platform.id)}
										className={`relative p-4 rounded-lg border transition-all hover:shadow-md ${
											selectedPlatform === platform.id
												? "border-blue-500 bg-blue-50"
												: platform.enabled
													? "border-green-400 bg-green-50"
													: "border-zinc-400 bg-gray-50 hover:border-zinc-800"
										}`}
									>
										{/* Status Indicator */}
										<div
											className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
												platform.enabled ? "bg-green-500" : "bg-gray-300"
											}`}
										/>

										<div className="flex flex-col items-center gap-2">
											<platform.icon
												className={`w-6 h-6 ${
													platform.enabled ? platform.color : "text-gray-400"
												}`}
											/>
											<span className="text-sm font-medium text-black">
												{platform.name}
											</span>
										</div>
									</Button>
								))}
							</div>

							{/* Selected Platform Configuration */}
							{selectedPlatformData && (
								<div className="border border-zinc-700 rounded-lg p-4 bg-gray-50">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-3">
											<selectedPlatformData.icon
												className={`w-6 h-6 ${selectedPlatformData.color}`}
											/>
											<div>
												<h3 className="font-semibold text-black">
													{selectedPlatformData.name}
												</h3>
												<p className="text-sm text-gray-500">
													{selectedPlatformData.enabled
														? "Connected"
														: "Disconnected"}
												</p>
											</div>
										</div>

										<Button
											onClick={() => togglePlatform(selectedPlatformData.id)}
											className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
												selectedPlatformData.enabled
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										>
											<span
												className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
													selectedPlatformData.enabled
														? "translate-x-6"
														: "translate-x-1"
												}`}
											/>
										</Button>
									</div>

									{selectedPlatformData.enabled && (
										<div className="space-y-3">
											<label className="block text-sm font-medium text-gray-700">
												API Key
											</label>
											<div className="flex gap-2">
												<div className="flex-1 relative">
													<input
														name="key"
														type={
															selectedPlatformData.showApiKey
																? "text"
																: "password"
														}
														value={selectedPlatformData.apiKey}
														onChange={(e) =>
															updateApiKey(
																selectedPlatformData.id,
																e.target.value,
															)
														}
														className="w-full px-3 py-2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
														placeholder="Enter API key..."
													/>
												</div>
												<Button
													onClick={() =>
														toggleApiKeyVisibility(selectedPlatformData.id)
													}
													className="px-3 py-2 border border-zinc-800 rounded-lg hover:bg-gray-50 transition-colors bg-white"
												>
													{selectedPlatformData.showApiKey ? (
														<EyeOff className="w-4 h-4 text-gray-600" />
													) : (
														<Eye className="w-4 h-4 text-gray-600" />
													)}
												</Button>
											</div>
										</div>
									)}
								</div>
							)}

							{!selectedPlatform && (
								<div className="text-center py-8 text-gray-500">
									<MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
									<p>Select a platform above to configure its settings</p>
								</div>
							)}

							<div className="flex gap-3 mt-6">
								<Button className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
									<Save className="w-4 h-4" />
									Save Settings
								</Button>
								{selectedPlatform && (
									<Button
										onClick={() => setSelectedPlatform(null)}
										className="px-4 py-3 border border-zinc-800 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
									>
										Clear Selection
									</Button>
								)}
							</div>
						</div>
					</div>

					{/* Business Settings */}
					<ManageBusinessSettings />
				</div>

				{/* Team Management */}
				<div className="mt-8">
					<div className="bg-white border border-zinc-700 rounded-lg p-6">
						<h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
							<Users className="w-6 h-6" />
							Team Management
						</h2>

						{/* Add New Member */}
						<div className="mb-6 p-4 border border-zinc-700 rounded-lg">
							<h3 className="font-semibold text-black mb-3">
								Invite New Team Member
							</h3>
							<div className="flex gap-3">
								<div className="flex-1">
									<input
										type="email"
										value={newMemberEmail}
										onChange={(e) => setNewMemberEmail(e.target.value)}
										placeholder="Enter email address..."
										className="w-full px-3 py-2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
									/>
								</div>
								<Button
									onClick={addTeamMember}
									className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
								>
									<UserPlus className="w-4 h-4" />
									Invite
								</Button>
							</div>
						</div>

						{/* Team Members List */}
						<div className="space-y-3">
							{teamMembers.map((member) => (
								<div
									key={member.id}
									className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg"
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
											<Mail className="w-5 h-5 text-gray-600" />
										</div>
										<div>
											<p className="font-medium text-black">{member.email}</p>
											<div className="flex items-center gap-2">
												<span className="text-sm text-gray-500">
													{member.role}
												</span>
												<span className="text-gray-300">•</span>
												<span
													className={`text-sm px-2 py-1 rounded-full ${
														member.status === "active"
															? "bg-green-100 text-green-700"
															: "bg-yellow-100 text-yellow-700"
													}`}
												>
													{member.status === "active" ? "Active" : "Pending"}
												</span>
											</div>
										</div>
									</div>

									<Button
										onClick={() => removeTeamMember(member.id)}
										className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
