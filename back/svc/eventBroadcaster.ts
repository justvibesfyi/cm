import type {
	Customer,
	CustomerNote,
	Employee,
	Message,
	SSEEvent,
} from "../types";
import useSSE from "./sse";

function useEventBroadcaster() {
	const sse = useSSE();

	const broadcastCustomerCreated = (customer: Customer): void => {
		const event: SSEEvent = {
			type: "customer_created",
			data: customer,
			timestamp: new Date().toISOString(),
			company_id: customer.company_id.toString(),
		};
		sse.broadcastToCompany(customer.company_id.toString(), event);
	};

	const broadcastCustomerUpdated = (customer: Customer): void => {
		const event: SSEEvent = {
			type: "customer_updated",
			data: customer,
			timestamp: new Date().toISOString(),
			company_id: customer.company_id.toString(),
		};
		sse.broadcastToCompany(customer.company_id.toString(), event);
	};

	const broadcastCustomerDeleted = (
		customerId: string,
		companyId: string,
	): void => {
		const event: SSEEvent = {
			type: "customer_deleted",
			data: { id: customerId },
			timestamp: new Date().toISOString(),
			company_id: companyId,
		};
		sse.broadcastToCompany(companyId, event);
	};

	const broadcastEmployeeCreated = (employee: Employee): void => {
		if (!employee.company_id) return; // Employee not assigned to company yet

		const event: SSEEvent = {
			type: "employee_created",
			data: employee,
			timestamp: new Date().toISOString(),
			company_id: employee.company_id.toString(),
		};
		sse.broadcastToCompany(employee.company_id.toString(), event);
	};

	const broadcastEmployeeUpdated = (employee: Employee): void => {
		if (!employee.company_id) return; // Employee not assigned to company yet

		const event: SSEEvent = {
			type: "employee_updated",
			data: employee,
			timestamp: new Date().toISOString(),
			company_id: employee.company_id.toString(),
		};
		sse.broadcastToCompany(employee.company_id.toString(), event);
	};

	const broadcastEmployeeDeleted = (
		employeeId: string,
		companyId: string,
	): void => {
		const event: SSEEvent = {
			type: "employee_deleted",
			data: { id: employeeId },
			timestamp: new Date().toISOString(),
			company_id: companyId,
		};
		sse.broadcastToCompany(companyId, event);
	};

	const broadcastNoteCreated = (
		note: CustomerNote,
		companyId: string,
	): void => {
		const event: SSEEvent = {
			type: "note_created",
			data: note,
			timestamp: new Date().toISOString(),
			company_id: companyId,
		};
		sse.broadcastToCompany(companyId, event);
	};

	const broadcastNoteUpdated = (
		note: CustomerNote,
		companyId: string,
	): void => {
		const event: SSEEvent = {
			type: "note_updated",
			data: note,
			timestamp: new Date().toISOString(),
			company_id: companyId,
		};
		sse.broadcastToCompany(companyId, event);
	};

	const broadcastNoteDeleted = (noteId: string, companyId: string): void => {
		const event: SSEEvent = {
			type: "note_deleted",
			data: { id: noteId },
			timestamp: new Date().toISOString(),
			company_id: companyId,
		};
		sse.broadcastToCompany(companyId, event);
	};

	const broadcastMessageReceived = (message: Message): void => {
		const event: SSEEvent = {
			type: "message_received",
			data: message,
			timestamp: new Date().toISOString(),
			company_id: message.company_id.toString(),
		};
		sse.broadcastToCompany(message.company_id.toString(), event);
	};

	return {
		broadcastCustomerCreated,
		broadcastCustomerUpdated,
		broadcastCustomerDeleted,
		broadcastEmployeeCreated,
		broadcastEmployeeUpdated,
		broadcastEmployeeDeleted,
		broadcastNoteCreated,
		broadcastNoteUpdated,
		broadcastNoteDeleted,
		broadcastMessageReceived,
	};
}

export default useEventBroadcaster;
