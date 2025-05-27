import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        role: {
            type: String,
            required: true,
            enum: ['patient', 'doctor', 'pharmacist', 'admin'],
            default: 'patient',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        medicalFile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MedicalFile',
        },

        // Doctor specific fields
        doctorProfile: {
            specialization: String,
            licenseNumber: String,
            yearsOfExperience: Number,
            availableHours: [{
                day: {
                    type: String,
                    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                },
                startTime: String,
                endTime: String,
            }],
            consultationFee: Number,
            education: [{
                degree: String,
                institution: String,
                year: Number,
            }],
            certifications: [String],
        },

        // Patient specific fields
        patientProfile: {
            emergencyContact: {
                name: String,
                relationship: String,
                phone: String,
            },
            insuranceInfo: {
                provider: String,
                policyNumber: String,
                expiryDate: Date,
            },
        },

        // Pharmacist specific fields
        pharmacistProfile: {
            licenseNumber: String,
            pharmacyName: String,
            pharmacyAddress: {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                country: String,
            },
            yearsOfExperience: Number,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    // Only hash the password if it's modified or new
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password validity
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to hide sensitive information
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpires;
    return obj;
};

export default mongoose.models.User || mongoose.model('User', UserSchema); 