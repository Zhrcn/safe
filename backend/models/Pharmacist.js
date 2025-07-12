const mongoose = require('mongoose');
const { generatePharmacistId } = require('../utils/idGenerator');

const workingHoursSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  startTime: { type: String, match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'] }, 
  endTime: { type: String, match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'] },  
  isClosed: { type: Boolean, default: false }
}, { _id: false });
const pharmacistSchema = new mongoose.Schema({
  pharmacistId: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
    index: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required.'],
    unique: true,
    trim: true
  },
  pharmacyName: { 
    type: String,
    required: [true, 'Pharmacy name is required.'],
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
    min: 0
  },
  qualifications: [{
    type: String,
    trim: true
  }],
  professionalBio: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  workingHours: [workingHoursSchema], 
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'Pharmacists'
});

pharmacistSchema.index({ pharmacistId: 1 });

pharmacistSchema.pre('save', async function(next) {
  // Generate pharmacist ID if not already set
  if (!this.pharmacistId) {
    try {
      // Get user's birth date from the user document
      const User = mongoose.model('User');
      const user = await User.findById(this.user);
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      // Use user's dateOfBirth if available, otherwise fallback to current date
      const birthDate = user.dateOfBirth || new Date();
      this.pharmacistId = await generatePharmacistId(birthDate);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);
module.exports = Pharmacist;
