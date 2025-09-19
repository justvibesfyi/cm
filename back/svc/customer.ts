import { sql } from "bun";
import type { Customer } from "../types";

const useCustomer = () => {
    return {
        getById: async (id: number) => {
            const customer = await sql`
                SELECT * FROM customer WHERE id = ${id}
            `.then(res => res[0]);

            return customer as Customer;
        },
        getCustomers: async (company_id: number) => {
            const customers = await sql`
                SELECT * FROM customer WHERE company_id = ${company_id}
            `.then(res => res);

            return customers as Customer[];
        },

        ensureCustomer: async (platform: string, id: string, name: string, avatar: string | null, company_id: number) => {
            const customer = await sql`
                INSERT INTO customer (platform, customer_id, name, avatar, company_id)
                    VALUES (${platform}, ${id}, ${name}, ${avatar}, ${company_id})
                ON CONFLICT (platform, customer_id, company_id) DO UPDATE SET
                    name = ${name},
                    avatar = ${avatar}
                RETURNING id;
            `.then(res => res[0]);

            return customer.id as number;
        }
    }
};

export default useCustomer;