import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { UserContextProvider } from "./context/user-provider.tsx";
import { routeTree } from "./routeTree.gen.ts";

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

// biome-ignore lint/style/noNonNullAssertion: Template
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<UserContextProvider>
				<RouterProvider router={router} />
			</UserContextProvider>
		</QueryClientProvider>
	</StrictMode>,
);
