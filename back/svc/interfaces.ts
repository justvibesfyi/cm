// Service interface contracts
import type {
	Conversation,
	Message,
	OutboundMessage,
	StandardMessage,
	User,
} from "../types/index";

// Authentication Service Interface
export interface AuthService {
	registerUser(email: string): Promise<{ success: boolean; message: string }>;
	generateMagicLink(
		email: string,
	): Promise<{ success: boolean; token?: string }>;
	validateMagicLink(
		token: string,
	): Promise<{ success: boolean; user?: User; sessionToken?: string }>;
	validateSession(
		sessionToken: string,
	): Promise<{ valid: boolean; user?: User }>;
	createSession(user: User): Promise<string>;
	revokeSession(sessionToken: string): Promise<void>;
}

// Ingress Service Interface
export interface ProcessResult {
	success: boolean;
	messageId?: string;
	error?: string;
}

export interface IngressService {
	processMessage(message: StandardMessage): Promise<ProcessResult>;
	validateMessage(message: StandardMessage): boolean;
	storeMessage(message: StandardMessage): Promise<string>;
	notifyUsers(message: StandardMessage): Promise<void>;
	handleDuplicate(messageId: string): Promise<boolean>;
}

// Outflow Service Interface
export interface SendResult {
	success: boolean;
	messageId?: string;
	error?: string;
	retryAfter?: number;
}

export interface MessageContext {
	conversation: Conversation;
	recentMessages: Message[];
	customerInfo: {
		id: string;
		name?: string;
		avatar?: string;
	};
}

export interface OutflowService {
	sendMessage(outboundMessage: OutboundMessage): Promise<SendResult>;
	routeToLink(message: OutboundMessage): Promise<PlatformLink>;
	getMessageContext(conversationId: string): Promise<MessageContext>;
	queueMessage(message: OutboundMessage): Promise<void>;
	retryFailedMessage(messageId: string): Promise<SendResult>;
}

// WebSocket Service Interface
export interface WebSocketService {
	handleConnection(ws: WebSocket, request: Request): Promise<void>;
	authenticateConnection(
		ws: WebSocket,
		sessionToken: string,
	): Promise<User | null>;
	broadcastMessage(
		message: StandardMessage,
		userFilter?: (user: User) => boolean,
	): Promise<void>;
	sendToUser(userId: string, data: any): Promise<boolean>;
	cleanupConnection(ws: WebSocket): Promise<void>;
}

// Platform Link Interface
export interface ConnectionStatus {
	connected: boolean;
	error?: string;
	lastChecked: Date;
}

export interface PlatformLink {
	platformName: string;
	isActive: boolean;

	// Inbound message handling
	handleInboundMessage(rawMessage: any): Promise<StandardMessage>;
	enrichMessage(message: StandardMessage): Promise<StandardMessage>;

	// Outbound message handling
	handleOutboundMessage(message: OutboundMessage): Promise<SendResult>;
	transformToPlatformFormat(message: OutboundMessage): Promise<any>;

	// Platform management
	validateConfiguration(config: PlatformConfig): Promise<boolean>;
	testConnection(): Promise<ConnectionStatus>;

	// Lifecycle
	initialize(config: PlatformConfig): Promise<void>;
	shutdown(): Promise<void>;
}

// Email Service Types (using composable pattern)
export interface EmailTemplate {
	subject: string;
	htmlBody: string;
	textBody: string;
}

export interface EmailSendResult {
	success: boolean;
	messageId?: string;
	error?: string;
}

// Import platform config type
import type { PlatformConfig } from "../types/index.js";
