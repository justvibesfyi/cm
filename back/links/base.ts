// Base platform link implementation
import type {
	ConnectionStatus,
	PlatformLink,
	SendResult,
} from "../svc/interfaces";
import type {
	OutboundMessage,
	PlatformConfig,
	StandardMessage,
} from "../types/index";

export abstract class BasePlatformLink implements PlatformLink {
	public abstract readonly platformName: string;
	public isActive: boolean = false;

	// Abstract methods that must be implemented by platform-specific links
	abstract handleInboundMessage(rawMessage: any): Promise<StandardMessage>;
	abstract enrichMessage(message: StandardMessage): Promise<StandardMessage>;
	abstract handleOutboundMessage(message: OutboundMessage): Promise<SendResult>;
	abstract transformToPlatformFormat(message: OutboundMessage): Promise<any>;
	abstract validateConfiguration(config: PlatformConfig): Promise<boolean>;
	abstract testConnection(): Promise<ConnectionStatus>;
	abstract initialize(config: PlatformConfig): Promise<void>;
	abstract shutdown(): Promise<void>;

	// Common utility methods
	protected generateMessageId(): string {
		return `${this.platformName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	protected validateStandardMessage(message: StandardMessage): boolean {
		return !!(
			message.id &&
			message.platform &&
			message.conversationId &&
			message.content &&
			message.sender?.id
		);
	}

	protected createErrorResult(error: string): SendResult {
		return {
			success: false,
			error,
		};
	}

	protected createSuccessResult(messageId: string): SendResult {
		return {
			success: true,
			messageId,
		};
	}
}
