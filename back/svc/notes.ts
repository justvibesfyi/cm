import { and, desc, eq, sql } from "drizzle-orm";
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

			// Record the creation - upsert to handle if employee already has an update record
			await db
				.insert(noteUpdate)
				.values({
					note_id: newNote.id,
					employee_id: employeeId,
				})
				.onConflictDoUpdate({
					target: [noteUpdate.note_id, noteUpdate.employee_id],
					set: {
						updated_at: sql`CURRENT_TIMESTAMP`,
					},
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
				})
				.where(eq(note.id, noteId))
				.returning();

			// Record the update - upsert to update timestamp if employee already has a record
			await db
				.insert(noteUpdate)
				.values({
					note_id: noteId,
					employee_id: employeeId,
				})
				.onConflictDoUpdate({
					target: [noteUpdate.note_id, noteUpdate.employee_id],
					set: {
						updated_at: sql`CURRENT_TIMESTAMP`,
					},
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

			const [deletedNote] = await db
				.delete(note)
				.where(eq(note.id, noteId))
				.returning();

			return deletedNote;
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

			// Get notes with their update information
			const notesWithUpdates = await db
				.select({
					id: note.id,
					customer_id: note.customer_id,
					text: note.text,
					employee_ids: sql<string>`json_group_array(DISTINCT ${noteUpdate.employee_id})`.as(
						"employee_ids",
					),
					last_updated_at: sql<string>`MAX(${noteUpdate.updated_at})`.as(
						"last_updated_at",
					),
				})
				.from(note)
				.leftJoin(noteUpdate, eq(note.id, noteUpdate.note_id))
				.where(eq(note.customer_id, customerId))
				.groupBy(note.id)
				.orderBy(desc(sql`MAX(${noteUpdate.updated_at})`));

			return notesWithUpdates.map(note => ({
				...note,
				employee_ids: note.employee_ids
					? JSON.parse(note.employee_ids)
					: [],
			}));
		},
	};
}
