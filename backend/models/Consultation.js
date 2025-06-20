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
    enum: ['Pending', 'Answered'],
    default: 'Pending'
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Consultation', ConsultationSchema);
