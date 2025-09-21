import type z from "zod";
import {
	type insertMessageSchema,
	selectIntegrationSchema,
} from "./db/schema.zod";

export interface Employee {
	id: string;
	email: string;
	onboarded: number;
	first_name: string;
	last_name: string;
	avatar: string;
	company_id: number;
	role: string;
}

export interface Company {
	id: number;
	name: string;
	description: string;
	icon: string | null;
}

export interface Customer {
	id: number;
	name: string;
	avatar: string;
	platform: string;
	customer_id: string;
}
export type Message = z.infer<typeof insertMessageSchema>;
export type Integration = z.infer<typeof selectIntegrationSchema>;

export const PlatformSchema = selectIntegrationSchema.shape.platform;
export type Platform = z.infer<typeof PlatformSchema>;