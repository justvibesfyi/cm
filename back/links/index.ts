import useIntegration from "../svc/integration";
import type { Integration } from "../types";
import { createTelegramLink } from "./telegram";

export type Link = { sendMessage: (chat_id: string, content: string) => Promise<boolean> };
const linkMap = new Map<string, Link>();

export const runLink = (integration: Integration) => {
    if (integration.platform === "telegram") {
        const link = createTelegramLink(
            integration.api_key,
            integration.company_id,
        );
        linkMap.set(`${integration.company_id}:${integration.platform}`, link);
    }
};

export const runEnabledLinks = async () => {
    const integrationDb = useIntegration();

    const integrations = await integrationDb.getAllEnabledIntegrations();

    for (const integration of integrations) {
        runLink(integration);
    }
};

export const sendMessageToLink = (
    company_id: number,
    platform: string,
    chat_id: string,
    content: string,
) => {
    const link = linkMap.get(`${company_id}:${platform}`);
    if (!link) {
        throw new Error("Link not found");
    }

    return link.sendMessage(chat_id, content);
}