import dotenv from 'dotenv';
import path from 'path';

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const config = {
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/analytics-dashboard',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-development-secret-key',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  cookie: {
    secret: process.env.COOKIE_SECRET,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  production: {
    enableCompression: process.env.ENABLE_COMPRESSION === 'true',
    trustProxy: parseInt(process.env.TRUST_PROXY || '0'),
  },
};

// Validate required configuration
const validateConfig = () => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'CORS_ORIGIN',
    'COOKIE_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.NODE_ENV === 'production') {
    // Additional production checks
    if (!process.env.COOKIE_SECURE || process.env.COOKIE_SECURE !== 'true') {
      throw new Error('COOKIE_SECURE must be true in production');
    }
    
    if (!process.env.CORS_ORIGIN?.startsWith('https://')) {
      throw new Error('CORS_ORIGIN must use HTTPS in production');
    }
  }
};

// Only validate in production
if (process.env.NODE_ENV === 'production') {
  validateConfig();
}

export default config;