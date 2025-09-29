import "@fontsource/geist";
import "@fontsource/inter";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ClientError from "./components/ClientError.tsx";
import { AuthProvider, useAuth } from "./providers/auth.tsx";
import { ThemeProvider } from "./providers/theme.tsx";
import { routeTree } from "./routeTree.gen.ts";

const queryClient = new QueryClient();

export const router = createRouter({
	routeTree,
	defaultErrorComponent: ClientError,
	defaultNotFoundComponent: ClientError,
	context: {
		// biome-ignore lint/style/noNonNullAssertion: auth will be passed down from App component
		auth: undefined!,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const InnerApp = () => {
	const auth = useAuth();

	return <RouterProvider router={router} context={{ auth }} />;
};

// biome-ignore lint/style/noNonNullAssertion: Template
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<AuthProvider>
					<InnerApp />
				</AuthProvider>
			</ThemeProvider>
		</QueryClientProvider>
	</StrictMode>,
);
