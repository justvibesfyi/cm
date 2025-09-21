import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { integration } from "../db/schema";
import type { Integration, Platform } from "../types";

const useIntegration = () => {
    return {
        getAllEnabledIntegrations:  async () => {
            const res = await db
                .select()
                .from(integration)
                .where(eq(integration.enabled, true));

            return res;
        },
        getIntegrations: async (company_id: number) => {
            const res = await db
                .select()
                .from(integration)
                .where(eq(integration.company_id, company_id));

            return res;
        },
        updateIntegration: async (platform: Platform, company_id: number, enabled: boolean, keys: (string | null)[]) => {
            const insertKeys = {
                key_1: keys[0] || '',
                key_2: keys[1],
                key_3: keys[2],
                key_4: keys[3],
                key_5: keys[4],
                key_6: keys[5],
            };

            const res = await db
                .insert(integration)
                .values({ platform, company_id, enabled: true, ...insertKeys })
                .onConflictDoUpdate({
                    target: [integration.platform, integration.company_id], set: {
                        ...insertKeys,
                        enabled: enabled
                    }
                })
                .returning();

            return res[0] || null;
        },
        getIntegration: async (platform: Platform, company_id: number) => {
            const res = await db
                .select()
                .from(integration)
                .where(and(eq(integration.platform, platform), eq(integration.company_id, company_id)));

            return res[0] as Integration;
        }
    }
}

export default useIntegration;