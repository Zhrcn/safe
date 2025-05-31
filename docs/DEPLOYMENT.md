# Deployment Guide

## Vercel Deployment

### Environment Variables

When deploying to Vercel, make sure to set the following environment variables in your Vercel project settings:

```
# API URL - leave empty for production (will use relative paths)
NEXT_PUBLIC_API_BASE_URL=

# JWT Secret - use a strong, unique secret
JWT_SECRET=your-strong-secret-key-here

# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority

# Frontend URL - set to your Vercel deployment URL
NEXT_PUBLIC_FRONTEND_URL=https://your-vercel-app.vercel.app
```

### CORS Issues

If you're experiencing CORS issues in your Vercel deployment, make sure:

1. The `NEXT_PUBLIC_FRONTEND_URL` environment variable is set correctly to your Vercel deployment URL
2. Update the allowed origins in `src/lib/api/cors.js` to include your deployment URL
3. Make sure all API routes include proper CORS headers

### Cookie Settings

For cookie-based authentication to work properly in production:

1. Set `secure: true` for all cookies
2. Use `sameSite: 'lax'` for better cross-site compatibility
3. Make sure the `domain` is set correctly for your deployment

### Debugging Deployment Issues

If you encounter issues with your deployment:

1. Check the Vercel deployment logs
2. Enable the auth debug script by adding `<script src="/auth-debug.js"></script>` to your HTML
3. Check the browser console for authentication-related logs
4. Verify that API requests are being made to the correct URL (should be relative paths)

## Local Development

For local development, create a `.env.local` file with the following variables:

```
# API URL - for local development
NEXT_PUBLIC_API_BASE_URL=/api

# JWT Secret
JWT_SECRET=safe-medical-app-secret-key-for-development

# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority

# Frontend URL - for CORS
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
``` 