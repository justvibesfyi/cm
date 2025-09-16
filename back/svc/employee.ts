import { sql } from "bun";

const useEmployee = () => {
    return {
        getEmployee: async (id: string) => {
            const user = await sql`
                SELECT first_name, last_name, email, onboarded FROM employee WHERE id = ${id}
            `.then(res => res[0]);
            return user;
        },
        getCompanyEmployees: async (company_id: number) => {
            const employees = await sql`
                SELECT * FROM employee WHERE company_id = ${company_id}
            `.then(res => res[0]);
            return employees;
        },
        updateEmployee: async (id: string, firstName: string, lastName: string) => {
            await sql`
                UPDATE employee SET first_name = ${firstName}, last_name = ${lastName}
                WHERE id = ${id}
            `;
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