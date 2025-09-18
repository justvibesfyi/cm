import { sql } from "bun";
import type { Employee } from "../types";

const useEmployee = () => {
    return {
        getBasicEmployee: async (id: string) => {
            const employee = await sql`
                SELECT * FROM employee WHERE id = ${id}
            `.then(res => res[0]);
            return employee as Employee | undefined;
        },
        getFullEmployee: async (id: string) => {
            const employee = await sql`
                SELECT * FROM employee WHERE id = ${id}
            `.then(res => res[0]);
            return employee as Employee;
        },
        getCompanyEmployees: async (company_id: number) => {
            const employees = await sql`
                SELECT * FROM employee WHERE company_id = ${company_id}
            `.then(res => res[0]);
            return employees;
        },
        updateEmployee: async (id: string, firstName: string, lastName: string) => {
            const employee = await sql`
                UPDATE employee
                SET
                    first_name = ${firstName},
                    last_name = ${lastName},
                    onboarded = true
                WHERE id = ${id}
                RETURNING *
            `.then(res => res[0]);

            return employee as Employee;
        },
        setEmployeeCompany: async (id: string, company_id: number) => {
            const res = await sql`
                UPDATE employee SET company_id = ${company_id} WHERE id = ${id}
                RETURNING CHANGES() as c;
            `.then(res => res[0]);

            return !!res?.c;
        },
        createEmployee: async (email: string) => {
            const userId = crypto.randomUUID();
            await sql`
                INSERT INTO employee (id, email) VALUES (${userId}, ${email});
            `;
            return userId;
        }
    }
}

export default useEmployee;