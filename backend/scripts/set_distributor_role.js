// Usage: node backend/scripts/set_distributor_role.js
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/safe';

async function setDistributorRole() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.findOneAndUpdate(
    { email: 'globalmeds@distributor.com' },
    { $set: { role: 'distributor' } },
    { new: true }
  );
  if (!user) {
    console.log('User not found.');
  } else {
    console.log('Updated user:', { id: user._id, email: user.email, role: user.role });
  }
  await mongoose.disconnect();
  process.exit(0);
}

setDistributorRole().catch(err => {
  console.error('Error setting distributor role:', err);
  process.exit(1);
}); 