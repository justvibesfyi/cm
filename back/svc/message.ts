import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { customer, message } from "../db/schema";

const useMessage = () => {
    return {
        getMessages: async (customer_id: number, company_id: number) => {
            const msgs = await db
                .select()
                .from(message)
                .where(and(
                    eq(message.company_id, company_id),
                    eq(message.customer_id, customer_id)
                ));

            return msgs;
        },
        saveCustomerMessage: async (content: string, company_id: number, customer_id: number) => {

            const res = await db
                .insert(message)
                .values({
                    content,
                    company_id,
                    customer_id: customer_id,
                    employee_id: null,
                });

            await db
                .update(customer)
                .set({
                    lastActivity: sql`CURRENT_TIMESTAMP`
                })
                .where(and(
                    eq(customer.company_id, company_id),
                    eq(customer.id, customer_id)
                ))

            return res;
        },
        saveEmployeeMessage: async (content: string, company_id: number, employee_id: string, customer_id: number) => {
            await db
                .insert(message)
                .values({
                    content,
                    company_id,
                    employee_id,
                    customer_id
                });
        }
    }
}

export default useMessage;