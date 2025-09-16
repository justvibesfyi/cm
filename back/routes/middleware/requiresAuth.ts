import { deleteCookie, getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import useAuth from "../../svc/auth";

const requiresAuth = createMiddleware<{
	Variables: {
		user: {
			id: string;
			email: string;
		};
	};
}>(async (c, next) => {
	const auth = useAuth();

	const sess = getCookie(c, "session");

	if (!sess) return c.json({ error: "Not logged in" }, 401);

	const user = await auth.getSessionEmployee(sess);

	if (!user) {
		deleteCookie(c, "session");
		return c.json({ error: "Employee Not found" }, 404);
	}

	c.set("user", user);

	return next();
});

export default requiresAuth;