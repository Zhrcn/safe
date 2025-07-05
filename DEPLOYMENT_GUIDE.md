# Deployment Guide

## Current Issue
Your frontend is deployed on Vercel but trying to connect to a backend that doesn't exist in production.

## Quick Fix Options

### Option 1: Deploy Backend to Render (Recommended)

1. **Go to [Render.com](https://render.com)** and create an account
2. **Connect your GitHub repository**
3. **Create a new Web Service**
4. **Configure the service:**
   - **Name**: `safe-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (root of repo)

5. **Add Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `5001`
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `FRONTEND_URL`: `https://safe-webapp.vercel.app`

6. **Deploy** and get your backend URL (e.g., `https://safe-backend.onrender.com`)

7. **Update Vercel Environment Variables:**
   - Go to your Vercel project settings
   - Add: `BACKEND_URL` = `https://safe-backend.onrender.com`

### Option 2: Use Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Deploy the backend folder**
4. **Set environment variables**
5. **Get the deployment URL**

### Option 3: Use ngrok for Testing

1. **Install ngrok**: `npm install -g ngrok`
2. **Start your local backend**: `npm run backend`
3. **In another terminal**: `ngrok http 5001`
4. **Copy the HTTPS URL**
5. **Add to Vercel**: `BACKEND_URL` = your ngrok URL

## Environment Variables Needed

### Backend (Render/Railway)
```
NODE_ENV=production
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://safe-webapp.vercel.app
```

### Frontend (Vercel)
```
BACKEND_URL=https://your-backend-url.com
```

## Testing

After deployment:
1. Your frontend will be at: `https://safe-webapp.vercel.app`
2. Your backend will be at: `https://your-backend-url.com`
3. API calls will go through: `https://safe-webapp.vercel.app/api/v1/*` (proxied to backend)

## Troubleshooting

- **500 errors**: Check if `BACKEND_URL` is set correctly in Vercel
- **404 errors**: Check if backend is running and accessible
- **CORS errors**: Should be resolved with the proxy setup 