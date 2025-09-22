import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { company, employee } from "../db/schema";
import useEmployee from "./employee";

const useCompany = () => {
	return {
		getCompany: async (company_id: number) => {
			const [result] = await db
				.select()
				.from(company)
				.where(eq(company.id, company_id));

			return result;
		},
		createCompany: async (
			user_id: string,
			name: string,
			description: string | null,
			icon: string | null,
		) => {

			const [newCompany] = await db
				.insert(company)
				.values({ name, description, icon })
				.returning({ id: company.id });

			if (!newCompany)
				return null;

			const empDb = useEmployee();
			await empDb.setEmployeeCompany(user_id, newCompany.id);

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
