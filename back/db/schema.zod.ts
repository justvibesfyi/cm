import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { company, customer, employee, integration, invitation, message } from "./schema";

export const insertMessageSchema = createInsertSchema(message);

export const selectIntegrationSchema = createSelectSchema(integration);
export const insertIntegrationSchema = createInsertSchema(integration);

export const selectCompanySchema = createSelectSchema(company);

export const selectInvitationSchema = createSelectSchema(invitation);
export const insertInvitationSchema = createInsertSchema(invitation);

export const selectEmployeeSchema = createSelectSchema(employee);

export const selectCustomerSchema = createSelectSchema(customer);
export const updateCustomerSchema = createUpdateSchema(customer);