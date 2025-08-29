// Admin-related types

export type StaffRole = 'support' | 'manager';

export type ConnectionStatus = 'connected' | 'disconnected' | 'error';

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
}

export interface PlatformConfig {
  platform: 'telegram' | 'zalo';
  apiKey: string;
  isActive: boolean;
  lastSync: Date;
  connectionStatus: ConnectionStatus;
}

export interface CreateStaffRequest {
  email: string;
  name: string;
  role: StaffRole;
  permissions: string[];
}

export interface UpdateStaffRequest {
  id: string;
  name?: string;
  role?: StaffRole;
  isActive?: boolean;
  permissions?: string[];
}

export interface PlatformConfigRequest {
  platform: 'telegram' | 'zalo';
  apiKey: string;
  isActive: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  maxStaff: number;
  maxPlatforms: number;
}

export interface Subscription {
  id: string;
  planId: string;
  userId: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface UsageMetrics {
  messagesThisMonth: number;
  activeConversations: number;
  staffMembers: number;
  connectedPlatforms: number;
}