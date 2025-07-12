# Troubleshooting Guide

This guide helps you resolve common issues with the SAFE Healthcare Platform.

## Common Issues

### 1. i18next Translation Errors

**Error:** `i18next::translator: accessing an object - but returnObjects options is not enabled!`

**Solution:** This has been fixed in the latest version. The `returnObjects` option is now enabled in the i18next configuration.

### 2. Socket Connection Issues

**Error:** `[Socket] Disconnected: transport close` or `[Socket] Socket not connected, waiting for connection...`

**Causes:**
- Backend server is not running
- Network connectivity issues
- Authentication problems

**Solutions:**

#### A. Start the Backend Server
```bash
# Option 1: Use the npm script (recommended)
npm run backend

# Option 2: Manual start
cd backend
npm install
npm run dev

# Option 3: Manual start with start command
cd backend
npm install
npm run start
```

#### B. Check Backend Health
The application automatically checks backend health and will show notifications if the server is unavailable.

#### C. Test Backend Health Endpoint
You can manually test if the backend is running:
```bash
curl http://localhost:5001/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "SAFE Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

#### C. Verify Environment Variables
Make sure your `.env` file has the correct backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

### 3. Source Map Errors

**Error:** `Source map error: Error: request failed with status 404`

**Solution:** These are development-only warnings and don't affect functionality. They've been suppressed in the latest version.

### 4. Health Check Loop

**Issue:** Repeated health check requests causing 404 errors

**Solution:** This has been fixed by:
- Removing dependencies from the health check useEffect to prevent loops
- Adding proper health endpoint at `/api/v1/health`
- Adding cleanup to prevent memory leaks
- Using proper error handling and timeouts

### 5. Console Noise

**Issue:** Too many console messages in development

**Solution:** The application now filters out common development noise including:
- Source map errors
- i18next warnings
- Socket reconnection attempts (after max retries)
- Health check errors (when backend is not running)

## Development Setup

### Prerequisites
- Node.js 18+ 
- MongoDB running locally or accessible
- npm or yarn

### Quick Start
```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev

# Or start them separately
npm run frontend  # Frontend only
npm run backend   # Backend only
```

### Backend Requirements
- MongoDB instance running
- Environment variables configured (see `backend/config/config.env`)
- Port 5001 available

### Frontend Requirements
- Port 3000 available
- Backend server running for full functionality

## Environment Configuration

### Backend (.env in backend directory)
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/safe
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
NEXT_PUBLIC_TOKEN_NAME=safe_auth_token
```

## Performance Tips

1. **Socket Connections:** The app now limits reconnection attempts to reduce console noise
2. **Translation Loading:** i18next is configured for better performance
3. **Error Handling:** Improved error boundaries and fallbacks

## Getting Help

If you're still experiencing issues:

1. Check the browser console for specific error messages
2. Verify the backend server is running and accessible
3. Check MongoDB connection
4. Review environment variable configuration
5. Try clearing browser cache and local storage

## Known Issues

- Socket connections may fail if backend is not running (expected behavior)
- Some console warnings in development mode (suppressed in latest version)
- Translation objects vs strings (resolved with returnObjects option)

## Common Errors

### ES Module Error
**Error:** `ReferenceError: require is not defined in ES module scope`

**Solution:** The project uses ES modules. Use the provided scripts:
- `npm run backend` (runs backend in development mode)
- `npm run dev` (starts both frontend and backend) 