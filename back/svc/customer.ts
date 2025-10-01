import { eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { customer } from "../db/schema";
import type { CustomerStatus } from "../types";

const useCustomer = () => {
    return {
        getById: async (id: number) => {
            const [result] = await db
                .select()
                .from(customer)
                .where(eq(customer.id, id));

            return result;
        },
        getCustomers: async (company_id: number) => {
            const customers = await db
                .select()
                .from(customer)
                .where(eq(customer.company_id, company_id));

            return customers;
        },

        ensureCustomer: async (
            platform: string,

            platform_id: string,
            username: string,
            full_name: string,
            company_id: number,

            avatar: string | null,
            phone: string | null,
            country: string | null,
            city: string | null,
            device: string | null,
            ip: string | null,
            status: CustomerStatus = 'unknown',
        ) => {
            const result = await db
                .insert(customer)
                .values({
                    platform,
                    platform_id,
                    username,
                    full_name,
                    avatar,
                    company_id,
                    phone,
                    country,
                    city,
                    device,
                    ip,
                    lastActivity: sql`CURRENT_TIMESTAMP`,
                    status
                })
                .onConflictDoUpdate({
                    target: [customer.platform, customer.platform_id, customer.company_id],
                    set: {
                        username,
                        full_name,
                        avatar,
                        phone,
                        country,
                        city,
                        device,
                        ip,
                        status
                    }
                })
                .returning({ id: customer.id });

            console.log("Ensure customer:", result[0]?.id);

            return result[0]?.id as number;
        }
    }
};

export default useCustomer;