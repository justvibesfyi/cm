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
import { PlatformGuide } from "./PlatformGuide";

const ManageIntegrations: React.FC = () => {
	return (
		<PlatformManagementProvider>
			<div className="w-full max-w-full p-4 h-full">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-w-0  h-full">
					{/* Platform Configuration Section */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<MessageCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
							<h2 className="text-lg font-semibold">Platform Configuration</h2>
						</div>
						<p className="text-sm text-muted-foreground">
							Connect and manage your messaging platforms
						</p>
						<div className="space-y-4 pt-2">
							<ManagePlatformMenu />
							<ManageSelectedPlatform />
						</div>
					</div>

					<div className="space-y-4">
						<PlatformGuide />
					</div>
				</div>
			</div>
		</PlatformManagementProvider>
	);
};

export default ManageIntegrations;
