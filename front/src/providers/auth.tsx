import type { Employee } from "@back/types";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import LoadingPage from "@/components/Loading";
import { api } from "@/lib/api";

export interface AuthState {
	isAuthenticated: boolean;
	user: Employee | null;
	startLogin: (email: string) => Promise<boolean>;
	verifyLogin: (email: string, code: string) => Promise<boolean>;
	refreshUser(): Promise<void> | void;
	logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<Employee | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Restore auth state on app load
	const refreshUser = useCallback(async () => {
		api.employee.me
			.$get()
			.then(async (response) => {
				if (!response.ok) throw new Error("Not authenticated");

				const me = await response.json();
				setUser(me);
				setIsAuthenticated(true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	// Show loading state while checking auth
	if (isLoading) {
		return <LoadingPage />;
	}

	const startLogin = async (email: string) => {
		const res = await api.auth["start-login"].$post({
			json: { email },
		});

		if (res.status === 422) {
			throw new Error("Wait 1 minute before trying again.");
		}

		const data = await res.json();

		return data.ok;
	};

	const verifyLogin = async (email: string, code: string) => {
		const res = await api.auth["verify-login"].$post({
			json: { email, code },
		});

		if (res.status === 403) {
			throw new Error("Code expired or invalid. Please try again.");
		}

		const user = await res.json();
		setUser(user);
		setIsAuthenticated(true);
		return true;
	};

	const logout = async () => {
		await api.auth.logout.$get();

		setUser(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				startLogin,
				verifyLogin,
				refreshUser,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
