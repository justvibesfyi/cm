// Platform-specific configuration interfaces
import type { PlatformConfig } from '../types/index';

// Telegram configuration
export interface TelegramConfig extends PlatformConfig {
  config: {
    botToken: string;
    webhookUrl?: string;
    pollingInterval?: number;
    allowedUpdates: string[];
  };
}

// Zalo configuration
export interface ZaloConfig extends PlatformConfig {
  config: {
    appId: string;
    appSecret: string;
    accessToken: string;
    webhookUrl?: string;
  };
}

// Base platform link configuration
export interface BasePlatformConfig {
  platform: string;
  isActive: boolean;
  retryAttempts?: number;
  timeoutMs?: number;
  rateLimitPerMinute?: number;
}