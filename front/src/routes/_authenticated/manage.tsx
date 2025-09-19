import type { Platform } from "@back/types";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Badge,
	Eye,
	EyeOff,
	Hash,
	Mail,
	MessageCircle,
	Save,
	Send,
	Trash2,
	UserPlus,
	Users,
} from "lucide-react";
import { useState } from "react";
import ManageBusinessSettings from "@/components/ManageBusinessSettings";
import PlatformIcon from "@/components/PlatformIcon";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface Integration {
	id: Platform;
	name: string;
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

export const Route = createFileRoute("/_authenticated/manage")({
	component: Manage,
});

function Manage() {
	const [platforms, setPlatforms] = useState<Integration[]>([
		{
			id: "telegram",
			name: "Telegram",
			color: "text-blue-400",
			enabled: true,
			apiKey: "1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi",
			showApiKey: false,
		},
		{
			id: "zalo",
			name: "Zalo",
			color: "text-blue-400",
			enabled: true,
			apiKey: "1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi",
			showApiKey: false,
		},
	]);

	const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

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
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b border-border bg-background">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link
								to="/app"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
								<span>Back</span>
							</Link>
							<Separator orientation="vertical" className="h-6" />
						</div>
						<h1 className="text-2xl font-bold">Management Dashboard</h1>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Platform Configuration */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MessageCircle className="w-6 h-6" />
								Platform Configuration
							</CardTitle>
							<CardDescription>
								Connect and manage your messaging platforms
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Platform Grid */}
							<div className="grid grid-cols-3 gap-3">
								{platforms.map((platform) => (
									<div
										key={platform.id}
										variant={"outline"}
										className={`relative p-4 h-auto flex-col gap-2 w-full flex items-center cursor-pointer ${
											selectedPlatform === platform.id
												? "border border-primary"
												: "border"
										}`}
										onClick={() =>
											setSelectedPlatform((prev) =>
												prev === platform.id ? null : platform.id,
											)
										}
									>
										{/* Status Indicator */}
										<div
											className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
												platform.enabled ? "bg-green-500" : "bg-gray-300"
											}`}
										/>
										<PlatformIcon platform={platform.id} className="w-10 h-10" />
										{/* <platform.icon
											className={`w-6 h-6 ${
												platform.enabled
													? platform.color
													: "text-muted-foreground"
											}`} */}

										<span className="text-sm font-medium">{platform.name}</span>
									</div>
								))}
							</div>

							{/* Selected Platform Configuration */}
							{selectedPlatformData && (
								<Card className="border">
									<CardContent className="p-4">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center gap-3">
												<PlatformIcon
													platform={selectedPlatformData.id}
													className={`w-6 h-6 ${selectedPlatformData.color}`}
												/>
												<div>
													<h3 className="font-semibold">
														{selectedPlatformData.name}
													</h3>
													<p className="text-sm text-muted-foreground">
														{selectedPlatformData.enabled
															? "Connected"
															: "Disconnected"}
													</p>
												</div>
											</div>

											<Switch
												checked={selectedPlatformData.enabled}
												onCheckedChange={() =>
													togglePlatform(selectedPlatformData.id)
												}
											/>
										</div>

										{selectedPlatformData.enabled && (
											<div className="space-y-2">
												<Label>API Key</Label>
												<div className="flex gap-2">
													<div className="flex-6 relative">
														<Input
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
															placeholder="Enter API key..."
														/>
													</div>
													<Button
														type="button"
														variant="outline"
														size="icon"
														onClick={() =>
															toggleApiKeyVisibility(selectedPlatformData.id)
														}
													>
														{selectedPlatformData.showApiKey ? (
															<EyeOff className="w-4 h-4" />
														) : (
															<Eye className="w-4 h-4" />
														)}
													</Button>
													<Button
														className="flex-1"
														type="button"
														variant="outline"
														size="icon"
														onClick={() => {}}
													>
														<Save className="w-4 h-4" />
														Save
													</Button>
												</div>
											</div>
										)}
									</CardContent>
								</Card>
							)}

							{!selectedPlatform && (
								<div className="text-center py-8 text-muted-foreground">
									<MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
									<p>Select a platform above to configure its settings</p>
								</div>
							)}
						</CardContent>
					</Card>
	<ManageBusinessSettings />;
	</div>
	<div className="mt-8">
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Users className="w-6 h-6" />
					Team Management
				</CardTitle>
				<CardDescription>Invite and manage your team members</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Add New Member */}
				<div className="p-4 border rounded-lg border-border">
					<h3 className="font-semibold mb-3">Invite New Team Member</h3>
					<div className="flex gap-3">
						<div className="flex-1">
							<Input
								type="email"
								value={newMemberEmail}
								onChange={(e) => setNewMemberEmail(e.target.value)}
								placeholder="Enter email address..."
							/>
						</div>
						<Button onClick={addTeamMember}>
							<UserPlus className="w-4 h-4 mr-2" />
							Invite
						</Button>
					</div>
				</div>

				{/* Team Members List */}
				<div className="space-y-3">
					{teamMembers.map((member) => (
						<div
							key={member.id}
							className="flex items-center justify-between p-4 border rounded-lg border-border"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
									<Mail className="w-5 h-5 text-muted-foreground" />
								</div>
								<div>
									<p className="font-medium">{member.email}</p>
									<div className="flex items-center gap-2 mt-1">
										<span className="text-sm text-muted-foreground">
											{member.role}
										</span>
										<Separator orientation="vertical" className="h-4" />
										<Badge
											variant={
												member.status === "active" ? "default" : "secondary"
											}
										>
											{member.status === "active" ? "Active" : "Pending"}
										</Badge>
									</div>
								</div>
							</div>

							<Button
								variant="ghost"
								size="icon"
								className="text-destructive"
								onClick={() => removeTeamMember(member.id)}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	</div>;
	</div>
		</div>
	)
}
