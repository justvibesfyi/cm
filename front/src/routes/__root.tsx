import {
	createRootRouteWithContext,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { AuthState } from "../auth";

const RootLayout = () => (
	<>
		<Outlet />
		{/* <TanStackRouterDevtools /> */}
	</>
);

interface RouterContext {
	auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});
