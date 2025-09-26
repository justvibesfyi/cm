// SelectedPlatformSettings.tsx

import type { Platform } from "@back/types";
import { Loader2Icon, MessageCircle, Save } from "lucide-react";
import { type JSX, useState } from "react";
import { usePlatform } from "@/context/platform-management-context";
import PlatformIcon from "../PlatformIcon";
import { Button } from "../ui/button";
// import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Switch } from "../ui/switch";
import { ManageChatMesh } from "./ManageChatMesh";
import { ManageDiscord } from "./ManageDiscord";
import { ManageEmail } from "./ManageEmail";
// platforms/index.ts
import { ManageTelegram } from "./ManageTelegram";
import { ManageWeChat } from "./ManageWeChat";
import { ManageWhatsapp } from "./ManageWhatsapp";
import { ManageZalo } from "./ManageZalo";

export const platformSettingsMap = {
	telegram: ManageTelegram,
	zalo: ManageZalo,
	chatmesh: ManageChatMesh,
	discord: ManageDiscord,
	whatsapp: ManageWhatsapp,
	email: ManageEmail,
	wechat: ManageWeChat,
} as const satisfies Record<Platform, () => JSX.Element>;

// For type safety
export type PlatformKey = keyof typeof platformSettingsMap;

export const ManageSelectedPlatform = () => {
	const {
		saveSelectedIntegration,
		selectedIntegration: integration,
		updateEphemeralSelectedIntegration: onUpdate,
	} = usePlatform();
	const [saving, setSaving] = useState(false);

	if (!integration) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				<MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
				<p>Select a platform above to configure its settings</p>
			</div>
		);
	}

	const isEnabled = integration.enabled;

	const PlatformComponent = platformSettingsMap[integration.platform];

	if (!PlatformComponent) {
		return <div>Unknown platform: {integration.platform}</div>;
	}

	const savePlatformSettings = async () => {
		setSaving(true);
		try {
			await saveSelectedIntegration();
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card className="border">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<PlatformIcon
							platform={integration.platform}
							className={`w-6 h-6`}
						/>
						<div>
							<h3 className="font-semibold text-black">
								{integration.platform}
							</h3>
							<p className="text-sm text-gray-500">
								{isEnabled ? "Connected" : "Disconnected"}
							</p>
						</div>
					</div>

					<Switch
						checked={isEnabled}
						onCheckedChange={(c) => {
							onUpdate((old) => {
								return {
									...old,
									enabled: c,
								};
							});
						}}
					/>
				</div>
			</CardHeader>
			<CardContent>
				<div className="border-gray-200 rounded-lg">
					<PlatformComponent />
				</div>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button disabled={saving} onClick={savePlatformSettings}>
					{saving ? (
						<Loader2Icon className="animate-spin" />
					) : (
						<Save className="w-4 h-4" />
					)}
					Save
				</Button>
			</CardFooter>
		</Card>
	);
};
