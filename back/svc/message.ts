import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { message } from "../db/schema";

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
            console.log(content, company_id, customer_id);
            const res = await db
                .insert(message)
                .values({
                    content,
                    company_id,
                    employee_id: null,
                    customer_id: customer_id
                });
            console.log(res)
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