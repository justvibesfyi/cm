// Chat-related types

export type Platform = 'telegram' | 'zalo';

export type MessageDirection = 'inbound' | 'outbound';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export type ConversationStatus = 'open' | 'closed' | 'pending';

export interface MessageSender {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  platform: Platform;
  content: string;
  timestamp: Date;
  sender: MessageSender;
  direction: MessageDirection;
  status: MessageStatus;
}

export interface Customer {
  id: string;
  name: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  platform: Platform;
  customer: Customer;
  lastMessage: Message;
  unreadCount: number;
  assignedTo?: string;
  status: ConversationStatus;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  platform: Platform;
}

export interface SendMessageResponse {
  success: boolean;
  message?: Message;
  error?: string;
}