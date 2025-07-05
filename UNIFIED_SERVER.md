# Unified Server Setup

This setup allows you to run both the frontend and backend on the same server and port, eliminating CORS issues.

## How it works

- **Development**: Frontend runs on port 3000, backend on port 5001
- **Production**: Both frontend and backend run on the same port (5001 by default)
- The Express server serves the Next.js static build in production

## Development

```bash
# Run frontend and backend separately (development)
npm run dev          # Frontend on port 3000
npm run backend      # Backend on port 5001

# Or run both together
npm run dev:unified
```

## Production

```bash
# Build frontend and start unified server
npm run build:unified

# Or use the deployment script
node deploy.js
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NODE_ENV=production
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-domain.com
```

## Deployment

1. **Build the frontend**: `npm run build`
2. **Start the unified server**: `npm run start:unified`
3. **Access your app**: `http://localhost:5001`

## API Endpoints

All API endpoints are available at `/api/v1/`:
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- etc.

## Benefits

- ✅ No CORS issues
- ✅ Single deployment
- ✅ Same domain for frontend and backend
- ✅ Easier SSL configuration
- ✅ Reduced complexity

## Notes

- The frontend is built as a static export (`out/` directory)
- All routes fall back to `index.html` for client-side routing
- Socket.IO is configured for real-time features
- CORS is only enabled in development mode 