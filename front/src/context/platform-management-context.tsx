// PlatformContext.tsx

import type { Integration, Platform } from "@back/types";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface PlatformContextType {
	selectPlatform: (platform: Platform | null) => void;
	enabledIntegrations: Set<Platform>;
	saveSelectedIntegration: () => Promise<void>;
	selectedIntegration: Integration | null;
	updateEphemeralSelectedIntegration: (
		updater: (old: Integration) => Integration,
	) => void;
	integrationMetas: {
		id: Platform;
		name: string;
		keys: string[];
	}[];
}

const PlatformManagementContext = createContext<
	PlatformContextType | undefined
>(undefined);

const integrationMetas: {
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

const createDummyIntegration = (platform: Platform): Integration | null => {
	return {
		id: 0,
		platform,
		enabled: false,
		company_id: 0,
		key_1: "",
		key_2: null,
		key_3: null,
		key_4: null,
		key_5: null,
		key_6: null,
	};
};

const getIntegrationSettings = async (selectedPlatform: Platform) => {
	const res = await api.manage.integration.$get({
		query: {
			platform: selectedPlatform
		}
	})
	if (!res.ok) {
		console.error("Failed to fetch integration settings");
		const error = await res.json();
		console.error(error);
		return null;
	}

	const data = await res.json();
	console.log(data);
	return data.integration;
};

const saveIntegrationSettings = async (integration: Integration) => {
	const res = await api.manage.integration.$put({
		json: integration,
	});

	if (!res.ok) {
		console.error("Failed to save integration settings");
		return null;
	}

	return (await res.json()).integration;
};

export const PlatformManagementProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [selectedIntegration, setSelectedIntegration] =
		useState<Integration | null>(null);

	const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
		null,
	);
	const [integrations, setIntegrations] = useState<Integration[]>([]);

	const [enabledIntegrations, setEnabledIntegrations] = useState<Set<Platform>>(
		new Set(),
	);

	useEffect(() => {
		if (!selectedPlatform) {
			setSelectedIntegration(null);
			return;
		}

		getIntegrationSettings(selectedPlatform).then((integration) => {
			if (!integration) {
				setSelectedIntegration(createDummyIntegration(selectedPlatform));
				return;
			}

			setSelectedIntegration(integration);
		});
	}, [selectedPlatform]);

	const selectPlatform = (platform: Platform | null) => {
		if (!platform) {
			setSelectedPlatform(null);
			return;
		}

		setSelectedPlatform((prev) => (prev === platform ? null : platform));
	};

	const saveSelectedIntegration = async () => {
		if (!selectedIntegration) return;
		const integration = await saveIntegrationSettings(selectedIntegration);

		if (!integration) return;

		const index = integrations.findIndex(
			(i) => i.platform === integration.platform,
		);

		if (index === -1) return;

		const newIntegrations = [...integrations];
		newIntegrations[index] = integration;
		setIntegrations(newIntegrations);
	};

	const updateEphemeralSelectedIntegration = (
		updater: (old: Integration) => Integration,
	) => {
		setSelectedIntegration((prev) => (prev ? updater(prev) : null));
	};

	return (
		<PlatformManagementContext.Provider
			value={{
				selectPlatform,
				enabledIntegrations,
				saveSelectedIntegration,
				selectedIntegration,
				updateEphemeralSelectedIntegration,
				integrationMetas,
			}}
		>
			{children}
		</PlatformManagementContext.Provider>
	);
};

export const usePlatform = () => {
	const context = useContext(PlatformManagementContext);
	if (!context) {
		throw new Error("usePlatform must be used within PlatformProvider");
	}
	return context;
};
