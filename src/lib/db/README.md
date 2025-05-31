# MongoDB Atlas Connection Guide

This guide explains how to connect your SAFE WebApp to MongoDB Atlas.

## Step 1: Create a MongoDB Atlas Account

If you don't already have a MongoDB Atlas account, go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.

## Step 2: Create a Cluster

1. After signing in, create a new cluster (free tier is sufficient for development)
2. Choose your preferred cloud provider and region
3. Click "Create Cluster" (this may take a few minutes)

## Step 3: Configure Database Access

1. In the left sidebar, click on "Database Access"
2. Click "Add New Database User"
3. Create a username and password (make sure to save these credentials)
4. Set appropriate permissions (e.g., "Read and Write to Any Database")
5. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click on "Network Access"
2. Click "Add IP Address"
3. For development, you can choose "Allow Access from Anywhere" (not recommended for production)
4. Click "Confirm"

## Step 5: Get Your Connection String

1. In the clusters view, click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" as your driver and the appropriate version
4. Copy the connection string

## Step 6: Configure Your Application

1. Create a `.env.local` file in the root of your project
2. Add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

3. Replace the placeholders:
   - `<username>`: Your MongoDB Atlas username
   - `<password>`: Your MongoDB Atlas password
   - `<cluster-name>`: Your cluster name (e.g., cluster0)
   - `<database-name>`: Your database name (e.g., safe-app)

## Step 7: Test the Connection

After setting up your connection string, you can test the connection by accessing:

```
/api/mongodb-test
```

This endpoint will verify if your application can successfully connect to MongoDB Atlas.

## Connection String Example

Here's an example of what your connection string might look like:

```
mongodb+srv://safeapp:YourPassword123@cluster0.abc123.mongodb.net/safe-app?retryWrites=true&w=majority
```

## Troubleshooting

If you encounter connection issues:

1. Verify your username and password are correct
2. Check that your IP address is allowed in the Network Access settings
3. Ensure your cluster is up and running
4. Confirm that you've replaced all placeholders in the connection string 