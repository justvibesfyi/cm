import type { Employee, Invitation } from "@back/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Crown, Mail, Trash2, User2, UserPlus } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
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

const getInvitations = async () => {
	const res = await api.invitation.$get();

	if (!res.ok) {
		throw new Error("Unable to retrieve invitations for your company");
	}

	const data = await res.json();

	return data.invitations;
};

const inviteEmployee = async (email: string) => {
	const res = await api.invitation.invite.$post({
		json: {
			email,
		},
	});

	if (!res.ok) {
		throw new Error("Unable to invite the member");
	}

	const data = await res.json();

	return data.success;
};

const revokeInvitation = async (id: string) => {
	const res = await api.invitation[":id"].$delete({
		param: { id },
	});

	if (!res.ok) {
		throw new Error("Unable to revoke invitation");
	}

	const data = await res.json();

	return data.success;
};

const removeEmployee = async (id: string) => {
	const res = await api.employee.remove.$delete({
		json: {
			id,
		},
	});

	if (!res.ok) {
		throw new Error("Unable to remove user");
	}

	const data = await res.json();
	return data;
};

export const ManageEmployees = () => {
	const [newMemberEmail, setNewMemberEmail] = useState("");
	const queryClient = useQueryClient();

	const { data: teamMembers, isFetching: isFetchingEmployees } = useQuery({
		queryKey: ["employees"],
		queryFn: getEmployees,
	});

	const { data: invitations, isFetching: isFetchingInvitations } = useQuery({
		queryKey: ["invitations"],
		queryFn: getInvitations,
	});

	const inviteMutation = useMutation({
		mutationFn: inviteEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["invitations"] });
			setNewMemberEmail("");
		},
	});

	const revokeMutation = useMutation({
		mutationFn: revokeInvitation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["invitations"] });
		},
	});

	const removeEmployeeMutation = useMutation({
		mutationFn: removeEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employees"] });
		},
	});

	const { variables: rmVars, isPending } = removeEmployeeMutation;
	const empBeingRemoved = isPending ? rmVars : null;

	const addTeamMember = async () => {
		if (newMemberEmail.trim()) {
			inviteMutation.mutate(newMemberEmail);
		}
	};

	const renderEmployees = (members: Employee[]) => {
		return members.map((member) => {
			// Compute display name
			const displayName =
				(member.first_name || "") +
					(member.last_name ? ` ${member.last_name}` : "") ||
				member.email ||
				"Unknown";

			return (
				<div
					key={member.id}
					className={`flex items-center justify-between p-4 border rounded-lg ${empBeingRemoved === member.id ? "opacity-50 bg-muted" : ""}`}
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
								{member.position === "admin" ? (
									<Crown className="w-4 h-4 text-yellow-500" />
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
						disabled={empBeingRemoved === member.id}
						variant="ghost"
						size="icon"
						className="text-destructive hover:text-destructive"
						onClick={() => removeEmployeeMutation.mutate(member.id)}
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			);
		});
	};

	const renderInvitations = (invitations: Invitation[]) => {
		return invitations.map((invitation) => (
			<div
				key={invitation.id}
				className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200"
			>
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100">
						<Mail className="w-5 h-5 text-yellow-600" />
					</div>
					<div>
						<p className="font-medium">{invitation.email}</p>
						<p className="text-sm text-muted-foreground">
							Invited • Expires{" "}
							{new Date(invitation.expires_at).toLocaleDateString()}
						</p>
					</div>
				</div>

				<Button
					variant="ghost"
					size="icon"
					className="text-destructive hover:text-destructive"
					onClick={() => revokeMutation.mutate(invitation.id)}
					disabled={revokeMutation.isPending}
				>
					<Trash2 className="w-4 h-4" />
				</Button>
			</div>
		));
	};

	const renderLoading = () => {
		return Array.from({ length: 3 }).map((_, i) => (
			<div
				key={`loading-${i}`}
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
		<div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
			<section>
				<h2 className="text-lg font-bold mb-6">Invite New Team Member</h2>
				<div className="flex gap-3">
					<Input
						type="email"
						value={newMemberEmail}
						onChange={(e) => setNewMemberEmail(e.target.value)}
						placeholder="Enter email address..."
						className="flex-1"
						disabled={inviteMutation.isPending}
					/>
					<Button
						onClick={addTeamMember}
						disabled={inviteMutation.isPending || !newMemberEmail.trim()}
					>
						<UserPlus className="w-4 h-4 mr-2" />
						{inviteMutation.isPending ? "Inviting..." : "Invite"}
					</Button>
				</div>
			</section>

			<section>
				<h2 className="text-lg font-bold mb-6">Pending Invitations</h2>
				<div className="space-y-4">
					{isFetchingInvitations || !invitations ? (
						renderLoading()
					) : invitations.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No pending invitations
						</div>
					) : (
						renderInvitations(invitations)
					)}
				</div>
			</section>

			<section>
				<h2 className="text-lg font-bold mb-6">Team Members</h2>
				<div className="space-y-4">
					{isFetchingEmployees || !teamMembers ? (
						renderLoading()
					) : teamMembers.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No team members yet
						</div>
					) : (
						renderEmployees(teamMembers)
					)}
				</div>
			</section>
		</div>
	);
};
