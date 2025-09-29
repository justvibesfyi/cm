import useIntegration from "../svc/integration";
import type { Integration } from "../types";
import { createTelegramLink } from "./telegram";
import createZaloLink from "./zalo";

export type Link = {
    error: string | undefined,
    sendMessage: (chat_id: string, content: string) => Promise<boolean>,
    stop: (integration: Integration) => Promise<void>,
};
const linkMap = new Map<string, Link>();

const createKey = (integration: Integration) => `${integration.company_id}:${integration.platform}`;

export const runLink = async (integration: Integration) => {
    console.log("running link", integration.platform)
    const key = createKey(integration)
    // remove old one
    const old = linkMap.get(key);
    if (old) {
        linkMap.delete(key);
        try {
            await old.stop(integration);
        }
        catch (e) {
            console.error("Error stopping old telegram link:", e)
        }
    }

    if (integration.platform === "telegram") {
        const link = createTelegramLink(
            integration
        );

        linkMap.set(key, link);
    }
    else if (integration.platform === "zalo") {
        const link = createZaloLink(integration);
        linkMap.set(key, link);
    }
};

export const applyLinkUpdate = async (integration: Integration) => {
    if (integration.enabled) {
        runLink(integration);
    } else {
        console.log("Stopping ", integration.platform, "for company ", integration.company_id)
        const key = createKey(integration)
        const old = linkMap.get(key);
        if (old) {
            try {
                await old.stop(integration);
            }
            catch (e) {
                console.error("Error stopping old telegram link:", e)
            }
        }
        linkMap.delete(key);
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