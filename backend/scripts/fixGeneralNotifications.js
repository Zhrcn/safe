const path = require('path');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
require('dotenv').config({ path: path.resolve(__dirname, '../config/config.env') });

async function fixGeneralNotifications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all notifications with relatedModel: 'General'
    const generalNotifications = await Notification.find({ relatedModel: 'General' });
    console.log(`Found ${generalNotifications.length} notifications with relatedModel: 'General'`);

    if (generalNotifications.length > 0) {
      // Update these notifications to remove the General reference
      const result = await Notification.updateMany(
        { relatedModel: 'General' },
        { 
          $unset: { relatedTo: 1, relatedModel: 1 }
        }
      );
      console.log(`Updated ${result.modifiedCount} notifications`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
fixGeneralNotifications(); 