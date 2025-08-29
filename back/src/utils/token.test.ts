import { describe, it, expect, beforeEach } from 'bun:test';
import { TokenManager, type TokenData } from './token.js';
import { TOKEN_ERROR_CODES } from 'shared';

describe('TokenManager', () => {
    describe('generateRegistrationToken', () => {
        it('should generate a token', () => {
            const token = TokenManager.generateRegistrationToken();
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
        });

        it('should generate unique tokens', () => {
            const token1 = TokenManager.generateRegistrationToken();
            const token2 = TokenManager.generateRegistrationToken();
            expect(token1).not.toBe(token2);
        });

        it('should generate URL-safe base64 tokens', () => {
            const token = TokenManager.generateRegistrationToken();
            // Should only contain valid base64url characters: A-Z, a-z, 0-9, -, _
            expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
        });

        it('should generate tokens of consistent length', () => {
            const tokens = Array.from({ length: 10 }, () => TokenManager.generateRegistrationToken());
            const lengths = tokens.map(token => Buffer.from(token, 'base64url').length);
            const uniqueLengths = new Set(lengths);
            expect(uniqueLengths.size).toBe(1); // All tokens should have same byte length
        });
    });

    describe('isTokenExpired', () => {
        it('should return false for recently created token', () => {
            const createdAt = new Date();
            const isExpired = TokenManager.isTokenExpired(createdAt);
            expect(isExpired).toBe(false);
        });

        it('should return true for token created 25 hours ago', () => {
            const createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
            const isExpired = TokenManager.isTokenExpired(createdAt);
            expect(isExpired).toBe(true);
        });

        it('should return false for token created 23 hours ago', () => {
            const createdAt = new Date(Date.now() - 23 * 60 * 60 * 1000); // 23 hours ago
            const isExpired = TokenManager.isTokenExpired(createdAt);
            expect(isExpired).toBe(false);
        });
    });

    describe('calculateExpiryDate', () => {
        it('should calculate expiry date 24 hours from creation', () => {
            const createdAt = new Date('2024-01-01T12:00:00Z');
            const expiryDate = TokenManager.calculateExpiryDate(createdAt);
            const expectedExpiry = new Date('2024-01-02T12:00:00Z');
            expect(expiryDate.getTime()).toBe(expectedExpiry.getTime());
        });

        it('should use current time if no creation date provided', () => {
            const before = Date.now();
            const expiryDate = TokenManager.calculateExpiryDate();
            const after = Date.now();

            const expectedMinExpiry = before + (24 * 60 * 60 * 1000);
            const expectedMaxExpiry = after + (24 * 60 * 60 * 1000);

            expect(expiryDate.getTime()).toBeGreaterThanOrEqual(expectedMinExpiry);
            expect(expiryDate.getTime()).toBeLessThanOrEqual(expectedMaxExpiry);
        });
    });

    describe('compareTokens', () => {
        it('should return true for identical tokens', () => {
            const token = TokenManager.generateRegistrationToken();
            const result = TokenManager.compareTokens(token, token);
            expect(result).toBe(true);
        });

        it('should return false for different tokens', () => {
            const token1 = TokenManager.generateRegistrationToken();
            const token2 = TokenManager.generateRegistrationToken();
            const result = TokenManager.compareTokens(token1, token2);
            expect(result).toBe(false);
        });

        it('should return false for tokens of different lengths', () => {
            const token1 = 'short';
            const token2 = 'muchlongertoken';
            const result = TokenManager.compareTokens(token1, token2);
            expect(result).toBe(false);
        });

        it('should return false for invalid base64url tokens', () => {
            const validToken = TokenManager.generateRegistrationToken();
            const invalidToken = 'invalid+token/with=padding';
            const result = TokenManager.compareTokens(validToken, invalidToken);
            expect(result).toBe(false);
        });

        it('should handle empty strings safely', () => {
            const result = TokenManager.compareTokens('', '');
            expect(result).toBe(true);
        });
    });

    describe('validateToken', () => {
        let validTokenData: TokenData;
        let validToken: string;

        beforeEach(() => {
            validToken = TokenManager.generateRegistrationToken();
            validTokenData = {
                token: validToken,
                email: 'test@example.com',
                createdAt: new Date(),
                expiresAt: TokenManager.calculateExpiryDate()
            };
        });

        it('should return error for missing token', () => {
            const result = TokenManager.validateToken('', validTokenData);
            expect(result.isValid).toBe(false);
            expect(result.errorCode).toBe(TOKEN_ERROR_CODES.REGISTRATION_TOKEN_REQUIRED);
        });

        it('should return error for null token data', () => {
            const result = TokenManager.validateToken(validToken, null);
            expect(result.isValid).toBe(false);
            expect(result.errorCode).toBe(TOKEN_ERROR_CODES.REGISTRATION_TOKEN_INVALID);
        });

        it('should return error for expired token', () => {
            const expiredTokenData: TokenData = {
                ...validTokenData,
                createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000) // 25 hours ago
            };
            const result = TokenManager.validateToken(validToken, expiredTokenData);
            expect(result.isValid).toBe(false);
            expect(result.errorCode).toBe(TOKEN_ERROR_CODES.REGISTRATION_TOKEN_EXPIRED);
        });

        it('should return error for mismatched token', () => {
            const wrongToken = TokenManager.generateRegistrationToken();
            const result = TokenManager.validateToken(wrongToken, validTokenData);
            expect(result.isValid).toBe(false);
            expect(result.errorCode).toBe(TOKEN_ERROR_CODES.REGISTRATION_TOKEN_INVALID);
        });

        it('should return success for valid token', () => {
            const result = TokenManager.validateToken(validToken, validTokenData);
            expect(result.isValid).toBe(true);
            expect(result.email).toBe('test@example.com');
            expect(result.errorCode).toBeUndefined();
        });

        it('should validate token at expiry boundary', () => {
            // Token created exactly 24 hours ago should be expired
            const boundaryTokenData: TokenData = {
                ...validTokenData,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            };
            const result = TokenManager.validateToken(validToken, boundaryTokenData);
            expect(result.isValid).toBe(true); // Should still be valid at exactly 24 hours

            // Token created 24 hours and 1 millisecond ago should be expired
            const expiredTokenData: TokenData = {
                ...validTokenData,
                createdAt: new Date(Date.now() - (24 * 60 * 60 * 1000 + 1))
            };
            const expiredResult = TokenManager.validateToken(validToken, expiredTokenData);
            expect(expiredResult.isValid).toBe(false);
        });
    });

    describe('error codes', () => {
        it('should use typed error codes for validation failures', () => {
            const validToken = TokenManager.generateRegistrationToken();
            
            // Test each error code type
            const missingTokenResult = TokenManager.validateToken('', null);
            expect(missingTokenResult.errorCode).toBe(TOKEN_ERROR_CODES.REGISTRATION_TOKEN_REQUIRED);
            
            const invalidTokenResult = TokenManager.validateToken(validToken, null);
            expect(invalidTokenResult.errorCode).toBe(TOKEN_ERROR_CODES.REGISTRATION_TOKEN_INVALID);
            
            const expiredTokenData = {
                token: validToken,
                email: 'test@example.com',
                createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
                expiresAt: new Date(Date.now() - 60 * 60 * 1000)
            };
            const expiredTokenResult = TokenManager.validateToken(validToken, expiredTokenData);
            expect(expiredTokenResult.errorCode).toBe(TOKEN_ERROR_CODES.REGISTRATION_TOKEN_EXPIRED);
        });
    });

    describe('createTokenData', () => {
        it('should create token data with provided email', () => {
            const email = 'test@example.com';
            const tokenData = TokenManager.createTokenData(email);

            expect(tokenData.email).toBe(email);
            expect(tokenData.token).toBeDefined();
            expect(typeof tokenData.token).toBe('string');
            expect(tokenData.createdAt).toBeInstanceOf(Date);
            expect(tokenData.expiresAt).toBeInstanceOf(Date);
        });

        it('should use provided token if given', () => {
            const email = 'test@example.com';
            const customToken = 'custom-token-123';
            const tokenData = TokenManager.createTokenData(email, customToken);

            expect(tokenData.token).toBe(customToken);
            expect(tokenData.email).toBe(email);
        });

        it('should generate token if not provided', () => {
            const email = 'test@example.com';
            const tokenData = TokenManager.createTokenData(email);

            expect(tokenData.token).toBeDefined();
            expect(tokenData.token.length).toBeGreaterThan(0);
            expect(tokenData.token).not.toBe('');
        });

        it('should set expiry date 24 hours from creation', () => {
            const email = 'test@example.com';
            const before = Date.now();
            const tokenData = TokenManager.createTokenData(email);
            const after = Date.now();

            const expectedMinExpiry = before + (24 * 60 * 60 * 1000);
            const expectedMaxExpiry = after + (24 * 60 * 60 * 1000);

            expect(tokenData.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMinExpiry);
            expect(tokenData.expiresAt.getTime()).toBeLessThanOrEqual(expectedMaxExpiry);
        });

        it('should create unique tokens for multiple calls', () => {
            const email = 'test@example.com';
            const tokenData1 = TokenManager.createTokenData(email);
            const tokenData2 = TokenManager.createTokenData(email);

            expect(tokenData1.token).not.toBe(tokenData2.token);
        });
    });
});