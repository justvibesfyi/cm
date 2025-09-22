import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { integration, message } from "../db/schema";
import useCustomer from "../svc/customer";
import type { Integration } from "../types";

const settingsMap = new Map<
    string,
    {
        company_id: number;
        webhook_secret: string;
    }
>();

// PKCE code verifier storage map
const codeVerifierMap = new Map<string, string>();

// Generate PKCE code verifier and code challenge
function generateCodeVerifier(): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 43; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function generateCodeChallenge(codeVerifier: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = new Bun.CryptoHasher("sha256").update(data).digest();
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

function createPKCEPair(state: string): {
    codeVerifier: string;
    codeChallenge: string;
} {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Store code verifier with state as key
    codeVerifierMap.set(state, codeVerifier);

    return { codeVerifier, codeChallenge };
}

const server = Bun.serve({
    port: 3102,
    routes: {
        "/callback": {
            async GET(req: Request) {
                const url = new URL(req.url);
                const code = url.searchParams.get("code");
                const state = url.searchParams.get("state");

                if (!code || !state) {
                    return new Response("Missing code or state parameter", {
                        status: 400,
                    });
                }

                // // Retrieve the code verifier using the state
                // const codeVerifier = codeVerifierMap.get(state);
                // if (!codeVerifier) {
                //     return new Response("Invalid state parameter", { status: 400 });
                // }

                // Clean up the code verifier from memory
                // codeVerifierMap.delete(state);

                try {
                    const params = new URLSearchParams();
                    params.append("code", code);
                    params.append("app_id", "4029030241979547278");
                    params.append("grant_type", "authorization_code");
                    params.append(
                        "code_verifier",
                        "1234567890123456789012345678901234567890123",
                    );

                    const response = await fetch(
                        "https://oauth.zaloapp.com/v4/oa/access_token",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                secret_key: "U8vMRqr1PYLpH8T3WBF3",
                            },
                            body: params,
                        },
                    );

                    if (!response.ok) {
                        const error = await response.text();
                        console.error("Token exchange failed:", error);
                        return new Response("Token exchange failed", { status: 500 });
                    }

                    const tokenData = await response.json();
                    console.log("Token exchange successful:", tokenData);

                    return new Response("Authorization successful", { status: 200 });
                } catch (error) {
                    console.error("Error during token exchange:", error);
                    return new Response("Internal server error", { status: 500 });
                }
            },
        },
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

                // Insert message into database
                try {
                    const cdb = await useCustomer();

                    const id = await cdb.ensureCustomer("zalo", data.sender.id, data.info.display_name, data.info.avatar, companySettings.company_id);

                    await db.insert(message).values({
                        customer_id: id,
                        content: data.message.text,
                        company_id: companySettings.company_id,
                        employee_id: null,
                    });
                } catch (error) {
                    console.error("Failed to insert message:", error);
                }

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

async function refreshAccessToken(
    tokenData: Integration,
): Promise<Integration> {
    console.log("Refreshing access token...");

    const params = new URLSearchParams();
    params.append("app_id", tokenData.key_1);
    params.append("secret_key", tokenData.key_2 || "");
    params.append("refresh_token", tokenData.key_5 || "");
    params.append("grant_type", "refresh_token");

    // const response = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: params,
    // });

    // if (!response.ok) {
    //     const error = await response.text().catch(() => "Unknown error");
    //     throw new Error(`Failed to refresh token: ${error}`);
    // }

    const data = {
        access_token:
            "Z032PU3rytEE2yPdwV3-TuCBpMNbwRyMychN0TlGln3fICbDzRFv4iWQl7FRizaGzmQkKz-ioW7gJRWNyUFJV-L2fZ-MvUH_XH2n89wQqdsr4RukqgxJVky8go_xiVD1oXEV3AE0pMkATOeccjZHQ90XfdIlXVqvdZ6DSvg9rMEM2eqnguk-B8OmxbshZu8-lHRl8eAlWqBhAEehvvs1ViuxvJEzaBTJiXE37eYNwccWCfCbcCxhQvzBZ2somVr2WpMZ7ekNcaENRjGAlO-A7uO0-sNljQ1j-owGASsLu6hCC8eEofw-GAOOsrUNjea-_YByUEg-cJY09CT-kgdpDhKVtoNSjeru-1BB7E-K-6po398Hc8RW394WarshhSOSnYEXSFU5yJFnUhDt-_Fb8z1Lkpz7SLxC0INculTm",
        refresh_token:
            "w6P80Bw96WVgRKm2jumN0-TjHm2xbNzRYpfhDfQdPpA_Cq0pYgqJOwGe93A4XXD7YYeuDeEC8aot3IWljkqmAvTfO6svyJ1hanGQ2SwEB0IJ01uTXUCVPQrg2I6Pn1uYpqK_8i_O6INfQajcml5w0inUJ4_uoLjFo5LQCyBSI53pLM4fyDb2A-1WPdVgnqqftI0RTCp42t3ZNZCTyUOb6EP6SMJjtIiPlq9uHO_-Np2AIsayrkjnNznqQYByqsjRgrKvM_ZQQL-lG4y0hV5zPVnL9pZvnJDZh7Kb9lptFcBl31CTnQD67-as7KRAf11Azn522CUjSLBmEMer_RPXOAa6KcUOiLeYhGuCTwI8LoIDDNv1Zz0bCf4q8NovfI0cf1S59vMPAbgZFnSbbBat9AOu04Tarc8qk9uU10",
        expires_in: "90000",
    } as {
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
            !tokenData ||
            Date.now() >= Number(tokenData.key_6) - TOKEN_EXPIRY_BUFFER_MS;

        if (isExpired) {
            console.log("Token expired or about to expire, refreshing...");
            tokenData = await refreshAccessToken(tokenData);
            await saveTokenData(company_id, tokenData);
            console.log("Token refreshed successfully");
        } else {
            console.log("Using existing valid token");
        }

        return tokenData.key_4 || "";
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
            settingsMap.delete(integration.key_1);
        },
    };
};

export default createZaloLink;
