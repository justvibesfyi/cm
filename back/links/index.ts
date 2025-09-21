import useIntegration from "../svc/integration";
import type { Integration } from "../types";
import { createTelegramLink } from "./telegram";

export type Link = {
    error: string | undefined,
    sendMessage: (chat_id: string, content: string) => Promise<boolean>,
    stop: () => Promise<void>,
};
const linkMap = new Map<string, Link>();

const createKey = (integration: Integration) => `${integration.company_id}:${integration.platform}`;

export const runLink = async (integration: Integration) => {
    const key = createKey(integration)
    // remove old one
    const old = linkMap.get(key);
    if (old) {
        linkMap.delete(key);
        try {
            await old.stop();
        }
        catch (e) {
            console.error("Error stopping old telegram link:", e)
        }
    }

    if (integration.platform === "telegram") {
        const link = createTelegramLink(
            integration.key_1,
            integration.company_id,
        );

        linkMap.set(key, link);
    }
};

export const applyLinkUpdate = (integration: Integration) => {
    if (integration.enabled) {
        runLink(integration);
    } else {
        linkMap.delete(createKey(integration));
    }
}

export const runEnabledLinks = async () => {
    const integrationDb = useIntegration();

    const integrations = await integrationDb.getAllEnabledIntegrations();

    for (const integration of integrations) {
        try {
            await runLink(integration);
        }
        catch (e) {
            console.error("Unable to start integraton: ", integration.platform, " for company: ", integration.company_id, e)
        }
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