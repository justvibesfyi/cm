import { zValidator } from "@hono/zod-validator";
import { sql } from "bun";
import { Hono } from "hono";
import z from "zod";
import useCompany from "../svc/company";
import useEmployee from "../svc/employee";
import type { Company } from "../types";
import requiresAuth from "./middleware/requiresAuth";

const updateCompanySchema = z.object({
	name: z.string().min(1).max(50),
	description: z.string().min(1).max(100).nullable().catch(""),
	icon: z.url().nullable().catch(null),
});

export const companyRoutes = new Hono()
	.use("*", requiresAuth)
	.post("/onboard", zValidator("json", updateCompanySchema), async (c) => {
		const { name, description, icon } = c.req.valid("json");

		const emp = useEmployee();

		// todo role check
		const employee = await emp.getFullEmployee(c.var.user.id);
		if (!employee)
			return c.json({ error: "Employee not found" }, 404);

		const { company_id, position: _ } = employee;

		if (company_id !== null)
			return c.json({ error: "You're already in a company" }, 401);

		const comp = useCompany();

		const new_company_id = await comp.createCompany(
			c.var.user.id,
			name,
			description,
			icon,
		);

		if (!new_company_id)
			return c.json({ error: "You're already in a company" }, 400);

		return c.json({ success: true, company_id });
	})
	.put("/update", zValidator("json", updateCompanySchema), async (c) => {
		const { name, description, icon } = c.req.valid("json");

		const emp = useEmployee();

		// todo role check
		const { company_id, role: _ } = await emp.getFullEmployee(c.var.user.id);

		if (company_id === null)
			return c.json({ error: "You're not in a company" }, 400);

		const comp = useCompany();
		await comp.updateCompany(company_id, name, description, icon);

		return c.json({ success: true });
	})
	.get("/my-business", async (c) => {
		const emp = useEmployee();

		const { company_id, role: _ } = await emp.getFullEmployee(c.var.user.id);

		if (company_id === null)
			return c.json({ error: "You're not in a company" }, 400);

		const company: Company =
			await sql`SELECT * FROM company WHERE id = ${company_id}`.then(
				(res) => res[0],
			);

		return c.json({ company });
	});
