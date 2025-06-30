# SAFE Healthcare Platform - Deployment Guide

## Backend Deployment (Render.com)

### 1. Prepare Your Backend
Your backend is already configured for deployment. The following files are ready:
- `backend/server.js` - Main server file
- `backend/package.json` - Dependencies and scripts
- `backend/render.yaml` - Render deployment configuration

### 2. Deploy to Render
1. Go to [render.com](https://render.com) and create an account
2. Connect your GitHub repository
3. Create a new Web Service
4. Select your repository and the `backend` folder
5. Configure the following environment variables in Render dashboard:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://muhammadzouherkanaan:Zouher123@cluster0.jofcmme.mongodb.net/SAFE-Medical_Health_Platform?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
FRONTEND_URL=https://safe-5gxi.vercel.app
JWT_COOKIE_EXPIRE=30
```

6. Set build command: `npm install`
7. Set start command: `npm start`
8. Deploy the service

### 3. Get Your Backend URL
After deployment, Render will provide you with a URL like:
`https://your-app-name.onrender.com`

## Frontend Configuration

### 1. Update Environment Variables
Once your backend is deployed, update your frontend environment variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variable:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### 2. Redeploy Frontend
After adding the environment variable, redeploy your frontend on Vercel.

## Alternative Backend Hosting Options

### Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the backend folder
4. Set environment variables in Railway dashboard

### Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Deploy using: `heroku create && git push heroku main`
4. Set environment variables: `heroku config:set NODE_ENV=production`

## Testing the Deployment

1. **Test Backend**: Visit `https://your-backend-url.onrender.com` - should show "Express Server for SAFE App is running!"

2. **Test Frontend**: Visit your Vercel URL and try to login

3. **Check CORS**: Open browser dev tools and check for CORS errors

## Troubleshooting

### CORS Issues
If you still get CORS errors:
1. Make sure your backend URL is correctly set in `NEXT_PUBLIC_API_URL`
2. Verify the CORS configuration in `backend/server.js` includes your Vercel URL
3. Check that your backend is actually running and accessible

### Database Connection Issues
1. Verify your MongoDB Atlas connection string is correct
2. Make sure your IP is whitelisted in MongoDB Atlas
3. Check that your database user has the correct permissions

### Environment Variables
1. Make sure all environment variables are set in your hosting platform
2. Verify the variable names match exactly (case-sensitive)
3. Redeploy after changing environment variables

## Security Notes

1. **JWT Secret**: Use a strong, random secret key in production
2. **MongoDB**: Use environment variables for database credentials
3. **CORS**: Only allow necessary origins in production
4. **HTTPS**: Always use HTTPS in production

## Monitoring

1. Set up logging in your backend
2. Monitor your application performance
3. Set up alerts for errors
4. Monitor database connections and performance 