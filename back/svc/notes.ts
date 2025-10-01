import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { customer, note, noteUpdate } from "../db/schema";

export default function useNotes() {
	return {
		async createNote(
			customerId: number,
			companyId: number,
			text: string,
			employeeId: string,
		) {
			// Verify customer belongs to company
			const customerExists = await db
				.select({ id: customer.id })
				.from(customer)
				.where(
					and(eq(customer.id, customerId), eq(customer.company_id, companyId)),
				)
				.limit(1);

			if (customerExists.length === 0) {
				throw new Error("Customer not found or doesn't belong to company");
			}

			const [newNote] = await db
				.insert(note)
				.values({
					customer_id: customerId,
					text,
				})
				.returning();

			if (!newNote) {
				throw new Error("Failed to create note");
			}

			// Record the creation
			await db.insert(noteUpdate).values({
				note_id: newNote.id,
				employee_id: employeeId,
				action: "created",
			});

			return newNote;
		},

		async updateNote(
			noteId: number,
			text: string,
			employeeId: string,
			companyId: number,
		) {
			// Verify note belongs to company through customer relationship
			const existingNote = await db
				.select({ id: note.id })
				.from(note)
				.innerJoin(customer, eq(note.customer_id, customer.id))
				.where(and(eq(note.id, noteId), eq(customer.company_id, companyId)))
				.limit(1);

			if (existingNote.length === 0) {
				throw new Error("Note not found or doesn't belong to company");
			}

			const [updatedNote] = await db
				.update(note)
				.set({
					text,
					updated_at: new Date().toISOString(),
				})
				.where(eq(note.id, noteId))
				.returning();

			// Record the update
			await db.insert(noteUpdate).values({
				note_id: noteId,
				employee_id: employeeId,
				action: "updated",
			});

			return updatedNote;
		},

		async deleteNote(noteId: number, companyId: number) {
			// Verify note belongs to company through customer relationship
			const existingNote = await db
				.select({ id: note.id })
				.from(note)
				.innerJoin(customer, eq(note.customer_id, customer.id))
				.where(and(eq(note.id, noteId), eq(customer.company_id, companyId)))
				.limit(1);

			if (existingNote.length === 0) {
				throw new Error("Note not found or doesn't belong to company");
			}

			await db.delete(note).where(eq(note.id, noteId));
			return { success: true };
		},

		async getCustomerNotes(customerId: number, companyId: number) {
			// Verify customer belongs to company
			const customerExists = await db
				.select({ id: customer.id })
				.from(customer)
				.where(
					and(eq(customer.id, customerId), eq(customer.company_id, companyId)),
				)
				.limit(1);

			if (customerExists.length === 0) {
				throw new Error("Customer not found or doesn't belong to company");
			}

			return await db
				.select()
				.from(note)
				.where(eq(note.customer_id, customerId))
				.orderBy(desc(note.updated_at));
		},

		async getNoteWithHistory(noteId: number, companyId: number) {
			// Verify note belongs to company through customer relationship
			const noteData = await db
				.select()
				.from(note)
				.innerJoin(customer, eq(note.customer_id, customer.id))
				.where(and(eq(note.id, noteId), eq(customer.company_id, companyId)))
				.limit(1);

			if (noteData.length === 0) {
				throw new Error("Note not found or doesn't belong to company");
			}

			const updates = await db
				.select({
					id: noteUpdate.id,
					employee_id: noteUpdate.employee_id,
					action: noteUpdate.action,
					created_at: noteUpdate.created_at,
				})
				.from(noteUpdate)
				.where(eq(noteUpdate.note_id, noteId))
				.orderBy(desc(noteUpdate.created_at));

			return {
				note: noteData[0]?.note,
				updates,
			};
		},
	};
}
