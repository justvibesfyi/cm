import { and, eq } from "drizzle-orm";
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
            return employees as Employee[];
        },
        updateEmployee: async (id: string, firstName: string, lastName: string, avatar: string | undefined) => {
            const [result] = await db
                .update(employee)
                .set({
                    first_name: firstName,
                    last_name: lastName,
                    avatar: avatar,
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
        createEmployee: async (email: string, company_id: number | null = null) => {
            const userId = crypto.randomUUID();
            await db
                .insert(employee)
                .values({ id: userId, email, company_id });
            return userId;
        },
        removeEmployee: async (id: string, company_id: number) => {
            const count = await db
                .delete(employee)
                .where(and(eq(employee.id, id), eq(employee.company_id, company_id)));

            return count > 0;
        }
    }
}

export default useEmployee;