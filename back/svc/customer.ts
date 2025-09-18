import { sql } from "bun";
import type { Customer } from "../types";

const useCustomer = () => {
    return {
        getCustomers: async (company_id: number) => {
            const customers = await sql`
                SELECT * FROM customer WHERE company_id = ${company_id}
            `.then(res => res);

            return customers as Customer[];
        }
    }
};

export default useCustomer;