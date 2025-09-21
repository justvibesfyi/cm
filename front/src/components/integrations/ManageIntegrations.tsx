import { MessageCircle } from "lucide-react";
import type React from "react";
import { PlatformManagementProvider } from "@/context/platform-management-context";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ManagePlatformMenu } from "./ManagePlatformMenu";
import { ManageSelectedPlatform } from "./ManageSelectedPlatform";

const ManageIntegrations: React.FC = () => {
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
					<ManagePlatformMenu />
					<ManageSelectedPlatform />
				</PlatformManagementProvider>
			</CardContent>
		</Card>
	);
};

export default ManageIntegrations;
