import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { company, integration, message } from "./schema";

export const insertMessageSchema = createInsertSchema(message);

export const selectIntegrationSchema = createSelectSchema(integration);
export const insertIntegrationSchema = createInsertSchema(integration);

export const selectCompanySchema = createSelectSchema(company);