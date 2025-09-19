import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { employee } from "../db/schema";
import type { Employee } from "../types";

const useEmployee = () => {
    return {
        getBasicEmployee: async (id: string) => {
            const [result] = await db
                .select()
                .from(employee)
                .where(eq(employee.id, id));
            return result as Employee | undefined;
        },
        getFullEmployee: async (id: string) => {
            const [result] = await db
                .select()
                .from(employee)
                .where(eq(employee.id, id));
            return result;
        },
        getCompanyEmployees: async (company_id: number) => {
            const employees = await db
                .select()
                .from(employee)
                .where(eq(employee.company_id, company_id));
            return employees;
        },
        updateEmployee: async (id: string, firstName: string, lastName: string) => {
            const [result] = await db
                .update(employee)
                .set({
                    first_name: firstName,
                    last_name: lastName,
                    onboarded: true
                })
                .where(eq(employee.id, id))
                .returning();

            return result;
        },
        setEmployeeCompany: async (id: string, company_id: number) => {
            const result = await db
                .update(employee)
                .set({ company_id })
                .where(eq(employee.id, id))
                .returning({ id: employee.id });

            return result.length > 0;
        },
        createEmployee: async (email: string) => {
            const userId = crypto.randomUUID();
            await db
                .insert(employee)
                .values({ id: userId, email });
            return userId;
        }
    }
}

export default useEmployee;