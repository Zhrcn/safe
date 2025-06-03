const { NextResponse } = require('next/server');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectToDatabase, withTimeout } = require('@/lib/db');
const User = require('@/models/User');
const Doctor = require('@/models/Doctor');
const Patient = require('@/models/Patient');
const MedicalFile = require('@/models/MedicalFile');

let Pharmacist;
try {
    Pharmacist = require('@/models/Pharmacist');
} catch (error) {
    console.log('Pharmacist model not found, continuing without it');
}

const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  PHARMACIST: 'pharmacist',
  ADMIN: 'admin'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    role: z.enum(Object.values(ROLES)),
    phoneNumber: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable()
        .transform(val => val ? new Date(val) : undefined),
    gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Gender must be male, female, or other' })
    }).optional().nullable(),
    profileImage: z.string().optional().nullable(),
    // For backward compatibility
    profile: z.object({
        firstName: z.string().optional().nullable(),
        lastName: z.string().optional().nullable(),
        phoneNumber: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        dateOfBirth: z.string().optional().nullable()
            .transform(val => val ? new Date(val) : undefined),
        gender: z.string().optional().nullable()
    }).optional().nullable(),
    doctorProfile: z.object({
        specialization: z.string().optional().nullable(),
        licenseNumber: z.string().optional().nullable(),
        yearsOfExperience: z.preprocess(
            val => val === '' ? undefined : val,
            z.string().optional().nullable()
                .transform(val => val ? parseInt(val, 10) : undefined)
        )
    }).optional().nullable(),
    patientProfile: z.object({
        emergencyContact: z.object({
            name: z.string().optional().nullable(),
            relationship: z.string().optional().nullable(),
            phoneNumber: z.string().optional().nullable()
        }).optional().nullable(),
        insurance: z.object({
            provider: z.string().optional().nullable(),
            policyNumber: z.string().optional().nullable(),
            expiryDate: z.string().optional().nullable()
                .transform(val => val ? new Date(val) : undefined)
        }).optional().nullable()
    }).optional().nullable(),
    pharmacistProfile: z.object({
        licenseNumber: z.string().optional().nullable(),
        pharmacy: z.object({
            name: z.string().optional().nullable(),
            address: z.string().optional().nullable(),
            phoneNumber: z.string().optional().nullable()
        }).optional().nullable()
    }).optional().nullable()
});

export async function POST(req) {
    try {
        const body = await req.json();
        console.log('Registration data received:', JSON.stringify(body, null, 2));

        try {
            const validatedData = registerSchema.parse(body);
            console.log('Validated data:', JSON.stringify(validatedData, null, 2));

            // Connect to MongoDB with timeout protection
            try {
                await withTimeout(connectToDatabase(), 5000, 'Database connection timeout');
            } catch (dbError) {
                console.error('Database connection error:', dbError);
                return NextResponse.json(
                    { 
                        success: false,
                        error: 'Database connection failed', 
                        message: dbError.message,
                        diagnostics: {
                            errorType: 'database_connection',
                            timestamp: new Date().toISOString()
                        }
                    },
                    { status: 503 }
                );
            }

            // Check if user already exists with timeout protection
            let existingUser;
            try {
                existingUser = await withTimeout(
                    User.findOne({ email: validatedData.email.toLowerCase() }),
                    5000,
                    'User lookup timeout'
                );
            } catch (lookupError) {
                console.error('User lookup error:', lookupError);
                return NextResponse.json(
                    { 
                        success: false,
                        error: 'User lookup failed', 
                        message: lookupError.message,
                        diagnostics: {
                            errorType: 'database_query',
                            timestamp: new Date().toISOString()
                        }
                    },
                    { status: 500 }
                );
            }
            if (existingUser) {
                return NextResponse.json(
                    { error: 'User with this email already exists' },
                    { status: 400 }
                );
            }

            // Clean user data to remove null/undefined values
            const cleanUserData = (data) => {
                const cleanedData = { ...data };
                
                if (cleanedData.profile) {
                    Object.keys(cleanedData.profile).forEach(key => {
                        if (cleanedData.profile[key] === null || cleanedData.profile[key] === undefined) {
                            delete cleanedData.profile[key];
                        }
                    });

                    if (Object.keys(cleanedData.profile).length === 0) {
                        delete cleanedData.profile;
                    }
                }

                ['doctorProfile', 'patientProfile', 'pharmacistProfile'].forEach(profileKey => {
                    if (cleanedData[profileKey]) {
                        const cleanNestedObject = (obj) => {
                            for (const key in obj) {
                                if (obj[key] === null || obj[key] === undefined) {
                                    delete obj[key];
                                } else if (typeof obj[key] === 'object') {
                                    cleanNestedObject(obj[key]);
                                    if (Object.keys(obj[key]).length === 0) {
                                        delete obj[key];
                                    }
                                }
                            }
                        };

                        cleanNestedObject(cleanedData[profileKey]);

                        if (Object.keys(cleanedData[profileKey]).length === 0) {
                            delete cleanedData[profileKey];
                        }
                    }
                });

                return cleanedData;
            };

            const cleanedUserData = cleanUserData(validatedData);
            console.log('Cleaned user data for saving:', JSON.stringify(cleanedUserData, null, 2));

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(cleanedUserData.password, salt);

            // Extract profile data from the nested structure or from top-level properties
            // This handles both the new format and legacy format
            const profile = cleanedUserData.profile || {};
            
            // Prioritize direct properties over nested profile properties
            const firstName = cleanedUserData.firstName || profile.firstName || cleanedUserData.name.split(' ')[0];
            const lastName = cleanedUserData.lastName || profile.lastName || cleanedUserData.name.split(' ').slice(1).join(' ');
            const phoneNumber = cleanedUserData.phoneNumber || profile.phoneNumber;
            const address = cleanedUserData.address || profile.address;
            const dateOfBirth = cleanedUserData.dateOfBirth || profile.dateOfBirth;
            const gender = cleanedUserData.gender || profile.gender;
            const profileImage = cleanedUserData.profileImage || profile.profileImage;
            
            // Create new user with updated model structure
            const newUser = new User({
                email: cleanedUserData.email.toLowerCase(),
                password: hashedPassword, 
                name: cleanedUserData.name,
                firstName: firstName,
                lastName: lastName,
                role: cleanedUserData.role,
                phoneNumber: phoneNumber,
                address: address,
                dateOfBirth: dateOfBirth,
                gender: gender,
                profileImage: profileImage,
                isActive: true
            });

            // Save user with timeout protection
            try {
                await withTimeout(newUser.save(), 5000, 'User save timeout');
            } catch (saveError) {
                console.error('User save error:', saveError);
                return NextResponse.json(
                    { 
                        success: false,
                        error: 'Failed to create user', 
                        message: saveError.message,
                        diagnostics: {
                            errorType: 'database_save',
                            timestamp: new Date().toISOString()
                        }
                    },
                    { status: 500 }
                );
            }

            // Create role-specific profiles and medical file for patients
            let profileId = null;
            
            if (cleanedUserData.role === ROLES.PATIENT) {
                // Create medical file first
                const patientProfile = cleanedUserData.patientProfile || {};
                const medicalFile = new MedicalFile({
                    patientId: newUser._id,
                    status: 'active',
                    accessLog: [{
                        userId: newUser._id,
                        userName: newUser.name,
                        userRole: newUser.role,
                        action: 'Created',
                        details: 'Initial medical file created during registration',
                    }],
                });

                try {
                    await withTimeout(medicalFile.save(), 5000, 'Medical file save timeout');
                } catch (saveError) {
                    console.error('Medical file save error:', saveError);
                    // Continue with user creation even if medical file fails
                    // but log the error for debugging
                }
                
                // Create patient profile
                const patient = new Patient({
                    user: newUser._id,
                    medicalFile: medicalFile._id,
                    emergencyContact: patientProfile.emergencyContact
                });
                
                try {
                    await withTimeout(patient.save(), 5000, 'Patient profile save timeout');
                    profileId = patient._id;
                } catch (saveError) {
                    console.error('Patient profile save error:', saveError);
                    // Continue with user creation even if profile creation fails
                }
            } 
            else if (cleanedUserData.role === ROLES.DOCTOR) {
                // Create doctor profile
                const doctorProfile = cleanedUserData.doctorProfile || {};
                const doctor = new Doctor({
                    user: newUser._id,
                    medicalLicenseNumber: doctorProfile.licenseNumber,
                    specialty: doctorProfile.specialization,
                    experienceYears: doctorProfile.yearsOfExperience
                });
                
                try {
                    await withTimeout(doctor.save(), 5000, 'Doctor profile save timeout');
                    profileId = doctor._id;
                } catch (saveError) {
                    console.error('Doctor profile save error:', saveError);
                    // Continue with user creation even if profile creation fails
                }
            } 
            else if (cleanedUserData.role === ROLES.PHARMACIST && Pharmacist) {
                // Create pharmacist profile if model exists
                try {
                    const pharmacistProfile = cleanedUserData.pharmacistProfile || {};
                    const pharmacist = new Pharmacist({
                        user: newUser._id,
                        licenseNumber: pharmacistProfile.licenseNumber,
                        pharmacy: pharmacistProfile.pharmacy
                    });
                    
                    try {
                        await withTimeout(pharmacist.save(), 5000, 'Pharmacist profile save timeout');
                        profileId = pharmacist._id;
                    } catch (saveError) {
                        console.error('Pharmacist profile save error:', saveError);
                        // Continue with user creation even if profile creation fails
                    }
                } catch (error) {
                    console.error('Error creating pharmacist profile:', error);
                }
            }

            // Generate JWT token with additional profile information
            const payload = {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                profileId: profileId
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

            // Return user data and token with additional profile information
            return NextResponse.json(
                {
                    token,
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        role: newUser.role,
                        profileId: profileId
                    },
                },
                { status: 201 }
            );
        } catch (validationError) {
            console.error('Validation error:', validationError);
            return NextResponse.json(
                { error: 'Invalid data', details: validationError.errors },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
} 