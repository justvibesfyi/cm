import { Separator } from "@radix-ui/react-separator";
import {
	Badge,
	Clock,
	MapPin,
	Monitor,
	Shield,
	Smartphone,
	Tablet,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const ManageSessions = () => {
	const [sessions, setSessions] = useState<Session[]>([
		{
			id: "1",
			userEmail: "john@acme.com",
			deviceType: "desktop",
			deviceName: "MacBook Pro",
			location: "New York, US",
			lastActivity: "2 minutes ago",
			ipAddress: "192.168.1.100",
			current: true,
		},
		{
			id: "2",
			userEmail: "sarah@acme.com",
			deviceType: "mobile",
			deviceName: "iPhone 15",
			location: "Los Angeles, US",
			lastActivity: "1 hour ago",
			ipAddress: "192.168.1.101",
			current: false,
		},
		{
			id: "3",
			userEmail: "john@acme.com",
			deviceType: "tablet",
			deviceName: "iPad Air",
			location: "New York, US",
			lastActivity: "3 hours ago",
			ipAddress: "192.168.1.102",
			current: false,
		},
		{
			id: "4",
			userEmail: "mike@acme.com",
			deviceType: "desktop",
			deviceName: "Windows PC",
			location: "Chicago, US",
			lastActivity: "1 day ago",
			ipAddress: "192.168.1.103",
			current: false,
		},
	]);

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

	const revokeSession = (sessionId: string) => {
		setSessions(sessions.filter((session) => session.id !== sessionId));
	};

	return (
		<div className="p-4">
			<p className="text-sm text-muted-foreground">
				Manage active user sessions and security
			</p>
			<div className="space-y-4">
				{sessions.map((session) => {
					const DeviceIcon = getDeviceIcon(session.deviceType);
					return (
						<div
							key={session.id}
							className="flex items-center justify-between p-4 border rounded-lg"
						>
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
									<DeviceIcon className="w-5 h-5 text-muted-foreground" />
								</div>
								<div>
									<div className="flex items-center gap-2 mb-1">
										<p className="font-medium">{session.userEmail}</p>
										{session.current && (
											<Badge variant="secondary">Current Session</Badge>
										)}
									</div>
									<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
										<span className="flex items-center gap-1">
											<Monitor className="w-3 h-3" />
											{session.deviceName}
										</span>
										<Separator orientation="vertical" className="h-3" />
										<span className="flex items-center gap-1">
											<MapPin className="w-3 h-3" />
											{session.location}
										</span>
										<Separator orientation="vertical" className="h-3" />
										<span className="flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{session.lastActivity}
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										IP: {session.ipAddress}
									</p>
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
