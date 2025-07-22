const mongoose = require('mongoose');
const User = require('../models/User');
const Distributor = require('../models/Distributor');
const bcrypt = require('bcryptjs');

async function seedDistributors() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safe');

  // Remove the distributors array and related seeding logic for sample distributors

  console.log('Seeded distributors!');
  await mongoose.disconnect();
}

seedDistributors(); 