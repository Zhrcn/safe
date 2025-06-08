const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  preferredResponseTime: {
    type: String,
    enum: ['24hours', '48hours', 'oneweek'],
    default: '48hours'
  },
  status: {
    type: String,
    enum: ['pending', 'inProgress', 'completed', 'cancelled'],
    default: 'pending'
  },
  attachments: [{ 
    fileName: String,
    fileType: String, 
    fileSize: Number, 
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      fileName: String,
      fileType: String,
      fileSize: Number,
      fileUrl: String
    }]
  }],
}, {
  timestamps: true,
  collection: 'Consultations'
});

const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;
