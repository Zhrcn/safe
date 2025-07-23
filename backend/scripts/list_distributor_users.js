// Usage: node backend/scripts/list_distributor_users.js
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/safe';

async function listDistributorUsers() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const users = await User.find({ email: 'globalmeds@distributor.com' });
  if (!users.length) {
    console.log('No users found with email globalmeds@distributor.com');
  } else {
    users.forEach(u => {
      console.log({ id: u._id, email: u.email, role: u.role });
    });
  }
  await mongoose.disconnect();
  process.exit(0);
}

listDistributorUsers().catch(err => {
  console.error('Error listing distributor users:', err);
  process.exit(1);
}); 