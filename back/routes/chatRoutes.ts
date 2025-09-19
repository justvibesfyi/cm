import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { sendMessageToLink } from "../links";
import useCustomer from "../svc/customer";
import useEmployee from "../svc/employee";
import useMessage from "../svc/message";
import requiresAuth from "./middleware/requiresAuth";

// Validation schemas
const sendMessageSchema = z.object({
	convoId: z.number(),
	content: z.string().min(1).max(4000),
	// messageType: z
	// 	.enum(["text", "image", "file", "sticker"])
	// 	.optional()
	// 	.default("text"),
	// replyToId: z.string().optional(),
});

const getConversationsSchema = z.object({
	status: z.enum(["open", "closed", "pending"]).optional(),
	platform: z.enum(["telegram", "zalo"]).optional(),
	limit: z.coerce.number().min(1).max(100).optional().default(20),
	offset: z.coerce.number().min(0).optional().default(0),
});

const getMessagesSchema = z.object({
	// convoId: z.string().min(1),
	// limit: z.coerce.number().min(1).max(100).optional().default(50),
	// offset: z.coerce.number().min(0).optional().default(0),
	// before: z.string().optional(),
});

const updateConversationSchema = z.object({
	status: z.enum(["open", "closed", "pending"]).optional(),
	assignedTo: z.string().optional(),
});

// Todo figure out how to chain middlewares and preserve both contexts
// const requiresCompany = createMiddleware<{
// 	Variables: {
// 		company_id: number
// 	};
// }>(async (c, next) => {
// 	const emp = useEmployee();
// 	const employee = await emp.getFullEmployee(c.var.);
// 	if (!employee.company_id) return c.json({ error: "Not in a company" }, 401);

// 	c.set("company", employee.company_id);
// 	return next();
// });

export const chatRoutes = new Hono()
	.use("*", requiresAuth)
	// Get conversations list
	.get("/convos", async (c) => {
		const emp = useEmployee();
		const employee = await emp.getFullEmployee(c.var.user.id);
		if (!employee.company_id) return c.json({ error: "Not in a company" }, 401);

		const customer = useCustomer();
		const convos = await customer.getCustomers(employee.company_id);

		return c.json({ success: true, convos });
	})

	.post("/send", zValidator("json", sendMessageSchema), async (c) => {
		console.log("Trying to send")
		const emp = useEmployee();
		const employee = await emp.getFullEmployee(c.var.user.id);
		if (!employee.company_id) return c.json({ error: "Not in a company" }, 401);

		console.log("Employee in a company")

		const { content, convoId } = c.req.valid("json");
		const message = useMessage();
		await message.saveEmployeeMessage(
			content,
			employee.company_id,
			employee.id,
			convoId,
		);

		console.log("Saved message")

		const customer = useCustomer();
		const sendTo = await customer.getById(convoId);

		console.log("Got customer", sendTo)

		const success = await sendMessageToLink(employee.company_id, sendTo.platform, sendTo.customer_id, content);

		console.log("Sent to link")

		return c.json({ success });
	})

	// Get messages for a conversation
	.get(
		"/convo/:id{\\d+}/messages",
		// zValidator("query", getMessagesSchema),
		async (c) => {
			const emp = useEmployee();
			const employee = await emp.getFullEmployee(c.var.user.id);
			if (!employee.company_id)
				return c.json({ error: "Not in a company" }, 401);

			const convoId = Number(c.req.param("id"));

			const msg = useMessage();
			const msgs = await msg.getMessages(convoId, employee.company_id);

			return c.json({ success: true, msgs });
		},
	);

// // Send a message
// .post("/messages", zValidator("json", sendMessageSchema), async (c) => {
// 	const { conversationId, content, messageType, replyToId } =
// 		c.req.valid("json");

// 	const outflow = useOutflow();
// 	const result = await outflow.sendMessage({
// 		conversationId,
// 		content,
// 		senderId: c.var.user.id,
// 		messageType,
// 		replyToId,
// 	});

// 	if (!result.success) {
// 		return c.json({ error: result.error || "Failed to send message" }, 400);
// 	}

// 	return c.json({ success: true, messageId: result.messageId });
// })

// // Get message by ID
// .get("/messages/:id", async (c) => {
// 	const messageId = c.req.param("id");

// 	const ingress = useIngress();
// 	const message = await ingress.getMessage(messageId);

// 	if (!message) {
// 		return c.json({ error: "Message not found" }, 404);
// 	}

// 	return c.json({ success: true, message });
// })

// // Mark conversation as read
// .post("/conversations/:id/read", async (c) => {
// 	const conversationId = c.req.param("id");

// 	const ingress = useIngress();
// 	const result = await ingress.markConversationAsRead(
// 		conversationId,
// 		c.var.user.id,
// 	);

// 	if (!result) {
// 		return c.json({ error: "Conversation not found" }, 404);
// 	}

// 	return c.json({ success: true });
// })

// // Get conversation statistics
// .get("/stats", async (c) => {
// 	const ingress = useIngress();
// 	const stats = await ingress.getConversationStats(c.var.user.id);

// 	return c.json({ success: true, stats });
// });
