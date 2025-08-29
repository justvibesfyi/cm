// Database repository interfaces
import type { 
  User, 
  Conversation, 
  Message, 
  MagicLink, 
  Session, 
  PlatformConfig, 
  StaffMember 
} from '../types/index.js';

// Base repository interface
export interface BaseRepository<T> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// User repository interface
export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findActiveUsers(): Promise<User[]>;
  updateLastLogin(id: string): Promise<void>;
}

// Conversation repository interface
export interface ConversationRepository extends BaseRepository<Conversation> {
  findByPlatformId(platform: string, platformConversationId: string): Promise<Conversation | null>;
  findByAssignedUser(userId: string): Promise<Conversation[]>;
  findByStatus(status: string): Promise<Conversation[]>;
  updateLastMessage(id: string): Promise<void>;
}

// Message repository interface
export interface MessageRepository extends BaseRepository<Message> {
  findByConversationId(conversationId: string, limit?: number, offset?: number): Promise<Message[]>;
  findByPlatformMessageId(platformMessageId: string): Promise<Message | null>;
  markAsDelivered(id: string): Promise<void>;
  markAsRead(id: string): Promise<void>;
  markAsFailed(id: string, error?: string): Promise<void>;
}

// Magic link repository interface
export interface MagicLinkRepository extends BaseRepository<MagicLink> {
  findByToken(token: string): Promise<MagicLink | null>;
  findActiveByUserId(userId: string): Promise<MagicLink[]>;
  markAsUsed(id: string): Promise<void>;
  cleanupExpired(): Promise<number>;
}

// Session repository interface
export interface SessionRepository extends BaseRepository<Session> {
  findByToken(token: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session[]>;
  updateLastAccessed(id: string): Promise<void>;
  cleanupExpired(): Promise<number>;
}

// Platform config repository interface
export interface PlatformConfigRepository extends BaseRepository<PlatformConfig> {
  findByPlatform(platform: string): Promise<PlatformConfig | null>;
  findActive(): Promise<PlatformConfig[]>;
}

// Staff member repository interface
export interface StaffMemberRepository extends BaseRepository<StaffMember> {
  findByUserId(userId: string): Promise<StaffMember | null>;
  findActive(): Promise<StaffMember[]>;
}