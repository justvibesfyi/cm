import { sql } from "bun";
import useEmployee from "./employee";

const useCompany = () => {
	return {
		createCompany: async (
			userid: string,
			name: string,
			description: string | null,
			icon: string | null,
		) => {
			const emp = useEmployee();

			const user = await emp.getFullEmployee(userid);

			if (user.company_id) return false;

			const res = await sql`
                INSERT INTO company (name, description, icon) VALUES (${name}, ${description}, ${icon}) RETURNING id
            `.then((res) => res[0]);

			if (!res) return false;

			await sql`
				UPDATE employee SET company_id = ${res.id} WHERE id = ${userid};
			`;

			return res.id;
		},
		updateCompany: async (
			company_id: number,
			name: string,
			description: string | null,
			icon: string,
		) => {
			const res = await sql`
                UPDATE company SET name = ${name}, description = ${description}, icon = ${icon} WHERE id = ${company_id};
            `.then((res) => res[0]);

			return res;
		},
	};
};

export default useCompany;