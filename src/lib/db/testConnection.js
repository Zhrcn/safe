import { connectToDatabase } from './mongodb';

/**
 * Test MongoDB Atlas connection
 * You can run this script directly to test your connection
 */
async function testMongoDBConnection() {
  try {
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
      
      console.log('\nConnection test completed successfully');
    } else {
      console.error('❌ Failed to connect to MongoDB Atlas');
      console.error(`Connection state: ${mongoose.connection.readyState}`);
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error(error);
    return false;
  }
}

// If this file is run directly (not imported)
if (require.main === module) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  testMongoDBConnection()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Unhandled error:', err);
      process.exit(1);
    });
}

export default testMongoDBConnection; 