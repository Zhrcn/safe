const { NextResponse } = require('next/server');
const jwt = require('jsonwebtoken');
const { connectToDatabase, withTimeout } = require('@/lib/db');
const User = require('@/models/User');
const Doctor = require('@/models/Doctor');
const Patient = require('@/models/Patient');
const Pharmacist = require('@/models/Pharmacist');
const { corsHeaders, handleCorsOptions, addCorsHeaders } = require('@/lib/cors');

const JWT_SECRET = process.env.JWT_SECRET || 'safe-medical-app-secret-key-for-development';

export async function OPTIONS() {
    return handleCorsOptions();
}

export async function GET(req) {
    console.log('Auth check API called');
    
    const diagnostics = {
        token_sources: [],
        cookie_present: false,
        header_present: false,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString()
    };

    try {
        const tokenCookie = req.cookies.get('safe_auth_token')?.value;
        if (tokenCookie) {
            diagnostics.token_sources.push('cookie');
            diagnostics.cookie_present = true;
            console.log('Token found in cookie');
        }
        
        const authHeader = req.headers.get('Authorization');
        diagnostics.header_present = !!authHeader;
        
        const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        if (headerToken) {
            diagnostics.token_sources.push('header');
            console.log('Token found in Authorization header');
        }
        
        const token = tokenCookie || headerToken;
        diagnostics.token_found = !!token;
        
        if (!token) {
            console.warn('No authentication token found in request');
            const response = NextResponse.json({ 
                authenticated: false, 
                error: 'No token provided',
                diagnostics: diagnostics
            }, { status: 401 });
            return addCorsHeaders(response);
        }
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            diagnostics.token_valid = true;
            diagnostics.token_expires = new Date(decoded.exp * 1000).toISOString();
            diagnostics.user_id = decoded.id || decoded.userId;
            diagnostics.role = decoded.role;
            
            console.log(`Token verified for user ID: ${diagnostics.user_id}, role: ${diagnostics.role}`);
            
            const dbTimeout = 5000; 
            
            try {
                await connectToDatabase();
                
                const user = await withTimeout(
                    User.findById(diagnostics.user_id),
                    dbTimeout,
                    'User lookup timeout'
                );
                
                if (!user) {
                    console.warn(`User not found in database: ${diagnostics.user_id}`);
                    const response = NextResponse.json({ 
                        authenticated: false, 
                        error: 'User not found',
                        diagnostics: diagnostics
                    }, { status: 401 });
                    return addCorsHeaders(response);
                }
                
                diagnostics.user_found = true;
                diagnostics.db_connected = true;
                
                let profileData = {};
                try {
                    if (user.role === 'doctor') {
                        const doctorProfile = await withTimeout(
                            Doctor.findOne({ user: user._id }),
                            dbTimeout,
                            'Doctor profile lookup timeout'
                        );
                        if (doctorProfile) {
                            profileData = {
                                specialty: doctorProfile.specialty || doctorProfile.specialization,
                                licenseNumber: doctorProfile.medicalLicenseNumber || doctorProfile.licenseNumber,
                                experience: doctorProfile.experienceYears || doctorProfile.experience,
                                profileId: doctorProfile._id
                            };
                        }
                    } else if (user.role === 'patient') {
                        const patientProfile = await withTimeout(
                            Patient.findOne({ user: user._id }),
                            dbTimeout,
                            'Patient profile lookup timeout'
                        );
                        if (patientProfile) {
                            profileData = {
                                bloodType: patientProfile.bloodType,
                                medicalFileId: patientProfile.medicalFile,
                                profileId: patientProfile._id
                            };
                        }
                    } else if (user.role === 'pharmacist') {
                        try {
                            const pharmacistProfile = await withTimeout(
                                Pharmacist.findOne({ user: user._id }),
                                dbTimeout,
                                'Pharmacist profile lookup timeout'
                            );
                            if (pharmacistProfile) {
                                profileData = {
                                    licenseNumber: pharmacistProfile.licenseNumber,
                                    pharmacy: pharmacistProfile.pharmacy,
                                    profileId: pharmacistProfile._id
                                };
                            }
                        } catch (pharmacistError) {
                            console.log('Pharmacist model not found or error fetching pharmacist profile, continuing with basic user data');
                            // Continue without pharmacist profile data
                        }
                    }
                } catch (profileError) {
                    console.error(`Error fetching ${user.role} profile:`, profileError);
                    // Continue without profile data if there's an error
                }
                
                // Return user data and token for client-side storage
                const response = NextResponse.json({
                    authenticated: true,
                    token: token, // Return the token so client can store it
                    user: {
                        id: user._id,
                        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                        profileImage: user.profileImage || user.avatar,
                        ...profileData
                    }
                });
                
                return addCorsHeaders(response);
            } catch (error) {
                console.error('Database query error:', error);
                diagnostics.error = error.message;
                const response = NextResponse.json({ 
                    authenticated: false, 
                    error: 'Database query error',
                    diagnostics: diagnostics
                }, { status: 500 });
                return addCorsHeaders(response);
            }
        } catch (error) {
            console.error('Token verification error:', error);
            diagnostics.token_error = error.message;
            diagnostics.error_type = error.name;
            
            const response = NextResponse.json({ 
                authenticated: false, 
                error: 'Invalid token',
                diagnostics: diagnostics
            }, { status: 401 });
            return addCorsHeaders(response);
        }
    } catch (error) {
        console.error('Auth check error:', error);
        
        // Add error details to diagnostics
        diagnostics.error = error.message;
        diagnostics.error_type = error.name;
        diagnostics.error_stack = process.env.NODE_ENV !== 'production' ? error.stack : undefined;
        
        const response = NextResponse.json({ 
            authenticated: false, 
            error: 'Server error during authentication check',
            diagnostics: diagnostics
        }, { 
            status: 500,
            headers: {
                'X-Error-Type': error.name || 'Unknown',
                'X-Error-Message': error.message || 'Unknown error',
            }
        });
        
        return addCorsHeaders(response);
    }
} 