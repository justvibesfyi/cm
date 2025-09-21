import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { integration, message } from "./schema";

export const insertMessageSchema = createInsertSchema(message);

export const selectIntegrationSchema = createSelectSchema(integration);
export const insertIntegrationSchema = createInsertSchema(integration);