import cors from 'cors';

// Accept a comma-separated list of allowed origins in the env var.
// Normalize them by trimming whitespace and trailing slashes so a
// client origin with/without a trailing slash still matches.
const rawOrigins = process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173');
const allowedOrigins = rawOrigins
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => s.replace(/\/+$/, ''));

const corsOptions= {
  origin: (incomingOrigin, callback) => {
    // Allow requests with no origin (e.g. curl, server-to-server)
    if (!incomingOrigin) return callback(null, true);

    const normalized = incomingOrigin.replace(/\/+$/, '');
    if (allowedOrigins.includes(normalized)) {
      // echo back the incoming origin so Access-Control-Allow-Origin === request origin
      return callback(null, incomingOrigin);
    }

    // not allowed
    return callback(new Error('CORS origin not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);