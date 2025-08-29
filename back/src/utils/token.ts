import { randomBytes, timingSafeEqual } from 'crypto';
import { TOKEN_ERROR_CODES, type TokenErrorCode } from 'shared';

export interface TokenValidationResult {
  isValid: boolean;
  email?: string;
  errorCode?: TokenErrorCode;
}

export interface TokenData {
  token: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Token management utilities for secure registration token handling
 */
export class TokenManager {
  private static readonly TOKEN_LENGTH = 32; // 32 bytes = 256 bits
  private static readonly TOKEN_EXPIRY_HOURS = 24;

  /**
   * Generate a cryptographically secure token (works for both registration and login)
   * @returns URL-safe base64 encoded token string
   */
  static generateToken(): string {
    const tokenBytes = randomBytes(this.TOKEN_LENGTH);
    return tokenBytes.toString('base64url');
  }

  /**
   * Generate a cryptographically secure registration token
   * @returns URL-safe base64 encoded token string
   */
  static generateRegistrationToken(): string {
    return this.generateToken();
  }

  /**
   * Check if a token has expired based on creation timestamp
   * @param createdAt - Token creation timestamp
   * @returns true if token has expired
   */
  static isTokenExpired(createdAt: Date): boolean {
    const now = new Date();
    const expiryTime = new Date(createdAt.getTime() + (this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000));
    return now > expiryTime;
  }

  /**
   * Calculate expiration date for a token
   * @param createdAt - Token creation timestamp (defaults to now)
   * @returns Expiration date
   */
  static calculateExpiryDate(createdAt: Date = new Date()): Date {
    return new Date(createdAt.getTime() + (this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000));
  }

  /**
   * Perform constant-time comparison of two tokens for security
   * @param tokenA - First token to compare
   * @param tokenB - Second token to compare
   * @returns true if tokens match
   */
  static compareTokens(tokenA: string, tokenB: string): boolean {
    if (tokenA.length !== tokenB.length) {
      return false;
    }

    try {
      const bufferA = Buffer.from(tokenA, 'base64url');
      const bufferB = Buffer.from(tokenB, 'base64url');
      
      if (bufferA.length !== bufferB.length) {
        return false;
      }

      return timingSafeEqual(bufferA, bufferB);
    } catch (error) {
      // Invalid base64url encoding
      return false;
    }
  }

  /**
   * Validate a registration token against stored token data
   * @param providedToken - Token provided by user
   * @param storedTokenData - Token data from database
   * @returns Validation result with success status and error code
   */
  static validateToken(providedToken: string, storedTokenData: TokenData | null): TokenValidationResult {
    if (!providedToken) {
      return {
        isValid: false,
        errorCode: TOKEN_ERROR_CODES.REGISTRATION_TOKEN_REQUIRED
      };
    }

    if (!storedTokenData) {
      return {
        isValid: false,
        errorCode: TOKEN_ERROR_CODES.REGISTRATION_TOKEN_INVALID
      };
    }

    // Check if token has expired
    if (this.isTokenExpired(storedTokenData.createdAt)) {
      return {
        isValid: false,
        errorCode: TOKEN_ERROR_CODES.REGISTRATION_TOKEN_EXPIRED
      };
    }

    // Perform constant-time comparison
    if (!this.compareTokens(providedToken, storedTokenData.token)) {
      return {
        isValid: false,
        errorCode: TOKEN_ERROR_CODES.REGISTRATION_TOKEN_INVALID
      };
    }

    return {
      isValid: true,
      email: storedTokenData.email
    };
  }

  /**
   * Create token data object for database storage
   * @param email - Email address associated with token
   * @param token - Generated token (optional, will generate if not provided)
   * @returns Token data object ready for database insertion
   */
  static createTokenData(email: string, token?: string): TokenData {
    const createdAt = new Date();
    const generatedToken = token || this.generateRegistrationToken();
    
    return {
      token: generatedToken,
      email,
      createdAt,
      expiresAt: this.calculateExpiryDate(createdAt)
    };
  }
}