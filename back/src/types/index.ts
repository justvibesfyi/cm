// Core data model interfaces
export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface Conversation {
  id: string;
  platform: 'telegram' | 'zalo';
  platformConversationId: string;
  customerId: string;
  customerName?: string;
  customerAvatar?: string;
  assignedTo?: string;
  status: 'open' | 'closed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  platformMessageId?: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'sticker';
  direction: 'inbound' | 'outbound';
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface StandardMessage {
  id: string;
  platform: string;
  conversationId: string;
  content: string;
  messageType: string;
  sender: {
    id: string;
    name?: string;
    avatar?: string;
  };
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface OutboundMessage {
  conversationId: string;
  content: string;
  senderId: string;
  replyToId?: string;
  messageType?: string;
}

export interface MagicLink {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface PlatformConfig {
  id: string;
  platform: string;
  config: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffMember {
  id: string;
  userId: string;
  name: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}