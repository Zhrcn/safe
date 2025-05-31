# MongoDB Connection Troubleshooting

## Connection String Format

The correct format for MongoDB Atlas connection string is:

```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

For your specific case, the correct format should be:

```
mongodb+srv://email:password@cluster0.jofcmme.mongodb.net/SAFE-Medical_Health_Platform?retryWrites=true&w=majority&appName=Cluster0
```

Note the `@` symbol between the password and hostname.

## Common Issues

### 1. IP Address Not Whitelisted

The error message you received indicates that your IP address is not whitelisted in MongoDB Atlas.

To fix this:

1. Log in to your MongoDB Atlas account
2. Go to Network Access in the left sidebar
3. Click "Add IP Address"
4. You can either:
   - Add your current IP address (click "Add Current IP Address")
   - Allow access from anywhere (not recommended for production) by entering `0.0.0.0/0`
5. Click "Confirm"
6. Wait a few minutes for the changes to take effect

### 2. Incorrect Username or Password

Double-check that your username and password are correct.

### 3. Database Name Issues

Ensure the database name in your connection string is correct.

### 4. Connection String Format

Make sure your connection string follows the correct format with `@` between the password and hostname.

## Testing Your Connection

After fixing these issues, run the test script again:

```
npm run test-mongodb-simple
```

If you still encounter issues, please check the MongoDB Atlas documentation or contact their support. 