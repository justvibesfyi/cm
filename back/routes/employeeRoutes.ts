import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import useEmployee from "../svc/employee";
import requiresAuth from "./middleware/requiresAuth";

const updateEmployeeSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	avatar: z.string().optional(),
});

export const employeeRoutes = new Hono()
	.post("/onboard", requiresAuth, zValidator("json", updateEmployeeSchema), async (c) => {
		const { firstName, lastName, avatar } = c.req.valid("json");

		const emp = useEmployee();
		const data = await emp.updateEmployee(c.var.user.id, firstName, lastName, avatar);

		return c.json(data);
	})
	.get("/me", requiresAuth, async (c) => {
		const emp = useEmployee();
		const employeeData = await emp.getBasicEmployee(c.var.user.id);

		if (!employeeData) return c.json({ error: "Employee not found" }, 404);

		return c.json(employeeData);
	});