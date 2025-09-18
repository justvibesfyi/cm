import { sql } from "bun";
import type { Message } from "../types";

const useMessage = () => {
    return {
        getMessages: async (customer_id: number, company_id: number) => {
            const msgs = await sql`
                SELECT * FROM message WHERE company_id = ${company_id} AND customer_id = ${customer_id};
            `;

            return msgs as Message[];
        }
    }
}

export default useMessage;