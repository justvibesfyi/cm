// Authentication-related types

// Token validation error codes for type-safe error handling and localization
export const TOKEN_ERROR_CODES = {
  REGISTRATION_TOKEN_REQUIRED: 'REGISTRATION_TOKEN_REQUIRED',
  REGISTRATION_TOKEN_INVALID: 'REGISTRATION_TOKEN_INVALID', 
  REGISTRATION_TOKEN_EXPIRED: 'REGISTRATION_TOKEN_EXPIRED',
} as const;

export type TokenErrorCode = typeof TOKEN_ERROR_CODES[keyof typeof TOKEN_ERROR_CODES];

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface MagicLinkRequest {
  email: string;
  redirectUrl?: string;
}

export interface LoginRequest {
  email: string;
}

export interface MagicLinkResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
  session?: AuthSession;
  error?: string;
}