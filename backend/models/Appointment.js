const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v === 'TBD' || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time!`
    }
  },
  location: {
    type: String,
    default: 'TBD'
  },
  type: {
    type: String,
    enum: ['checkup', 'consultation', 'follow-up', 'emergency'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'scheduled', 'completed', 'cancelled', 'rescheduled', 'reschedule_requested'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  doctorNotes: {
    type: String
  },
  patientNotes: {
    type: String
  },
  rescheduleRequest: {
    requestedDate: {
      type: Date
    },
    requestedTime: {
      type: String
    },
    preferredTimes: [{
      type: String
    }],
    reason: {
      type: String
    },
    notes: {
      type: String
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

appointmentSchema.methods.canBeModified = function() {
  const appointmentDate = new Date(this.date);
  const placeholderDate = new Date('1111-01-01');
  
  if (appointmentDate.getTime() === placeholderDate.getTime() || isNaN(appointmentDate.getTime())) {
    return true;
  }
  
  if (!this.time || this.time === 'TBD' || !this.time.includes(':')) {
    const now = new Date();
    const timeDifference = appointmentDate.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference > 24;
  }
  
  const appointmentDateTime = new Date(this.date);
  const [hours, minutes] = this.time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    const now = new Date();
    const timeDifference = appointmentDate.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference > 24;
  }
  
  appointmentDateTime.setHours(hours, minutes, 0, 0);
  const now = new Date();
  const timeDifference = appointmentDateTime.getTime() - now.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  return hoursDifference > 24;
};

appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });
module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
