// Usage: node backend/scripts/print_full_user.js
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/safe';

async function printFullUser() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.findOne({ email: 'globalmeds@distributor.com' }).lean();
  if (!user) {
    console.log('User not found.');
  } else {
    console.log('Full user document:', user);
  }
  await mongoose.disconnect();
  process.exit(0);
}

printFullUser().catch(err => {
  console.error('Error printing user:', err);
  process.exit(1);
}); 