import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { integration } from "../db/schema";
import type { Integration } from "../types";

const useIntegration = () => {
    return {
        getAllEnabledIntegrations: async () => {
            const res = await db
                .select()
                .from(integration)
                .where(eq(integration.enabled, true));

            return res as Integration[];
        }
    }
}

export default useIntegration;