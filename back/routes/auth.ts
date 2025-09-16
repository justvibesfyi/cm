import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { deleteCookie, setCookie } from "hono/cookie";
import z from "zod";
import useAuth from "../svc/auth";
import useEmployee from "../svc/employee";
import requiresAuth from "./middleware/requiresAuth";

const loginSchema = z.object({
    email: z.email(),
});

const validationSchema = z.object({
    email: z.email(),
    code: z.string(),
});

export const authRoutes = new Hono()
    .post("/start-login", zValidator("json", loginSchema), async (c) => {
        const auth = useAuth();

        const { email } = c.req.valid("json");

        const res = await auth.sendCodeEmail(email);

        if (res === false) {
            return c.json({ error: "Try again in 1 minute" }, 422);
        }

        return c.json({ ok: true }, 200);
    })
    .post("/verify-login", zValidator("json", validationSchema), async (c) => {
        const auth = useAuth();

        const { email, code } = c.req.valid("json");

        const sessId = await auth.finalizeLogin(email, code);

        if (sessId === false) {
            return c.json({ error: "Invalid code" }, 403);
        }

        setCookie(c, "session", sessId, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });

        return c.redirect("/app");
    })
    .get("/me", requiresAuth, async (c) => {

        const emp = useEmployee();
        const employeeData = await emp.getEmployee(c.var.user.id);

        return c.json(employeeData);
    })
    .get("/logout", requiresAuth, async (c) => {
        const auth = useAuth();

        await auth.logoutEmployee(c.var.user.id)
        deleteCookie(c, "session");

        return c.redirect("/login");
    });
