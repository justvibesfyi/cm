import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
	insertIntegrationSchema,
	selectIntegrationSchema,
} from "../db/schema.zod";
import { applyLinkUpdate } from "../links";
import useIntegration from "../svc/integration";
import type { Integration, Platform } from "../types";
import requiresAuth from "./middleware/requiresAuth";

const integrationUpdateSchema = insertIntegrationSchema.omit({
	company_id: true,
	id: true,
});

// POST /api/manage/integrations/enable
export const manageRoutes = new Hono()
	.use("*", requiresAuth)

	.get(
		"/integration",
		zValidator("query", selectIntegrationSchema.pick({ platform: true })),
		async (c) => {
			const company_id = c.var.user.company_id;

			if (company_id === null)
				return c.json({ error: "You're not in a company" }, 400);

			const { platform } = c.req.valid("query");

			const integration: Integration = await useIntegration().getIntegration(
				platform as Platform,
				company_id,
			);

			return c.json({ integration });
		},
	)

	.get(
		"/enabled-integrations",
		async (c) => {
			const company_id = c.var.user.company_id;

			if (company_id === null)
				return c.json({ error: "You're not in a company" }, 400);

			const integrations = await useIntegration().getIntegrations(company_id);

			return c.json({ integrations: integrations.filter(x => x.enabled).map(x => x.platform as Platform) });
		},
	)

	.put(
		"/integration",
		zValidator("json", integrationUpdateSchema),
		async (c) => {
			const company_id = c.var.user.company_id;

			if (company_id === null)
				return c.json({ error: "You're not in a company" }, 400);

			let { platform, enabled, key_1, key_2, key_3, key_4, key_5, key_6 } =
				c.req.valid("json");

			if (platform === "telegram") {
				if (!key_1 && enabled) {
					enabled = false;
				}
			} else if (platform === "zalo") {
				if ((!key_1 || !key_2 || !key_3) && enabled) {
					enabled = false;
				}
			}

			console.log(platform, enabled, key_1, key_2, key_3);

			const intDb = useIntegration();
			const integration = await intDb.updateIntegration(
				platform as Platform,
				company_id,
				enabled,
				[
					key_1,
					key_2 || null,
					key_3 || null,
					key_4 || null,
					key_5 || null,
					key_6 || null,
				],
			);

			console.log(integration);

			if (!integration) {
				return c.json({ error: "Failed to update integration" }, 400);
			}

			await applyLinkUpdate(integration);

			return c.json({ integration });
		},
	);
