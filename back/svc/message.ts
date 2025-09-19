import { sql } from "bun";
import type { Message } from "../types";

const useMessage = () => {
    return {
        getMessages: async (customer_id: number, company_id: number) => {
            const msgs = await sql`
                SELECT * FROM message WHERE company_id = ${company_id} AND customer_id = ${customer_id};
            `;

            return msgs as Message[];
        },
        saveCustomerMessage: async (content: string, company_id: number, customer_id: number) => {
            console.log(content, company_id, customer_id);
            const res = await sql`
                INSERT INTO message(content, company_id, employee_id, customer_id) VALUES (${content}, ${company_id}, NULL, ${customer_id});
            `;
            console.log(res)
            return res;
        },
        saveEmployeeMessage: async (content: string, company_id: number, employee_id: string, customer_id: number) => {
            await sql`
                INSERT INTO message(content, company_id, employee_id, customer_id) VALUES (${content}, ${company_id}, ${employee_id}, ${customer_id});
            `;
        }
    }
}

export default useMessage;