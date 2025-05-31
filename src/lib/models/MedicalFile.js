import mongoose from 'mongoose';

const MedicalFileSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        bloodType: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
            default: 'Unknown',
        },
        height: {
            value: Number,
            unit: {
                type: String,
                enum: ['cm', 'in'],
                default: 'cm',
            },
            date: Date,
        },
        weight: {
            value: Number,
            unit: {
                type: String,
                enum: ['kg', 'lb'],
                default: 'kg',
            },
            date: Date,
        },
        allergies: [{
            name: String,
            severity: {
                type: String,
                enum: ['Mild', 'Moderate', 'Severe', 'Unknown'],
                default: 'Unknown',
            },
            reaction: String,
            notes: String,
        }],
        conditions: [{
            name: {
                type: String,
                required: true,
            },
            diagnosisDate: Date,
            status: {
                type: String,
                enum: ['Active', 'Resolved', 'Chronic', 'In Remission'],
                default: 'Active',
            },
            notes: String,
            medications: [{
                name: String,
                dosage: String,
                frequency: String,
                startDate: Date,
                endDate: Date,
                active: {
                    type: Boolean,
                    default: true,
                },
            }],
        }],
        surgeries: [{
            name: String,
            date: Date,
            hospital: String,
            surgeon: String,
            notes: String,
        }],
        familyHistory: [{
            relation: {
                type: String,
                enum: ['Father', 'Mother', 'Sibling', 'Child', 'Grandfather', 'Grandmother', 'Other'],
            },
            condition: String,
            notes: String,
        }],
        immunizations: [{
            name: String,
            date: Date,
            expiryDate: Date,
            notes: String,
        }],
        vitalSigns: [{
            date: {
                type: Date,
                default: Date.now,
            },
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
            oxygenSaturation: Number,
            notes: String,
        }],
        habits: {
            smoking: {
                status: {
                    type: String,
                    enum: ['Never', 'Former', 'Current', 'Unknown'],
                    default: 'Unknown',
                },
                frequency: String,
                notes: String,
            },
            alcohol: {
                status: {
                    type: String,
                    enum: ['Never', 'Occasional', 'Regular', 'Heavy', 'Unknown'],
                    default: 'Unknown',
                },
                frequency: String,
                notes: String,
            },
            exercise: {
                frequency: String,
                notes: String,
            },
            diet: {
                notes: String,
            },
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
            trim: true,
        },
        accessLog: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            userName: String,
            userRole: String,
            action: {
                type: String,
                enum: ['Created', 'Viewed', 'Updated', 'Deleted'],
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            details: String,
        }],
    },
    {
        timestamps: true,
    }
);

MedicalFileSchema.pre('save', function (next) {
    this.lastUpdated = new Date();
    next();
});

MedicalFileSchema.methods.addAccessLog = function (user, action, details) {
    this.accessLog.push({
        userId: user._id,
        userName: user.name,
        userRole: user.role,
        action,
        details,
        timestamp: new Date(),
    });
};

export default mongoose.models.MedicalFile || mongoose.model('MedicalFile', MedicalFileSchema); 