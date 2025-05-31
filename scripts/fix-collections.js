// Script to fix collection names in MongoDB
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function fixCollections() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    
    console.log('Connected to database:', db.databaseName);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Current collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Define collection mappings (lowercase to correct case)
    const collectionMappings = {
      'users': 'Users',
      'appointments': 'Appointments',
      'medicalfiles': 'MedicalFiles',
      'prescriptions': 'Prescriptions'
    };
    
    // Check and rename collections if needed
    for (const [oldName, newName] of Object.entries(collectionMappings)) {
      const collectionExists = collections.some(c => c.name === oldName);
      const correctCollectionExists = collections.some(c => c.name === newName);
      
      if (collectionExists && !correctCollectionExists) {
        console.log(`Renaming collection ${oldName} to ${newName}...`);
        await db.collection(oldName).rename(newName);
        console.log(`Collection renamed successfully`);
      } else if (collectionExists && correctCollectionExists) {
        console.log(`Both ${oldName} and ${newName} exist. Merging data...`);
        
        // Get all documents from the old collection
        const documents = await db.collection(oldName).find({}).toArray();
        console.log(`Found ${documents.length} documents in ${oldName}`);
        
        if (documents.length > 0) {
          // Insert them into the new collection
          await db.collection(newName).insertMany(documents);
          console.log(`Inserted ${documents.length} documents into ${newName}`);
          
          // Drop the old collection
          await db.collection(oldName).drop();
          console.log(`Dropped ${oldName} collection`);
        }
      } else if (!collectionExists && !correctCollectionExists) {
        console.log(`Neither ${oldName} nor ${newName} exist. Creating ${newName}...`);
        await db.createCollection(newName);
        console.log(`Created ${newName} collection`);
      } else {
        console.log(`Collection ${newName} already exists with correct name`);
      }
    }
    
    // List collections after fixes
    const updatedCollections = await db.listCollections().toArray();
    console.log('\nUpdated collections:');
    updatedCollections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error fixing collections:', error);
    process.exit(1);
  }
}

// Run the fix function
fixCollections(); 