// API request and response types
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
  };
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Authentication API types
export interface RegisterRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
}

export interface MagicLinkValidation {
  token: string;
}

// Chat API types
export interface ConversationsResponse {
  conversations: Conversation[];
  pagination: PaginationInfo;
}

export interface MessagesResponse {
  messages: Message[];
  pagination: PaginationInfo;
}

export interface SendMessageRequest {
  content: string;
  replyToId?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Import types from main types file
import type { Conversation, Message } from './index.js';