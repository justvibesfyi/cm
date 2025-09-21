import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { customer } from "../db/schema";

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

        ensureCustomer: async (platform: string, id: string, name: string, avatar: string | null, company_id: number) => {
            const result = await db
                .insert(customer)
                .values({
                    platform,
                    platform_customer_id: id,
                    name,
                    avatar,
                    company_id
                })
                .onConflictDoUpdate({
                    target: [customer.platform, customer.platform_customer_id, customer.company_id],
                    set: {
                        name,
                        avatar
                    }
                })
                .returning({ id: customer.id });

            console.log("Ensure customer:", result[0]?.id);

            return result[0]?.id as number;
        }
    }
};

export default useCustomer;