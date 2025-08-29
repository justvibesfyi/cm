import React from "react";

export interface UserContract {
	email?: string;
	onboarded?: boolean;
	firstName?: string;
	lastName?: string;
	avatar?: string;
}

/**
 * Application state interface
 */
export interface AppState {
	user?: UserContract;
	updateState: (newState: Partial<AppState>) => void;
}

/**
 * Default application state
 */
const defaultState: AppState = {
	user: {},
	updateState: (newState?: Partial<AppState>) => {},
};

/**
 * Creating the Application state context for the provider
 */
export const UserContext = React.createContext<AppState>(defaultState);
