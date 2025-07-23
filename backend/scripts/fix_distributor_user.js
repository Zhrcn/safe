// Usage: node backend/scripts/fix_distributor_user.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Distributor = require('../models/Distributor');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/safe'; // Adjust if needed

async function fixDistributorUser() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const email = 'globalmeds@distributor.com';
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { role: 'distributor' } },
    { new: true }
  );
  if (!user) {
    console.error('User not found:', email);
    process.exit(1);
  }
  console.log('User role set to distributor:', user.email);
  let distributor = await Distributor.findOne({ user: user._id });
  if (!distributor) {
    distributor = await Distributor.create({
      user: user._id,
      companyName: user.firstName + ' ' + user.lastName,
      contactName: user.firstName + ' ' + user.lastName,
      contactEmail: user.email,
      contactPhone: user.phoneNumber || '',
      address: user.address || '',
      distributorId: 'DST-' + Date.now()
    });
    console.log('Distributor profile created for user:', user.email);
  } else {
    console.log('Distributor profile already exists for user:', user.email);
  }
  await mongoose.disconnect();
  process.exit(0);
}

fixDistributorUser().catch(err => {
  console.error('Error fixing distributor user:', err);
  process.exit(1);
}); 