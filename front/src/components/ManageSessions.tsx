import { Separator } from "@radix-ui/react-separator";
import { useQuery } from "@tanstack/react-query";
import {
	Badge,
	Cable,
	Calendar,
	Clock,
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

export const getSessions = async () => {
	const res = await api.manage.sessions.$get();

	if (!res.ok) {
		throw new Error("Unable to get sessions");
	}

	const { sessions } = await res.json();

	return sessions;
};

export const ManageSessions = () => {
	const {
		data: sessions,
		isFetching,
		isError,
	} = useQuery({ queryKey: ["all-sessions"], queryFn: getSessions });

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

	const revokeSession = (sessionId: string) => {};

	if (!sessions) {
		return <>Loading...</>;
	}

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

							{!session.current && (
								<Button
									variant="ghost"
									size="sm"
									className="text-destructive hover:text-destructive"
									onClick={() => revokeSession(session.id)}
								>
									<Shield className="w-4 h-4 mr-1" />
									Revoke
								</Button>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};
