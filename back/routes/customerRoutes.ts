import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import useCustomer from "../svc/customer";
import useEventBroadcaster from "../svc/eventBroadcaster";
import requiresAuth from "./middleware/requiresAuth";

const updatePropertySchema = z.object({
	customer_id: z.number(),
	property: z.enum(["country", "city", "device", "ip"]),
	value: z.string().nullable(),
});

export const customerRoutes = new Hono()
	.use("*", requiresAuth)
	.post(
		"/update-property",
		zValidator("json", updatePropertySchema),
		async (c) => {
			const { customer_id, property, value } = c.req.valid("json");
			const { company_id } = c.var.user;

			if (!company_id) {
				return c.json({ error: "You're not in a company" }, 401);
			}

			const customerService = useCustomer();
			const updatedCustomer = await customerService.updateProperty(customer_id, company_id, property, value);

			if (updatedCustomer) {
				const broadcaster = useEventBroadcaster();
				broadcaster.broadcastCustomerUpdated(updatedCustomer);
			}

			return c.json({ success: true });
		},
	)
	.post(
		"/assign-employee",
		zValidator(
			"json",
			z.object({
				customer_id: z.number(),
				employee_id: z.string().nullable(),
			}),
		),
		async (c) => {
			const { customer_id, employee_id } = c.req.valid("json");
			const { company_id } = c.var.user;

			if (!company_id) {
				return c.json({ error: "You're not in a company" }, 401);
			}

			const customerService = useCustomer();
			const updatedCustomer = await customerService.assignEmployee(customer_id, company_id, employee_id);

			if (!updatedCustomer) {
				if (employee_id) {
					return c.json(
						{
							error:
								"Customer or employee not found, or they don't belong to your company",
						},
						404,
					);
				} else {
					return c.json(
						{ error: "Customer not found or doesn't belong to your company" },
						404,
					);
				}
			}

			const broadcaster = useEventBroadcaster();
			broadcaster.broadcastCustomerUpdated(updatedCustomer);

			return c.json({ success: true });
		},
	);
