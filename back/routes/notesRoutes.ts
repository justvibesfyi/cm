import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import useNotes from "../svc/notes";
import requiresAuth from "./middleware/requiresAuth";

const createNoteSchema = z.object({
    customer_id: z.number().int().positive(),
    text: z.string().min(1).max(1000),
});

const updateNoteSchema = z.object({
    text: z.string().min(1).max(1000),
});

export const notesRoutes = new Hono()
    .use("*", requiresAuth)
    .post("/", zValidator("json", createNoteSchema), async (c) => {
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
    .put("/:id", zValidator("json", updateNoteSchema), async (c) => {
        const noteId = parseInt(c.req.param("id"), 10);
        const { text } = c.req.valid("json");

        if (Number.isNaN(noteId)) {
            return c.json({ error: "Invalid note ID" }, 400);
        }

        const { company_id } = c.var.user;

        if (!company_id) {
            return c.json({ error: "Employee not associated with a company" }, 400);
        }

        try {
            const notes = useNotes();
            const updatedNote = await notes.updateNote(
                noteId,
                text,
                c.var.user.id,
                company_id,
            );

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
    .delete("/:id", async (c) => {
        const noteId = parseInt(c.req.param("id"), 10);

        if (Number.isNaN(noteId)) {
            return c.json({ error: "Invalid note ID" }, 400);
        }

        const { company_id } = c.var.user;

        if (!company_id) {
            return c.json({ error: "Employee not associated with a company" }, 400);
        }

        try {
            const notes = useNotes();
            await notes.deleteNote(noteId, company_id);

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
    .get("/customer/:customerId", async (c) => {
        const customerId = parseInt(c.req.param("customerId"), 10);

        if (Number.isNaN(customerId)) {
            return c.json({ error: "Invalid customer ID" }, 400);
        }

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
                    error: error instanceof Error ? error.message : "Failed to get notes",
                },
                400,
            );
        }
    })
    .get("/:id/history", async (c) => {
        const noteId = parseInt(c.req.param("id"), 10);

        if (Number.isNaN(noteId)) {
            return c.json({ error: "Invalid note ID" }, 400);
        }

        const { company_id } = c.var.user;

        if (!company_id) {
            return c.json({ error: "Employee not associated with a company" }, 400);
        }

        try {
            const notes = useNotes();
            const noteWithHistory = await notes.getNoteWithHistory(
                noteId,
                company_id,
            );

            return c.json({ success: true, ...noteWithHistory });
        } catch (error) {
            return c.json(
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : "Failed to get note history",
                },
                400,
            );
        }
    });
