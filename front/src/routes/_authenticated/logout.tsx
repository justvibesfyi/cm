import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { api } from "@/lib/api";

const logOut = async () => {
	const res = await api.auth.logout.$get();

	if (res.status === 302) {
		window.location.href = "/login";
	}
};

const LogoutComponent = () => {
	useEffect(() => {
		logOut();

		const timeout = setTimeout(() => {
			window.location.href = "/login";
		}, 1000);

		return () => clearTimeout(timeout);
	});

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-3xl font-bold mb-4">Logout</h1>
			<p className="text-lg">You have been logged out.</p>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/logout")({
	component: LogoutComponent,
});
