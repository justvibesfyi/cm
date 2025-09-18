import { sql } from "bun";
import type { Conversation, Message, StandardMessage } from "../types/index";
import type { ProcessResult } from "./interfaces";

interface GetMessagesParams {
	conversationId: string;
	limit: number;
	offset: number;
	before?: string;
}

interface ConversationUpdate {
	status?: "open" | "closed" | "pending";
	assignedTo?: string;
}

interface ConversationStats {
	total: number;
	open: number;
	closed: number;
	pending: number;
	unread: number;
}

export default function useIngress() {
	return {
		async processMessage(message: StandardMessage): Promise<ProcessResult> {
			// TODO: Implement message processing
			throw new Error("Not implemented");
		},

		validateMessage(message: StandardMessage): boolean {
			// TODO: Implement message validation
			throw new Error("Not implemented");
		},

		async storeMessage(message: StandardMessage): Promise<string> {
			// TODO: Implement message storage
			throw new Error("Not implemented");
		},

		async notifyUsers(message: StandardMessage): Promise<void> {
			// TODO: Implement user notification
			throw new Error("Not implemented");
		},

		async handleDuplicate(messageId: string): Promise<boolean> {
			// TODO: Implement duplicate handling
			throw new Error("Not implemented");
		},

		async getConversations(company_id: number): Promise<Conversation[]> {
			const res = sql`
			    SELECT * FROM conversations WHERE company_id = ${company_id}
			`.then(res => res[0]);

			return res ?? [];
		},

		async getConversation(
			conversationId: string,
		): Promise<Conversation | null> {
			// TODO: Implement single conversation retrieval
			throw new Error("Not implemented");
		},

		async updateConversation(
			conversationId: string,
			updates: ConversationUpdate,
		): Promise<Conversation | null> {
			// TODO: Implement conversation update
			throw new Error("Not implemented");
		},

		async getMessages(params: GetMessagesParams): Promise<Message[]> {
			// TODO: Implement message retrieval
			throw new Error("Not implemented");
		},

		async getMessage(messageId: string): Promise<Message | null> {
			// TODO: Implement single message retrieval
			throw new Error("Not implemented");
		},

		async markConversationAsRead(
			conversationId: string,
			userId: string,
		): Promise<boolean> {
			// TODO: Implement mark as read
			throw new Error("Not implemented");
		},

		async getConversationStats(userId: string): Promise<ConversationStats> {
			// TODO: Implement stats retrieval
			throw new Error("Not implemented");
		},
	};
}
