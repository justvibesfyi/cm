import type { Platform } from "@back/types";
import { MessageCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { PlatformManagementProvider } from "@/context/platform-management-context";
import { api } from "@/lib/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import ManagePlatformButton from "./ManagePlatformButton";
import { ManageSelectedPlatform } from "./ManageSelectedPlatform";

const platforms: {
	id: Platform;
	name: string;
	keys: string[];
}[] = [
	{
		id: "telegram",
		name: "Telegram",
		keys: ["Api Key"],
	},
	{
		id: "zalo",
		name: "Zalo",
		keys: ["App Id", "App Secret", "Webhook Secret"],
	},
	{
		id: "email",
		name: "Email",
		keys: ["SMTP Host", "SMTP Port", "Username", "Password"],
	},
	{
		id: "discord",
		name: "Discord",
		keys: ["Bot Token", "Client Id", "Client Secret"],
	},
	{
		id: "wechat",
		name: "WeChat",
		keys: ["App Id", "App Secret", "Token", "Encoding AES Key"],
	},
	{
		id: "whatsapp",
		name: "WhatsApp",
		keys: ["Phone Number Id", "Access Token", "Webhook Verify Token"],
	},
];

const getIntegrations = async () => {
	const res = await api.manage.integrations.$get();

	if (!res.ok) {
		console.error("Failed to fetch integrations");
		return [];
	}

	return (await res.json()).integrations;
};

const ManageIntegrations: React.FC = () => {
	const [companyIntegrations, setCompanyIntegrations] = useState<Platform[]>(
		[],
	);
	const [selectedIntegration, setSelectedIntegration] =
		useState<Platform | null>(null);

	useEffect(() => {
		getIntegrations().then((integrations) => {
			setCompanyIntegrations(integrations);
		});
	}, []);

	return (
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
				<PlatformManagementProvider>
					<div className="grid grid-cols-3 gap-3">
						{platforms.map((platform) => (
							<ManagePlatformButton
								key={platform.id}
								selectedPlatform={selectedIntegration}
								platform={platform}
								enabled={companyIntegrations.indexOf(platform.id) > -1}
							/>
						))}
					</div>

					<ManageSelectedPlatform />
				</PlatformManagementProvider>
			</CardContent>
		</Card>
	);
};

export default ManageIntegrations;
