const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error('MongoDB Connection Error:'.red, err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
