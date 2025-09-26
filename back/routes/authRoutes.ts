import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { deleteCookie, setCookie } from "hono/cookie";
import z from "zod";
import useAuth from "../svc/auth";
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

        const user = await auth.getSessionEmployee(sessId);

        return c.json(user)
    })
    .get("/invitation/:token", async (c) => {
        const auth = useAuth();
        const token = c.req.param("token");

        if (!token) {
            return c.json({ error: "Invalid invitation link" }, 400);
        }

        const sessionId = await auth.loginWithInvitation(token);

        if (!sessionId) {
            return c.json({ error: "Invalid or expired invitation" }, 404);
        }

        setCookie(c, "session", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        });

        const user = await auth.getSessionEmployee(sessionId);

        if (!user) {
            return c.json({ error: "Session creation failed" }, 500);
        }

        return c.redirect("/onboard");
    })
    .get("/logout", requiresAuth, async (c) => {
        const auth = useAuth();

        await auth.logoutEmployee(c.var.user.id)
        deleteCookie(c, "session");

        return c.redirect("/login");
    });
