import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/db";
import { customer, employee } from "../db/schema";
import type { CustomerProperty, CustomerStatus, UpdateCustomer } from "../types";

const useCustomer = () => {
    return {
        getById: async (id: number) => {
            const [result] = await db
                .select()
                .from(customer)
                .where(eq(customer.id, id));

            return result;
        },
        getCustomers: async (company_id: number) => {
            const customers = await db
                .select()
                .from(customer)
                .where(eq(customer.company_id, company_id));

            return customers;
        },

        ensureCustomer: async (
            platform: string,

            platform_id: string,
            username: string,
            full_name: string,
            company_id: number,

            avatar: string | null,
            phone: string | null,
            country: string | null,
            city: string | null,
            device: string | null,
            ip: string | null,
            status: CustomerStatus = 'unknown',
        ) => {
            // Build update object, only including non-null values for nullable fields
            const updateSet: UpdateCustomer = {
                username,
                full_name,
                status
            };

            // Only update nullable fields if they have actual values
            if (avatar !== null) updateSet.avatar = avatar;
            if (phone !== null) updateSet.phone = phone;
            if (country !== null) updateSet.country = country;
            if (city !== null) updateSet.city = city;
            if (device !== null) updateSet.device = device;
            if (ip !== null) updateSet.ip = ip;

            const result = await db
                .insert(customer)
                .values({
                    platform,
                    platform_id,
                    username,
                    full_name,
                    avatar,
                    company_id,
                    phone,
                    country,
                    city,
                    device,
                    ip,
                    lastActivity: sql`CURRENT_TIMESTAMP`,
                    status
                })
                .onConflictDoUpdate({
                    target: [customer.platform, customer.platform_id, customer.company_id],
                    set: updateSet
                })
                .returning({ id: customer.id });

            console.log("Ensure customer:", result[0]?.id);

            return result[0]?.id as number;
        },

        updateProperty: async (
            customer_id: number,
            company_id: number,
            property: CustomerProperty,
            value: string | null
        ) => {
            const updateData: Partial<Record<CustomerProperty, string | null>> = {
                [property]: value,
            };

            const [updatedCustomer] = await db
                .update(customer)
                .set(updateData)
                .where(
                    and(
                        eq(customer.id, customer_id),
                        eq(customer.company_id, company_id),
                    ),
                )
                .returning();

            return updatedCustomer;
        },

        assignEmployee: async (
            customer_id: number,
            company_id: number,
            employee_id: string | null
        ) => {
            const updateConditions = and(
                eq(customer.id, customer_id),
                eq(customer.company_id, company_id),
            );

            if (employee_id) {
                // Assign to employee with validation
                const result = await db
                    .update(customer)
                    .set({ assigned_to: employee_id })
                    .where(
                        and(
                            eq(customer.id, customer_id),
                            eq(customer.company_id, company_id),
                            // Subquery to ensure employee exists and belongs to the same company
                            inArray(
                                sql`${employee_id}`,
                                db
                                    .select({ id: employee.id })
                                    .from(employee)
                                    .where(eq(employee.company_id, company_id)),
                            ),
                        ),
                    )
                    .returning();

                return result[0] || null;
            } else {
                // Unassign employee (setting to null)
                const result = await db
                    .update(customer)
                    .set({ assigned_to: null })
                    .where(updateConditions)
                    .returning();

                return result[0] || null;
            }
        }
    }
};

export default useCustomer;