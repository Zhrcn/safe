import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dosage: {
        type: String,
        required: true,
        trim: true,
    },
    frequency: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        value: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            enum: ['days', 'weeks', 'months'],
            default: 'days',
        },
    },
    quantity: {
        type: Number,
        required: true,
    },
    instructions: {
        type: String,
        trim: true,
    },
    refills: {
        type: Number,
        default: 0,
    },
    refillsUsed: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Discontinued'],
        default: 'Active',
    },
});

const PrescriptionSchema = new mongoose.Schema(
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
        medications: [MedicationSchema],
        issueDate: {
            type: Date,
            default: Date.now,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Filled', 'Partially Filled', 'Expired', 'Cancelled'],
            default: 'Pending',
        },
        pharmacistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        filledDate: Date,
        notes: {
            doctor: {
                type: String,
                trim: true,
            },
            pharmacist: {
                type: String,
                trim: true,
            },
        },
        diagnosis: {
            type: String,
            trim: true,
        },
        fillHistory: [{
            date: {
                type: Date,
                default: Date.now,
            },
            pharmacistId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            pharmacistName: String,
            medications: [{
                name: String,
                quantity: Number,
                notes: String,
            }],
            notes: String,
        }],
        refillHistory: [{
            requestDate: {
                type: Date,
                default: Date.now,
            },
            approvalDate: Date,
            status: {
                type: String,
                enum: ['Requested', 'Approved', 'Denied', 'Filled'],
                default: 'Requested',
            },
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            filledBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            notes: String,
        }],
        qrCode: String,
    },
    {
        timestamps: true,
    }
);

PrescriptionSchema.virtual('isExpired').get(function () {
    return this.expiryDate && new Date() > this.expiryDate;
});

PrescriptionSchema.virtual('isRefillable').get(function () {
    if (this.status === 'Cancelled' || this.status === 'Expired') {
        return false;
    }

    if (this.expiryDate && new Date() > this.expiryDate) {
        return false;
    }

    return this.medications.some(med => med.refillsUsed < med.refills);
});

PrescriptionSchema.methods.requestRefill = function () {
    this.refillHistory.push({
        requestDate: new Date(),
        status: 'Requested',
    });
};

PrescriptionSchema.methods.updateStatus = function () {
    if (this.status !== 'Cancelled' && this.expiryDate && new Date() > this.expiryDate) {
        this.status = 'Expired';
    }
};

PrescriptionSchema.pre('save', function (next) {
    this.updateStatus();
    next();
});

export default mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema); 