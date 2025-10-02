import type z from "zod";
import {
	type insertMessageSchema,
	type selectCompanySchema,
	selectCustomerSchema,
	type selectEmployeeSchema,
	selectIntegrationSchema,
	type selectInvitationSchema,
	type updateCustomerSchema,
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
	employee_ids?: string; // Comma-separated list of employee IDs who touched the note
	last_updated_at?: string; // Last time any employee updated the note
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
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;

export type CustomerProperty = "country" | "city" | "device" | "ip";

// SSE Event Types - Discriminated union for type-safe SSE events
export type SSEEvent = 
  | { type: 'customer_created'; data: Customer; timestamp: string; company_id: string; }
  | { type: 'customer_updated'; data: Customer; timestamp: string; company_id: string; }
  | { type: 'customer_deleted'; data: { id: string }; timestamp: string; company_id: string; }
  | { type: 'employee_created'; data: Employee; timestamp: string; company_id: string; }
  | { type: 'employee_updated'; data: Employee; timestamp: string; company_id: string; }
  | { type: 'employee_deleted'; data: { id: string }; timestamp: string; company_id: string; }
  | { type: 'note_created'; data: CustomerNote; timestamp: string; company_id: string; }
  | { type: 'note_updated'; data: CustomerNote; timestamp: string; company_id: string; }
  | { type: 'note_deleted'; data: { id: string }; timestamp: string; company_id: string; }
  | { type: 'message_received'; data: Message; timestamp: string; company_id: string; };

// Transport Abstraction Interface
export interface RealtimeTransport {
  connect(): void;
  disconnect(): void;
  onEvent(callback: (event: SSEEvent) => void): void;
  reconnect(): void;
}
