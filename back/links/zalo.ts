import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { integration } from "../db/schema";
import type { Integration } from "../types";

const settingsMap = new Map<
    string,
    {
        company_id: number;
        webhook_secret: string;
    }
>();

const server = Bun.serve({
    port: 3102,
    routes: {
        "/zalo-webhook": {
            async POST(req: Request) {
                console.log("Zalo webhook received");
                const signature = req.headers.get("x-zevent-signature");
                if (!signature) {
                    return new Response("Unauthorized", { status: 401 });
                }

                const raw = await req.text();
                const data = JSON.parse(raw) as {
                    app_id: string;
                    timestamp: string;
                    event_name: string;
                    sender: {
                        id: string;
                    };
                    message: {
                        text: string;
                    };
                    info: {
                        avatar: string;
                        display_name: string;
                    };
                };

                const appId = data.app_id;
                const timeStamp = data.timestamp;

                const companySettings = settingsMap.get(appId);

                if (!companySettings) {
                    console.error("No integration settings found for the appid:", appId);
                    return new Response("Unauthorized", { status: 401 });
                }

                const secret = companySettings.webhook_secret;

                if (!appId || !timeStamp || !secret) {
                    console.error("Missing appId, timeStamp or secret");
                    return new Response("Unauthorized", { status: 401 });
                }

                console.log(JSON.stringify(data));
                const macSource = appId + raw + timeStamp + secret;

                const mac =
                    "mac=" +
                    new Bun.CryptoHasher("sha256").update(macSource).digest("hex");

                if (signature !== mac) {
                    console.error("Invalid signature for app id", appId, signature, mac);
                    return new Response("Unauthorized", { status: 401 });
                }
                if (
                    data.event_name !== "user_send_text" ||
                    !data.sender?.id ||
                    !data.message?.text
                ) {
                    console.error("Ignored event ", data.event_name);
                    return new Response("Ignored", { status: 200 });
                }

                const userProfile = (await getUserProfile(
                    data.sender.id,
                    companySettings.company_id,
                )) as {
                    avatar: string;
                    display_name: string;
                };

                data.info = userProfile;
                console.log(userProfile);

                console.log("Forwarding to server", data);
                // await fetch(new URL('/msg/zalo', process.env.SERVER_URL), {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
                return new Response("OK", { status: 200 });
            },
        },
    },
    fetch() {
        return new Response("OK", { status: 200 });
    },
});

async function loadTokenData(company_id: number): Promise<Integration | null> {
    try {
        const result = await db
            .select()
            .from(integration)
            .where(
                and(
                    eq(integration.company_id, company_id),
                    eq(integration.platform, "zalo"),
                ),
            );

        const res = result[0];
        if (res) {
            return res;
        }
    } catch (error) {
        console.error("Failed to load token data:", error);
    }

    return null;
}
async function saveTokenData(company_id: number, data: Integration) {
    try {
        await db
            .update(integration)
            .set({
                key_4: data.key_4,
                key_5: data.key_5,
                key_6: data.key_6,
            })
            .where(
                and(
                    eq(integration.company_id, company_id),
                    eq(integration.platform, "zalo"),
                ),
            );
    } catch (error) {
        console.error("Failed to save token data:", error);
        throw new Error("Failed to save token data");
    }
}

async function refreshAccessToken(tokenData: Integration): Promise<Integration> {

    
    console.log("Refreshing access token...");

    const params = new URLSearchParams();
    params.append("app_id", tokenData.key_1);
    params.append("secret_key", tokenData.key_2 || "");
    params.append("refresh_token", tokenData.key_5 || "");
    params.append("grant_type", "refresh_token");

    const response = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });

    if (!response.ok) {
        const error = await response.text().catch(() => "Unknown error");
        throw new Error(`Failed to refresh token: ${error}`);
    }

    const data = (await response.json()) as {
        access_token: string;
        refresh_token: string;
        expires_in: string; // in seconds
    };

    if (!data.access_token || !data.refresh_token || !data.expires_in) {
        console.log(data);
        throw new Error("Invalid token response from Zalo");
    }

    const expiresInMs = parseInt(data.expires_in, 10) * 1000;
    const expiresAt = Date.now() + expiresInMs;

    return {
        ...tokenData,
        key_4: data.access_token,
        key_5: data.refresh_token,
        key_6: expiresAt.toString(),
    } as Integration;
}

async function ensureAccessToken(company_id: number): Promise<string> {
    const TOKEN_EXPIRY_BUFFER_MS = 2 * 60 * 1000; // 2 minutes

    try {
        let tokenData = await loadTokenData(company_id);

        if (!tokenData) {
            console.error("Zalo enabled but no credentials");
            throw new Error("Zalo enabled but no credentials");
        }

        // Check if token is expired or about to expire (within buffer time)
        const isExpired =
            !tokenData || Date.now() >= Number(tokenData.key_6) - TOKEN_EXPIRY_BUFFER_MS;

        if (isExpired) {
            console.log("Token expired or about to expire, refreshing...");
            tokenData = await refreshAccessToken(tokenData);
            await saveTokenData(company_id, tokenData);
            console.log("Token refreshed successfully");
        } else {
            console.log("Using existing valid token");
        }

        return tokenData.key_4 || '';
    } catch (error) {
        console.error("Error ensuring access token:", error);
        throw new Error("Failed to obtain valid access token");
    }
}

async function getUserProfile(userId: string, company_id: number) {
    const response = await fetch(
        `https://openapi.zalo.me/v3.0/oa/user/detail?data={"user_id":"${userId}"}`,
        {
            headers: {
                access_token: await ensureAccessToken(company_id),
            },
        },
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const result = (await response.json()) as {
        data: {
            display_name: string;
            avatar: string;
        };
        error: number;
        message: string;
    };

    if (result.error !== 0) {
        throw new Error(`Zalo API error: ${result.message}`);
    }

    return result.data;
}

const shutdown = () => {
    console.log("Server shutting down");
    server.stop();
    process.exit(0);
};

["SIGINT", "SIGTERM"].forEach((signal) => {
    process.once(signal, shutdown);
});

console.log(`Zalo webhook is listening on port ${server.port}`);

const createZaloLink = (integration: Integration) => {
    const error = undefined;

    settingsMap.set(integration.key_1, {
        company_id: integration.company_id,
        webhook_secret: integration.key_3 || "",
    });

    return {
        error,
        sendMessage: async (chat_id: string, msg: string): Promise<boolean> => {
            const accessToken = await ensureAccessToken(integration.company_id);

            if (!chat_id || !msg) {
                console.error("Missing chatId or content");
                return false;
            }

            console.log("Sending message to Zalo", chat_id, msg);
            const res = await fetch("https://openapi.zalo.me/v3.0/oa/message/cs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    access_token: accessToken,
                },
                body: JSON.stringify({
                    recipient: { user_id: chat_id },
                    message: { text: msg },
                }),
            });

            interface ZaloApiResponse {
                error: number;
                message: string;
                data: {
                    message_id: string;
                    user_id: string;
                    quota?: {
                        quota_type: string;
                        remain?: string;
                        total?: string;
                        expired_date?: string;
                        owner_type?: string;
                        owner_id?: string;
                    };
                };
            }

            const response = (await res.json()) as ZaloApiResponse;
            console.log("Message sent to Zalo", response);

            if (!res.ok || response.error !== 0) {
                console.error("Failed to send message to Zalo:", response);
                return false;
            }

            console.log("Message sent to Zalo successfully", response);
            return true;
        },
        stop: async (integration: Integration) => {
            settingsMap.delete(integration.key_1)
        },
    };
};

export default createZaloLink;
