import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { company, employee } from "../db/schema";
import useEmployee from "./employee";

const useCompany = () => {
	return {
		getCompany: async (company_id: number) => {
			const [result] = await db.select().from(company).where(eq(company.id, company_id));

			return result;
		},
		createCompany: async (
			userid: string,
			name: string,
			description: string | null,
			icon: string | null,
		) => {
			const emp = useEmployee();

			const user = await emp.getFullEmployee(userid);

			if (!user?.company_id) return false;

			const [newCompany] = await db
				.insert(company)
				.values({ name, description, icon })
				.returning({ id: company.id });

			if (!newCompany) return false;

			await db
				.update(employee)
				.set({ company_id: newCompany.id })
				.where(eq(employee.id, userid));

			return newCompany.id;
		},
		updateCompany: async (
			company_id: number,
			name: string,
			description: string | null,
			icon: string,
		) => {
			const result = await db
				.update(company)
				.set({ name, description, icon })
				.where(eq(company.id, company_id));

			return result;
		},
	};
};

export default useCompany;