const mongoose = require('mongoose');
const { generateDoctorId } = require('../utils/idGenerator');

const DoctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  medicalLicenseNumber: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true,
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true
  },
  experienceYears: {
    type: Number,
    min: [0, 'Experience years cannot be negative']
  },
  education: [{
    degree: { type: String, trim: true, required: true },
    institution: { type: String, trim: true, required: true },
    yearCompleted: {
      type: Number,
      min: 1970,
      max: new Date().getFullYear()
    }
  }],
  achievements: [{
    type: String,
    trim: true
  }],
  patientsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  experience: [{ 
    title: { type: String, trim: true, required: true },
    institution: {
      name: { type: String, trim: true, required: true },
      address: { type: String, trim: true }
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, 
    description: { type: String, trim: true }
  }],
  currentHospitalAffiliation: { 
    name: { type: String, trim: true },
    address: { type: String, trim: true },
    phoneNumber: { type: String, trim: true }
  },
  rating: { 
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
}, {
  timestamps: true,
  collection: 'Doctors'
});

DoctorSchema.index({ doctorId: 1 });
DoctorSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  // Generate doctor ID if not already set
  if (!this.doctorId) {
    try {
      // Get user's birth date from the user document
      const User = mongoose.model('User');
      const user = await User.findById(this.user);
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      // Use user's dateOfBirth if available, otherwise fallback to current date
      const birthDate = user.dateOfBirth || new Date();
      this.doctorId = await generateDoctorId(birthDate);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

module.exports = mongoose.model('Doctor', DoctorSchema);
