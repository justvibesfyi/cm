import type z from "zod";
import {
	type insertMessageSchema,
	type selectCompanySchema,
	selectCustomerSchema,
	type selectEmployeeSchema,
	selectIntegrationSchema,
	type selectInvitationSchema,
} from "./db/schema.zod";

export type Company = z.infer<typeof selectCompanySchema>;

export interface CustomerNote {
	id: number;
	customer_id: number;
	content: string;
	created_by: string;
	updated_by?: string;
	created_at: string;
	updated_at?: string;
	employee: {
		id: string;
		first_name?: string;
		last_name?: string;
		avatar?: string;
		email: string;
	};
}
export type Message = z.infer<typeof insertMessageSchema>;
export type Integration = z.infer<typeof selectIntegrationSchema>;
export type Invitation = z.infer<typeof selectInvitationSchema>;

export const PlatformSchema = selectIntegrationSchema.shape.platform;
export type Platform = z.infer<typeof PlatformSchema>;
export type PlatformConst = Platform[keyof Platform];

export type Employee = z.infer<typeof selectEmployeeSchema>;

export const CustomerStatusSchema = selectCustomerSchema.shape.status;
export type CustomerStatus = z.infer<typeof CustomerStatusSchema>;
export type Customer = z.infer<typeof selectCustomerSchema>;