import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { type AppState, UserContext } from "./user-context";

interface Props {
	children: React.ReactNode;
}

export const UserContextProvider: React.FunctionComponent<Props> = (
	props: Props,
) => {
	const nav = useNavigate();
	const [state, setState] = useState({});

	const updateState = (newState: Partial<AppState>) => {
		setState({ ...state, ...newState });
	};

	const fetchUser = async () => {
		const res = await api.employee.me.$get();

		if (!res.ok) {
			updateState({ user: undefined });
			await nav({ to: "/login" });
			return;
		}

		const user = await res.json();
		updateState({
			user: {
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				onboarded: user.onboarded,
				avatar: user.avatar,
			},
		});
	};

	useEffect(() => {});

	return (
		<UserContext.Provider value={{ ...state, updateState }}>
			{props.children}
		</UserContext.Provider>
	);
};
