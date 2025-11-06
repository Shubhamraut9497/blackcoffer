import cors from 'cors';

const CORS_ORIGIN = process.env.NODE_ENV === 'production'
  ? process.env.CORS_ORIGIN
  : 'http://localhost:5173';

export const corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);