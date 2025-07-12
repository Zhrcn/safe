const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: './config/config.env' });

function getRandomDate(startYear = 1950, endYear = 2010) {
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1; // Always valid
  return new Date(year, month, day);
}

async function setRandomBirthdates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find();
    console.log(`Found ${users.length} users.`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      user.dateOfBirth = getRandomDate();
      await user.save();
      console.log(`User ${i + 1}/${users.length}: Set dateOfBirth to ${user.dateOfBirth.toISOString().split('T')[0]}`);
    }

    console.log('All users updated with random dateOfBirth.');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

if (require.main === module) {
  setRandomBirthdates();
}

module.exports = setRandomBirthdates; 