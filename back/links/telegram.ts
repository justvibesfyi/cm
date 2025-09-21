import TelegramBot from "node-telegram-bot-api";
import useCustomer from "../svc/customer";
import useMessage from "../svc/message";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
}

export const createTelegramLink = (token: string, company_id: number) => {
    const bot = new TelegramBot(token, { polling: true });
    const error: string | undefined = "";

    console.log("Created a telegram bot");

    bot.on("message", async (msg) => {
        try {
            console.log(
                "📥 Incoming message from Telegram:",
                msg.from?.username || "Unknown user",
            );

            if (!msg.from) {
                console.warn("Unknown telegram user. Can't save.");
                return;
            }

            const profilePhoto = await bot.getUserProfilePhotos(msg.from.id);
            const data = {
                ...msg,
                avatarUrl: profilePhoto?.photos[0]?.[0]
                    ? await bot.getFileLink(profilePhoto.photos[0][0].file_id)
                    : undefined,
            };

            const customerDb = useCustomer();
            const id = await customerDb.ensureCustomer(
                "telegram",
                msg.from.id.toString(),
                msg.from.username ?? msg.from.first_name,
                data.avatarUrl || null,
                company_id,
            );

            const messageDb = useMessage();
            await messageDb.saveCustomerMessage(
                data.text || "<unsupported message>",
                company_id,
                id,
            );
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

    return {
        error,
        sendMessage: async (chat_id: string, msg: string): Promise<boolean> => {
            try {
                await bot.sendMessage(chat_id, msg);
                return true;
            } catch (e) {
                console.error("Failed sending message: ", e);
                return false;
            }
        },
        stop: async () => {
            console.log(`Stopping telegram bot for company: ${company_id}...`);
            await bot.stopPolling();
            await bot.logOut();
            console.log(`Stopped telegram bot for company: ${company_id}.`);
        },
    };
};
