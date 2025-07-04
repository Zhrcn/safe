const mongoose = require('mongoose');
const ConsultationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: [true, 'Please provide your question']
  },
  answer: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Answered', 'Completed'],
    default: 'Pending'
  },
  messages: [{
    sender: {
      type: String,
      enum: ['patient', 'doctor'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

ConsultationSchema.pre('save', function(next) {
  if (this.isNew && this.question && (!this.messages || this.messages.length === 0)) {
    this.messages.push({
      sender: 'patient',
      message: this.question,
      timestamp: new Date()
    });
  }
  this.lastActivity = new Date();
  next();
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
