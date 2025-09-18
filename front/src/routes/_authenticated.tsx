import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ context, location }) => {
		console.log("Authenticated?", context.auth.isAuthenticated, location.href);
		const { user, isAuthenticated } = context.auth;
		if (!isAuthenticated) {
			throw redirect({
				to: "/login",
			});
		} else if (user) {
			if (!user.onboarded) {
				if (location.pathname !== "/onboard") {
					throw redirect({
						to: "/onboard",
					});
				}
			} else if (
				user.company_id === null &&
				location.pathname !== "/onboard-company"
			) {
				throw redirect({
					to: "/onboard-company",
				});
			}
		}
	},
	component: () => <Outlet />,
});
