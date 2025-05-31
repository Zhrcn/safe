// Simple script to test MongoDB Atlas connection using CommonJS
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

console.log('MongoDB Atlas Connection Test (Simple Version)');
console.log('============================================');

// Get connection string from environment or use placeholder
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority';

console.log('Connection string:', 
  MONGODB_URI.replace(/:([^:@]+)@/, ':****@') // Hide password in logs
);
console.log('');

// Connect to MongoDB
console.log('Attempting to connect to MongoDB Atlas...');
mongoose.connect(MONGODB_URI, {
  bufferCommands: false
})
.then(async () => {
  console.log('✅ Successfully connected to MongoDB Atlas');
  console.log(`Database name: ${mongoose.connection.db.databaseName}`);
  console.log(`Host: ${mongoose.connection.host}`);
  
  // List collections
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    if (collections.length === 0) {
      console.log('- No collections found');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
  } catch (err) {
    console.error('Error listing collections:', err.message);
  }
  
  // Close connection
  await mongoose.connection.close();
  console.log('Connection closed');
  console.log('\n✅ Connection test completed');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error(err);
  process.exit(1);
}); 