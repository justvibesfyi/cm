import { sql } from "bun";

const useEmployee = () => {
    return {
        getEmployee: async (id: number) => {
            const user = await sql`SELECT * FROM employee WHERE id = ${id}`.then(res => res[0]);
            return user;
        },
        getCompanyEmployees: async (company_id: number) => {
            const employees = await sql`SELECT * FROM employee WHERE company_id = ${company_id}`;
            return employees;
        },
        updateEmployee: async (id: number, name: string, email: string, company_id: number) => {
            const user = await sql`UPDATE employee SET name = ${name}, email = ${email}, company_id = ${company_id}
                WHERE id = ${id}`.then(res => res[0]);
            return user;
        },
        setEmployeeCompany: async (id: number, company_id: number) => {
            const res = await sql`UPDATE employee SET company_id = ${company_id} WHERE id = ${id}
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