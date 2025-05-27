import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['In-person', 'Video', 'Phone'],
            default: 'In-person',
        },
        status: {
            type: String,
            enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'],
            default: 'Scheduled',
        },
        reasonForVisit: {
            type: String,
            required: true,
        },
        notes: {
            doctor: {
                type: String,
                trim: true,
            },
            patient: {
                type: String,
                trim: true,
            },
        },
        followUp: {
            recommended: {
                type: Boolean,
                default: false,
            },
            timeframe: {
                value: Number,
                unit: {
                    type: String,
                    enum: ['days', 'weeks', 'months'],
                },
            },
            notes: String,
        },
        vitals: {
            bloodPressure: {
                systolic: Number,
                diastolic: Number,
            },
            heartRate: Number,
            respiratoryRate: Number,
            temperature: {
                value: Number,
                unit: {
                    type: String,
                    enum: ['C', 'F'],
                    default: 'C',
                },
            },
            weight: {
                value: Number,
                unit: {
                    type: String,
                    enum: ['kg', 'lb'],
                    default: 'kg',
                },
            },
            height: {
                value: Number,
                unit: {
                    type: String,
                    enum: ['cm', 'in'],
                    default: 'cm',
                },
            },
            notes: String,
        },
        diagnosis: [{
            condition: String,
            notes: String,
            icd10Code: String,
        }],
        prescriptions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prescription',
        }],
        procedures: [{
            name: String,
            notes: String,
            cptCode: String,
        }],
        reminders: [{
            sentAt: Date,
            method: {
                type: String,
                enum: ['Email', 'SMS', 'Push'],
            },
            status: {
                type: String,
                enum: ['Sent', 'Delivered', 'Failed'],
            },
        }],
        cancellationReason: {
            type: String,
            trim: true,
        },
        cancellationDate: Date,
        cancelledBy: {
            type: String,
            enum: ['Patient', 'Doctor', 'System'],
        },
        videoConferenceLink: String,
        duration: {
            type: Number,
            default: 30, // Duration in minutes
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for common queries
AppointmentSchema.index({ date: 1, startTime: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ 'diagnosis.condition': 1 });

// Virtual for checking if appointment is upcoming
AppointmentSchema.virtual('isUpcoming').get(function () {
    return this.date > new Date() && this.status !== 'Cancelled';
});

// Method to cancel an appointment
AppointmentSchema.methods.cancel = function (cancelledBy, reason) {
    this.status = 'Cancelled';
    this.cancellationReason = reason;
    this.cancellationDate = new Date();
    this.cancelledBy = cancelledBy;
};

// Method to complete an appointment
AppointmentSchema.methods.complete = function (doctorNotes) {
    this.status = 'Completed';
    if (doctorNotes) {
        this.notes.doctor = doctorNotes;
    }
};

// Method to recommend follow-up
AppointmentSchema.methods.recommendFollowUp = function (timeValue, timeUnit, notes) {
    this.followUp = {
        recommended: true,
        timeframe: {
            value: timeValue,
            unit: timeUnit,
        },
        notes: notes,
    };
};

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema); 