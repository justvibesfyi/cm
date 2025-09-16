import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import z from "zod";
import useAuth from "../svc/auth";
import useEmployee from "../svc/employee";

const updateEmployeeSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    // TODO: avatar isn't being uploaded rn
    avatar: z.string(),
});

export const employeeRoutes = new Hono().post(
    "/update",
    zValidator("json", updateEmployeeSchema),
    async (c) => {
        const sessionId = getCookie(c, 'session');

        if (!sessionId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const { firstName, lastName, avatar } = c.req.valid("json");

        const emp = useEmployee();
        const auth = useAuth();

        const employee = await auth.getSessionEmployee(sessionId);

        if(!employee) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        await emp.updateEmployee(employee.id, firstName, lastName);
    },
);
