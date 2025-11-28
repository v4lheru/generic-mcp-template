import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

/**
 * Server configuration
 */
export const config = {
  // API configuration
  api: {
    key: process.env.API_KEY || '',
    baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
    cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
    rateLimitPerSecond: parseInt(process.env.RATE_LIMIT_PER_SECOND || '10', 10),
  },

  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    directory: process.env.LOG_DIRECTORY || './logs',
  },
};

/**
 * Validate required configuration
 */
export function validateConfig(): void {
  if (!config.api.key) {
    console.warn('⚠️ API_KEY is not set. Some functionality may be limited.');
  }

  // Add additional validation as needed for your specific API
}
