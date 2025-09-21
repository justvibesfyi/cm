// PlatformContext.tsx

import type { Integration, Platform } from "@back/types";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface PlatformContextType {
	selectedPlatform: Platform | null;
	selectPlatform: (platform: Platform | null) => void;
	enabledIntegrations: Set<Platform>;
	saveSelectedIntegration: () => Promise<void>;
	ephemeralSelectedIntegration: Integration | null;
	updateEphemeralSelectedIntegration: (
		updater: (old: Integration) => Integration,
	) => void;
}

const PlatformManagementContext = createContext<
	PlatformContextType | undefined
>(undefined);

const getIntegrationSettings = async () => {
	const res = await api.manage.integrations.$get();

	if (!res.ok) {
		console.error("Failed to fetch integration settings");
		return null;
	}

	return (await res.json()).integrations;
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
	const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
		null,
	);

	const [ephemeralSelectedIntegration, setEphemeralSelectedIntegration] =
		useState<Integration | null>(null);

	const [integrations, setIntegrations] = useState<Integration[]>([]);

	const [enabledIntegrations, setEnabledIntegrations] = useState<Set<Platform>>(
		new Set(),
	);

	useEffect(() => {
		setEphemeralSelectedIntegration(
			integrations.find((i) => i.platform === selectedPlatform) ?? null,
		);
	}, [selectedPlatform, integrations]);

	useEffect(() => {
		getIntegrationSettings().then((integs) => {
			if (!integs) return;

			setIntegrations(integs);
			setEnabledIntegrations(
				new Set(integs.filter((i) => i.enabled).map((i) => i.platform)),
			);
		});
	}, []);

	const selectPlatform = (platform: Platform | null) => {
		setSelectedPlatform((prev) => (prev === platform ? null : platform));
	};

	const saveSelectedIntegration = async () => {
		if (!ephemeralSelectedIntegration) return;
		const integration = await saveIntegrationSettings(
			ephemeralSelectedIntegration,
		);

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
		if (ephemeralSelectedIntegration)
			setEphemeralSelectedIntegration(updater(ephemeralSelectedIntegration));
	};

	return (
		<PlatformManagementContext.Provider
			value={{
				selectedPlatform,
				selectPlatform,
				enabledIntegrations,
				saveSelectedIntegration,
				ephemeralSelectedIntegration,
				updateEphemeralSelectedIntegration,
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
