import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_FRONTEND_URL || '',
      'https://safe-119uw2cm2-zhrcns-projects.vercel.app',
      'https://safe-web-app.vercel.app',
    ].filter(Boolean);
    
    // If no allowed origins are configured, allow all origins
    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }
    
    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Export the CORS middleware
export default async function handleCors(req, res) {
  await runMiddleware(req, res, cors);
} 