import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import z from "zod";
import useAuth from "../svc/auth";

const loginSchema = z.object({
    email: z.email(),
});

const logoutSchema = z.object({
    email: z.email(),
})

const validationSchema = z.object({
    email: z.email(),
    code: z.string(),
});

export const authRoutes = new Hono()
    .get("/logout", zValidator('json', logoutSchema), async (c) => {
        const auth = useAuth();

        const { email } = c.req.valid('json')

        const sess = getCookie(c, "session");

        if (!sess) return c.redirect('/');

        await auth.logoutSession(email, sess);
        deleteCookie(c, "session");

        return c.redirect("/login");
    })
    .post("/start-login", zValidator("json", loginSchema), async (c) => {
        const auth = useAuth();

        const { email } = c.req.valid('json')

        const res = await auth.sendCodeEmail(email);

        if (res === false) {
            return c.json({ error: "Try again in 1 minute" }, 422)
        }

        return c.json({ ok: true }, 200);
    })
    .post("/verify-login", zValidator("json", validationSchema), async (c) => {
        const auth = useAuth();

        const { email, code } = c.req.valid('json')

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

        return c.redirect('/app');
    })
    .get("/me", async (c) => {
        const auth = useAuth();

        const sess = getCookie(c, "session");

        if (!sess) return c.json({ error: "Not logged in" }, 401);

        const user = await auth.getSessionUser(sess);

        if (!user) {
            deleteCookie(c, "session");
            return c.json({ error: "Not found" }, 404);
        }

        return c.json(user);
    })
