// Script to update passwords for existing users
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function updatePasswords() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    
    console.log('Connected to database:', db.databaseName);
    
    // Get all users
    const users = await db.collection('Users').find({}).toArray();
    console.log(`Found ${users.length} users in database`);
    
    // Update passwords for known users
    const passwordMap = {
      'admin@example.com': 'admin123',
      'doctor@example.com': 'doctor123',
      'patient@example.com': 'patient123',
      'pharmacist@example.com': 'pharmacist123'
    };
    
    const salt = await bcrypt.genSalt(10);
    
    for (const user of users) {
      if (passwordMap[user.email]) {
        const password = passwordMap[user.email];
        const hashedPassword = await bcrypt.hash(password, salt);
        
        console.log(`Updating password for ${user.email}`);
        
        await db.collection('Users').updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );
        
        console.log(`Password updated for ${user.email}`);
      }
    }
    
    console.log('All passwords updated successfully!');
    
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error updating passwords:', error);
    process.exit(1);
  }
}

// Run the update function
updatePasswords(); 