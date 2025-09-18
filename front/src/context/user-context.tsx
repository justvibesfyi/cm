import type { Employee } from "@back/types";
import React from "react";

/**
 * Application state interface
 */
export interface AppState {
	user?: Employee;
	updateState: (newState: Partial<AppState>) => void;
}

/**
 * Default application state
 */
const defaultState: AppState = {
	user: undefined,
	updateState: (newState?: Partial<AppState>) => {},
};

/**
 * Creating the Application state context for the provider
 */
export const UserContext = React.createContext<AppState>(defaultState);
