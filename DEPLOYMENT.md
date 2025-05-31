# SAFE WebApp Deployment Guide

This guide provides instructions for deploying the SAFE WebApp to Vercel.

## Prerequisites

- A Vercel account
- A GitHub account with the repository pushed to it
- MongoDB Atlas account (for database)

## Environment Variables

The following environment variables need to be set in your Vercel project:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | The base URL for API requests | `/api` |
| `NEXT_PUBLIC_FRONTEND_URL` | The URL of your deployed frontend | `https://your-app.vercel.app` |
| `JWT_SECRET` | Secret key for JWT token generation | `your-secure-secret-key` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/safe-db` |

## Deployment Steps

1. **Push your code to GitHub**

   Make sure your code is pushed to a GitHub repository.

2. **Connect to Vercel**

   - Go to [Vercel](https://vercel.com) and log in
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: Leave as default if your code is in the root
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Configure Environment Variables**

   - In the Vercel project settings, go to "Environment Variables"
   - Add all the required variables listed above
   - For `NEXT_PUBLIC_API_BASE_URL`, use `/api`
   - For `NEXT_PUBLIC_FRONTEND_URL`, use your Vercel deployment URL (e.g., `https://safe-healthcare.vercel.app`)

4. **Deploy**

   - Click "Deploy"
   - Wait for the build to complete

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Check that `NEXT_PUBLIC_FRONTEND_URL` is set correctly
2. Verify that the CORS headers are being applied correctly in API routes
3. Make sure your API calls are using the correct base URL

### Authentication Issues

If authentication is failing:

1. Check that `JWT_SECRET` is set correctly
2. Verify that cookies are being set with the correct domain
3. Make sure the API routes are accessible from the frontend

### API Connection Issues

If the frontend can't connect to the API:

1. Check that `NEXT_PUBLIC_API_BASE_URL` is set correctly
2. Verify that API routes are working by testing them directly
3. Check for any network errors in the browser console

## Vercel Configuration

The `vercel.json` file in the repository contains configuration for CORS headers and API routes. Make sure this file is included in your deployment.

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ]
}
``` 