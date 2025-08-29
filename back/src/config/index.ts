// Application configuration
export interface AppConfig {
  port: number;
  database: {
    path: string;
  };
  auth: {
    magicLinkExpiryMinutes: number;
    sessionExpiryDays: number;
    jwtSecret: string;
  };
  mailgun: {
    apiKey: string;
    domain: string;
    fromEmail: string;
    fromName: string;
  };
  cors: {
    origin: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

// Load configuration from environment variables
export function loadConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT || '3000'),
    database: {
      path: process.env.DATABASE_PATH || './data/chatmesh.db'
    },
    auth: {
      magicLinkExpiryMinutes: parseInt(process.env.MAGIC_LINK_EXPIRY_MINUTES || '15'),
      sessionExpiryDays: parseInt(process.env.SESSION_EXPIRY_DAYS || '7'),
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    },
    mailgun: {
      apiKey: process.env.MAILGUN_API_KEY || '',
      domain: process.env.MAILGUN_DOMAIN || '',
      fromEmail: process.env.MAILGUN_FROM_EMAIL || 'noreply@chatmesh.com',
      fromName: process.env.MAILGUN_FROM_NAME || 'ChatMesh'
    },
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
      credentials: process.env.CORS_CREDENTIALS === 'true'
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
    }
  };
}

// Export singleton config instance
export const config = loadConfig();