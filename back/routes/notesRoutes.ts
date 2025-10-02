import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import useEventBroadcaster from "../svc/eventBroadcaster";
import useNotes from "../svc/notes";
import requiresAuth from "./middleware/requiresAuth";

const createNoteSchema = z.object({
	customer_id: z.number().int().positive(),
	text: z.string().min(1).max(1000),
});

const updateNoteSchema = z.object({
	note_id: z.number().int().positive(),
	text: z.string().min(1).max(1000),
});

const deleteNoteSchema = z.object({
	note_id: z.number().int().positive(),
});

const customerNotesQuerySchema = z.object({
	customer_id: z.coerce.number().int().positive(),
});

const noteHistoryQuerySchema = z.object({
	note_id: z.coerce.number().int().positive(),
});

export const notesRoutes = new Hono()
	.use("*", requiresAuth)
	.post("/add", zValidator("json", createNoteSchema), async (c) => {
		const { customer_id, text } = c.req.valid("json");

		const { company_id } = c.var.user;

		if (!company_id) {
			return c.json({ error: "Employee not associated with a company" }, 400);
		}

		try {
			const notes = useNotes();
			const newNote = await notes.createNote(
				customer_id,
				company_id,
				text,
				c.var.user.id,
			);

			if (newNote) {
				const broadcaster = useEventBroadcaster();
				
				// Convert the note to CustomerNote format for broadcasting
				const noteForBroadcast = {
					id: newNote.id,
					customer_id: newNote.customer_id,
					content: newNote.text,
					created_by: c.var.user.id,
					created_at: new Date().toISOString(),
					employee_ids: c.var.user.id,
					last_updated_at: new Date().toISOString(),
				};
				broadcaster.broadcastNoteCreated(
					noteForBroadcast,
					company_id.toString(),
				);
			}

			return c.json({ success: true, note: newNote });
		} catch (error) {
			return c.json(
				{
					error:
						error instanceof Error ? error.message : "Failed to create note",
				},
				400,
			);
		}
	})
	.put("/note", zValidator("json", updateNoteSchema), async (c) => {
		const { note_id, text } = c.req.valid("json");

		const { company_id } = c.var.user;

		if (!company_id) {
			return c.json({ error: "Employee not associated with a company" }, 400);
		}

		try {
			const notes = useNotes();
			const updatedNote = await notes.updateNote(
				note_id,
				text,
				c.var.user.id,
				company_id,
			);

			if (updatedNote) {
				const broadcaster = useEventBroadcaster();
				
				// Get the updated note with employee information for broadcasting
				const noteWithUpdates = await notes.getCustomerNotes(
					updatedNote.customer_id,
					company_id,
				);
				const updatedNoteWithInfo = noteWithUpdates.find(
					(n) => n.id === updatedNote.id,
				);

				if (updatedNoteWithInfo) {
					const noteForBroadcast = {
						id: updatedNoteWithInfo.id,
						customer_id: updatedNoteWithInfo.customer_id,
						content: updatedNoteWithInfo.text,
						created_by: c.var.user.id,
						updated_by: c.var.user.id,
						created_at: new Date().toISOString(),
						updated_at: updatedNoteWithInfo.last_updated_at,
						employee_ids: updatedNoteWithInfo.employee_ids,
						last_updated_at: updatedNoteWithInfo.last_updated_at,
					};
					broadcaster.broadcastNoteUpdated(
						noteForBroadcast,
						company_id.toString(),
					);
				}
			}

			return c.json({ success: true, note: updatedNote });
		} catch (error) {
			return c.json(
				{
					error:
						error instanceof Error ? error.message : "Failed to update note",
				},
				400,
			);
		}
	})
	.delete("/note", zValidator("json", deleteNoteSchema), async (c) => {
		const { note_id } = c.req.valid("json");
		const { company_id } = c.var.user;

		if (!company_id) {
			return c.json({ error: "Employee not associated with a company" }, 400);
		}

		try {
			const notes = useNotes();
			const deletedNote = await notes.deleteNote(note_id, company_id);

			if (deletedNote) {
				const broadcaster = useEventBroadcaster();
				broadcaster.broadcastNoteDeleted(
					deletedNote.id.toString(),
					company_id.toString(),
				);
			}

			return c.json({ success: true });
		} catch (error) {
			return c.json(
				{
					error:
						error instanceof Error ? error.message : "Failed to delete note",
				},
				400,
			);
		}
	})
	.get(
		"/customer",
		zValidator("query", customerNotesQuerySchema),
		async (c) => {
			const { customer_id: customerId } = c.req.valid("query");

			const { company_id } = c.var.user;

			if (!company_id) {
				return c.json({ error: "Employee not associated with a company" }, 400);
			}

			try {
				const notes = useNotes();
				const customerNotes = await notes.getCustomerNotes(
					customerId,
					company_id,
				);

				return c.json({ success: true, notes: customerNotes });
			} catch (error) {
				return c.json(
					{
						error:
							error instanceof Error ? error.message : "Failed to get notes",
					},
					400,
				);
			}
		},
	);
