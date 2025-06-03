import { connectToDatabase, withTimeout } from '@/lib/db';
import User from '@/models/User';
import Patient from '@/models/Patient';
import Doctor from '@/models/Doctor';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'safe-medical-app-secret-key-for-development';


async function getAuthenticatedUser(req) {
    const token = req.cookies.get('safe_auth_token')?.value || req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
        console.log('No token found in request');
        return null;
    }

    try {
        // Properly verify the token signature
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token verified successfully:', JSON.stringify(decoded, null, 2));
        return decoded;
    } catch (error) {
        console.error('Authentication error:', error.message);
        return null;
    }
}


function createApiResponse(data, status = 200, headers = {}) {
    return {
        ...data,
        status,
        headers: {
            'x-api-version': '1.0',
            'x-data-source': 'mongodb',
            ...headers
        }
    };
}


async function getDoctorPatients(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return createApiResponse(
                { success: false, error: 'Unauthorized' },
                401,
                { 'x-error-type': 'auth_error' }
            );
        }

        if (user.role !== 'doctor') {
            return createApiResponse(
                { success: false, error: 'Forbidden: Doctor access only' },
                403,
                { 'x-error-type': 'permission_error' }
            );
        }

        try {
            await connectToDatabase();
        } catch (dbError) {
            console.error('Database connection error:', dbError);
            return createApiResponse(
                { success: false, error: 'Database connection error', message: dbError.message },
                500,
                { 'x-error-type': 'db_error' }
            );
        }

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const searchTerm = url.searchParams.get('search');

        
        let patients = [];
        let total = 0;
        let dataSource = 'user_model';
        
        try {
            
            let doctorPatientIds = [];
            try {
                // Handle both id and userId in token payload for backward compatibility
                const userId = user.userId || user.id;
                if (!userId) {
                    throw new Error('User ID not found in token');
                }
                
                console.log(`Looking up doctor profile for user ID: ${userId}`);
                
                const doctorProfile = await withTimeout(
                    Doctor.findOne({ user: userId })
                        .select('patientsList'),
                    5000,
                    'Doctor profile query timeout'
                );
                
                if (doctorProfile && doctorProfile.patientsList && doctorProfile.patientsList.length > 0) {
                    doctorPatientIds = doctorProfile.patientsList;
                }
            } catch (error) {
                console.error('Error fetching doctor profile:', error);
            }
            
            let query = {
                role: 'patient'
            };
            
            if (doctorPatientIds.length > 0) {
                query._id = { $in: doctorPatientIds };
            }

            if (searchTerm) {
                query.$or = [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } },
                    { firstName: { $regex: searchTerm, $options: 'i' } },
                    { lastName: { $regex: searchTerm, $options: 'i' } }
                ];
            }

            const skip = (page - 1) * limit;

            
            total = await withTimeout(
                User.countDocuments(query),
                5000,
                'Patient count query timeout'
            );
            
            patients = await withTimeout(
                User.find(query)
                    .select('name email firstName lastName patientProfile dateOfBirth gender')
                    .sort({ name: 1, lastName: 1 })
                    .skip(skip)
                    .limit(limit),
                5000,
                'Patient query timeout'
            );
            
            
            if (patients.length === 0) {
                throw new Error('No patients found with first approach, trying alternative');
            }
        } catch (error) {
            console.log('First query approach failed, trying alternative:', error.message);
            
            try {
                
                dataSource = 'patient_model';
                
                let patientQuery = {
                    doctorsList: user.id
                };
                
                if (doctorPatientIds.length > 0) {
                    patientQuery = {
                        $or: [
                            { doctorsList: user.id },
                            { user: { $in: doctorPatientIds } }
                        ]
                    };
                }
                
                if (searchTerm) {
                    
                    const userIds = await withTimeout(
                        User.find({
                            $or: [
                                { name: { $regex: searchTerm, $options: 'i' } },
                                { email: { $regex: searchTerm, $options: 'i' } },
                                { firstName: { $regex: searchTerm, $options: 'i' } },
                                { lastName: { $regex: searchTerm, $options: 'i' } }
                            ]
                        }).select('_id'),
                        5000,
                        'User search query timeout'
                    );
                    
                    patientQuery.user = { $in: userIds.map(u => u._id) };
                }
                
                const skip = (page - 1) * limit;
                
                total = await withTimeout(
                    Patient.countDocuments(patientQuery),
                    5000,
                    'Patient count query timeout'
                );
                
                const patientDocs = await withTimeout(
                    Patient.find(patientQuery)
                        .populate('user', 'name email firstName lastName dateOfBirth gender')
                        .sort({ 'user.name': 1, 'user.lastName': 1 })
                        .skip(skip)
                        .limit(limit),
                    5000,
                    'Patient query timeout'
                );
                
                
                patients = patientDocs.map(patient => {
                    if (!patient.user) return null;
                    
                    return {
                        _id: patient.user._id,
                        name: patient.user.name || `${patient.user.firstName || ''} ${patient.user.lastName || ''}`.trim(),
                        email: patient.user.email,
                        firstName: patient.user.firstName,
                        lastName: patient.user.lastName,
                        dateOfBirth: patient.user.dateOfBirth,
                        gender: patient.user.gender,
                        patientProfile: {
                            age: patient.age,
                            gender: patient.gender || patient.user.gender,
                            condition: patient.medicalHistory?.[0]?.condition,
                            status: patient.status || 'Active',
                            lastAppointment: patient.lastAppointment,
                            medicalId: patient.medicalId
                        }
                    };
                }).filter(Boolean);
            } catch (secondError) {
                console.error('Both query approaches failed:', secondError);
                
                dataSource = 'fallback';
            }
        }

        
        const formattedPatients = patients.map(patient => {
            
            let age = 'N/A';
            if (patient.dateOfBirth) {
                const birthDate = new Date(patient.dateOfBirth);
                const today = new Date();
                age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
            }
            
            
            const patientName = patient.name || 
                `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 
                'Unknown Patient';
            
            return {
                id: patient._id.toString(),
                name: patientName,
                email: patient.email || 'No email',
                age: patient.patientProfile?.age || age || 'N/A',
                gender: patient.patientProfile?.gender || patient.gender || 'N/A',
                condition: patient.patientProfile?.condition || 'N/A',
                status: patient.patientProfile?.status || 'Active',
                lastAppointment: patient.patientProfile?.lastAppointment || 'N/A',
                medicalId: patient.patientProfile?.medicalId || `MID${patient._id.toString().slice(-5)}`
            };
        });

        return createApiResponse(
            {
                success: true,
                patients: formattedPatients,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            },
            200,
            { 'x-data-source': dataSource, 'x-data-completeness': 'full' }
        );
    } catch (error) {
        console.error('Error fetching doctor patients:', error);
        return createApiResponse(
            { success: false, error: 'Internal server error', message: error.message },
            500,
            { 'x-error-type': 'server_error' }
        );
    }
}

export {
    getDoctorPatients,
    getAuthenticatedUser,
    createApiResponse
};
