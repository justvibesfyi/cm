import { Separator } from "@radix-ui/react-separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Badge,
	Cable,
	Calendar,
	Clock,
	LoaderCircle,
	MapPin,
	Monitor,
	Shield,
	Smartphone,
	Tablet,
} from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export const revokeSession = async (id: number) => {
	console.log("revoking");
	await new Promise((res) => setTimeout(res, 2000));

	console.log("revoked");
	// const res = await api.manage.session.$delete({
	// 	json: {
	// 		id,
	// 	},
	// });

	// if (!res.ok) {
	// 	throw new Error("Unable to revoke session");
	// }
};

export const getSessions = async () => {
	const res = await api.manage.sessions.$get();

	if (!res.ok) {
		throw new Error("Unable to get sessions");
	}

	const { sessions } = await res.json();

	return sessions;
};

const getDeviceIcon = (deviceType: string) => {
	switch (deviceType) {
		case "mobile":
			return Smartphone;
		case "tablet":
			return Tablet;
		default:
			return Monitor;
	}
};

export const ManageSessions = () => {
	const { data: sessions } = useQuery({
		queryKey: ["all-sessions"],
		queryFn: getSessions,
	});

	const queryClient = useQueryClient();

	const revokeSessionMutation = useMutation({
		mutationFn: (sid: number) => revokeSession(sid),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
	});

	const { variables, isPending } = revokeSessionMutation;

	if (!sessions) {
		return "Loading...";
	}

	console.log(variables, isPending);

	return (
		<div className="p-4">
			<p className="text-sm text-muted-foreground">
				Manage active user sessions and security
			</p>
			<div className="space-y-4">
				{sessions.map((session) => {
					const DeviceIcon = getDeviceIcon(session.device_type);
					const fullName =
						[session.first_name, session.last_name].filter(Boolean).join(" ") ||
						"—";
					const displayName =
						session.email || fullName || `User (${session.employee_id})`;

					return (
						<div
							key={session.id}
							className="flex items-center justify-between p-4 border rounded-lg"
						>
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
									<Avatar>
										<AvatarImage src={session.avatar || undefined} />
										<AvatarFallback>
											{session.email.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
								<div>
									<div className="flex items-center gap-2 mb-1">
										<p className="font-medium">{fullName}</p>
									</div>
									<div className="flex items-center gap-2 mb-1">
										<p className="font-medium">{displayName}</p>
									</div>
									<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
										{/* Device */}
										{session.device_name && (
											<span className="flex items-center gap-1">
												<Monitor className="w-3 h-3" />
												{session.device_name}
											</span>
										)}

										{/* IP Address */}
										<span className="flex items-center gap-1">
											<Cable className="w-3 h-3" />
											{session.last_ip}
										</span>

										{/* Created At */}
										{session.created_at && (
											<>
												<Separator orientation="vertical" className="h-3" />
												<span className="flex items-center gap-1">
													<Calendar className="w-3 h-3" />
													Created:{" "}
													{new Date(session.created_at).toLocaleString()}
												</span>
											</>
										)}
									</div>

									{/* Optional: Employee ID (useful for internal systems) */}
									{session.employee_id && (
										<div className="text-xs text-muted-foreground mt-1 bg-secondary w-fit p-1">
											{session.employee_id}
										</div>
									)}
								</div>
							</div>

							<Button
								disabled={isPending && variables === session.id}
								variant="ghost"
								size="sm"
								className="text-destructive hover:text-destructive cursor-pointer"
								onClick={() => revokeSessionMutation.mutate(session.id)}
							>
								{isPending && variables === session.id ? (
									<LoaderCircle className="animate-spin" />
								) : (
									<Shield className="w-4 h-4 mr-1" />
								)}
								Revoke
							</Button>
						</div>
					);
				})}
			</div>
		</div>
	);
};
