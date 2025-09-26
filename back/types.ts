import type z from "zod";
import {
	type insertMessageSchema,
	type selectCompanySchema,
	type selectEmployeeSchema,
	selectIntegrationSchema,
	type selectInvitationSchema,
} from "./db/schema.zod";

export type Company = z.infer<typeof selectCompanySchema>;

export interface Customer {
	id: number;
	name: string;
	avatar: string;
	platform: string;
	customer_id: string;
}
export type Message = z.infer<typeof insertMessageSchema>;
export type Integration = z.infer<typeof selectIntegrationSchema>;
export type Invitation = z.infer<typeof selectInvitationSchema>;

export const PlatformSchema = selectIntegrationSchema.shape.platform;
export type Platform = z.infer<typeof PlatformSchema>;
export type PlatformConst = Platform[keyof Platform];

export type Employee = z.infer<typeof selectEmployeeSchema>;
