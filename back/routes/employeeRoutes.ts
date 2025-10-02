import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import useEmployee from "../svc/employee";
import useEventBroadcaster from "../svc/eventBroadcaster";
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

		if (data) {
			const broadcaster = useEventBroadcaster();
			broadcaster.broadcastEmployeeUpdated(data);
		}

		return c.json(data);
	})
	.delete("/remove", requiresAuth, zValidator("json", z.object({
		id: z.string()
	})), async (c) => {
		const { company_id } = c.var.user;

		if (!company_id) {
			return c.json({ error: "You're not in a company" }, 401);
		}

		// todo check admin permisions
		const { id } = c.req.valid("json");
		const empDb = useEmployee();
		const deletedEmployee = await empDb.removeEmployee(id, company_id);

		if (deletedEmployee) {
			const broadcaster = useEventBroadcaster();
			broadcaster.broadcastEmployeeDeleted(deletedEmployee.id, company_id.toString());
		}

		return c.json({ success: !!deletedEmployee });
	})
	.get("/me", requiresAuth, async (c) => {
		const emp = useEmployee();
		const employeeData = await emp.getBasicEmployee(c.var.user.id);

		if (!employeeData) return c.json({ error: "Employee not found" }, 404);

		return c.json(employeeData);
	})
	.get("/all", requiresAuth, async (c) => {
		const emp = useEmployee();

		const { company_id } = c.var.user;

		if (!company_id)
			return c.json({ error: "You're not in a company" }, 401);

		const employees = await emp.getAllEmployees(company_id);

		return c.json({ employees }, 200);
	});