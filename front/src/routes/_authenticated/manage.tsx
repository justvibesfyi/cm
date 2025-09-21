import type { Platform } from "@back/types";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Badge, Mail, Trash2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import ManageIntegrations from "@/components/integrations/ManageIntegrations";
import ManageBusinessSettings from "@/components/ManageBusinessSettings";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

	const [newMemberEmail, setNewMemberEmail] = useState("");

	const addTeamMember = () => {
		if (newMemberEmail?.includes("@")) {
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
					<ManageIntegrations />
					<ManageBusinessSettings />
				</div>
				<div className="mt-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="w-6 h-6" />
								Team Management
							</CardTitle>
							<CardDescription>
								Invite and manage your team members
							</CardDescription>
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
															member.status === "active"
																? "default"
																: "secondary"
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
				</div>
			</div>
		</div>
	);
}
