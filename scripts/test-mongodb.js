// Simple script to test MongoDB Atlas connection
require('dotenv').config({ path: '.env.local' });

// Use dynamic import for ES modules
async function runTest() {
  try {
    console.log('MongoDB Atlas Connection Test');
    console.log('============================');
    console.log('Connection string:', process.env.MONGODB_URI || 'Not set (using default)');
    console.log('');

    // Dynamically import the ES module
    const { connectToDatabase } = await import('../src/lib/db/mongodb.js');
    
    console.log('Attempting to connect to MongoDB Atlas...');
    const mongoose = await connectToDatabase();
    
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Successfully connected to MongoDB Atlas');
      console.log(`Database name: ${mongoose.connection.db.databaseName}`);
      console.log(`Host: ${mongoose.connection.host}`);
      
      // List collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\nCollections in database:');
      if (collections.length === 0) {
        console.log('- No collections found');
      } else {
        collections.forEach(collection => {
          console.log(`- ${collection.name}`);
        });
      }
      
      // Close the connection
      await mongoose.connection.close();
      console.log('Connection closed');
      console.log('\n✅ Connection test completed');
      process.exit(0);
    } else {
      console.error('❌ Failed to connect to MongoDB Atlas');
      console.error(`Connection state: ${mongoose.connection.readyState}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runTest(); 