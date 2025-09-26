import type { Platform } from "@back/types";

export const PLATFORM_GUIDES: Record<Platform, { title: string; steps: string[] }> = {
    telegram: {
        title: "Telegram Bot Setup",
        steps: [
            "Open Telegram and search for @BotFather.",
            "Start a chat and send the command `/newbot` to create a new bot.",
            "Follow the prompts to choose a display name and a unique username (must end in 'bot').",
            "Once created, BotFather will provide a **Bot API token**—copy it securely.",
            "Paste this token into the API Key field in your app’s integration settings.",
        ],
    },
    whatsapp: {
        title: "WhatsApp Business API Setup",
        steps: [
            "Create or log in to your Facebook Developer account at developers.facebook.com.",
            "In the Developer Console, create a new app and select 'Business' as the app type.",
            "Add the 'WhatsApp' product to your app.",
            "Under WhatsApp settings, generate a **permanent access token** (keep it secure).",
            "Configure your **webhook URL** to receive incoming messages—ensure it uses HTTPS and is publicly accessible.",
        ],
    },
    discord: {
        title: "Discord Bot Setup",
        steps: [
            "Go to the Discord Developer Portal (https://discord.com/developers/applications).",
            "Click 'New Application' and give it a name.",
            "Navigate to the 'Bot' tab and click 'Add Bot'.",
            "Copy the **Bot Token** (click 'Reset Token' if needed—treat it like a password).",
            "Go to the 'OAuth2 > URL Generator' section, select the 'bot' scope, and grant necessary permissions (e.g., Send Messages, Read Message History).",
            "Use the generated invite link to add the bot to your server.",
        ],
    },
    zalo: {
        title: "Zalo Official Account (OA) Setup",
        steps: [
            "Create a Zalo Official Account (OA) for your business via the Zalo OA Manager.",
            "Go to the Zalo Developers Portal (https://developers.zalo.me/) and log in with your OA account.",
            "Create a new application and link it to your Official Account.",
            "Note down the **App ID** and **App Secret**—these are required for API access.",
            "Configure your webhook URL to receive user messages (must be HTTPS).",
            "Enable the 'Chat' feature in your app settings to allow bot interactions [[10]].",
        ],
    },
    wechat: {
        title: "WeChat Official Account Setup",
        steps: [
            "Visit the WeChat Official Account Platform at https://mp.weixin.qq.com/ and click 'Register Now' [[14]].",
            "Choose **Service Account** (recommended for bots and APIs) over Subscription Account [[12]].",
            "Complete registration with your business details, including company name and business license [[15]].",
            "After verification, log in and navigate to 'Settings > Developer Settings'.",
            "Enable server configuration and enter your **webhook URL**, token, and encoding AES key.",
            "Generate and securely store your **AppID** and **AppSecret**—these are used for API authentication [[18]].",
        ],
    },
};