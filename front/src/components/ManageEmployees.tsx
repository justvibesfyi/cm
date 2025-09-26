import type { Employee } from "@back/types";
import { useQuery } from "@tanstack/react-query";
import { Badge, Crown, Mail, Trash2, User2, UserPlus } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

const getEmployees = async () => {
	const res = await api.company.employees.$get();

	if (!res.ok) {
		throw new Error("Unable to retrieve employees for your company");
	}

	const data = await res.json();

	return data.employees;
};

export const ManageEmployees = () => {
	const [newMemberEmail, setNewMemberEmail] = useState("");
	const addTeamMember = () => {
		// if (newMemberEmail && newMemberEmail.includes("@")) {
		// 	const newMember: TeamMember = {
		// 		id: Date.now().toString(),
		// 		email: newMemberEmail,
		// 		role: "Agent",
		// 		status: "pending",
		// 	};
		// 	setTeamMembers([...teamMembers, newMember]);
		// 	setNewMemberEmail("");
		// }
	};

	const {
		data: teamMembers,
		isFetching,
		isError,
	} = useQuery({ queryKey: ["employees"], queryFn: getEmployees });

	const removeTeamMember = (id: string) => {
		// setTeamMembers(teamMembers.filter((member) => member.id !== id));
	};

	const renderEmployees = (members: Employee[]) => {
		return members.map((member) => {
			// Compute display name
			const displayName =
				(member.first_name || "") +
					(member.last_name ? ` ${member.last_name}` : "") ||
				member.email ||
				"Unknown";

			// Generate initials if no avatar
			const initials =
				(member.first_name?.charAt(0) || "") +
				(member.last_name?.charAt(0) || "");

			return (
				<div
					key={member.id}
					className="flex items-center justify-between p-4 border rounded-lg"
				>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted overflow-hidden">
							<Avatar>
								<AvatarImage src={member.avatar || undefined} />
								<AvatarFallback>
									{member.email.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
						</div>
						<div>
							<p className="font-medium">{displayName}</p>
							<div className="flex items-center gap-2">
								{member.position !== "admin" ? (
									<Crown className="w-4 h-4" />
								) : (
									<User2 className="w-4 h-4" />
								)}
								<span className="text-sm text-muted-foreground">
									{member.position || "No position"}
								</span>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								{member.email}
							</p>
						</div>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="text-destructive hover:text-destructive"
						onClick={() => removeTeamMember(member.id)}
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			);
		});
	};

	const renderLoading = () => {
		return Array.from({ length: 3 }).map((_, index) => (
			<div
				key={index}
				className="flex items-center justify-between p-4 border rounded-lg"
			>
				<div className="flex items-center gap-3">
					<Skeleton className="w-10 h-10 rounded-full" />
					<div>
						<Skeleton className="h-4 w-48 mb-2" />
						<div className="flex items-center gap-2">
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-5 w-12 rounded-full" />
						</div>
					</div>
				</div>
				<Skeleton className="w-8 h-8 rounded" />
			</div>
		));
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Invite New Team Member</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-2">
						<Input
							type="email"
							value={newMemberEmail}
							onChange={(e) => setNewMemberEmail(e.target.value)}
							placeholder="Enter email address..."
							className="flex-1"
						/>
						<Button onClick={addTeamMember}>
							<UserPlus className="w-4 h-4 mr-2" />
							Invite
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Team Members</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{isFetching || !teamMembers
							? renderLoading()
							: renderEmployees(teamMembers)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
