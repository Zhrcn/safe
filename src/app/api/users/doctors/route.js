import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { jwtDecode } from 'jwt-decode';

// Helper function to get authenticated user from request
async function getAuthenticatedUser(req) {
    const token = req.cookies.get('safe_auth_token')?.value || req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
}

// GET /api/users/doctors
export async function GET(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const url = new URL(req.url);

        // Check if this is a request for a specific doctor
        const doctorId = url.searchParams.get('id');
        if (doctorId) {
            const doctor = await User.findOne({
                _id: doctorId,
                role: 'doctor'
            }).select('-password -resetPasswordToken -resetPasswordExpires');

            if (!doctor) {
                return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
            }

            return NextResponse.json({ doctor });
        }

        // Parse query parameters
        const specialization = url.searchParams.get('specialization');
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const searchTerm = url.searchParams.get('search');

        // Build query - only fetch doctors
        let query = { role: 'doctor' };

        if (specialization) {
            query['doctorProfile.specialization'] = specialization;
        }

        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { 'doctorProfile.specialization': { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with pagination
        const total = await User.countDocuments(query);
        const doctors = await User.find(query)
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            doctors,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/users/doctors
export async function POST(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
        }

        await connectDB();
        const data = await req.json();

        // Validate required fields
        if (!data.name || !data.email || !data.password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if doctor with email already exists
        const existingDoctor = await User.findOne({ email: data.email });
        if (existingDoctor) {
            return NextResponse.json({ error: 'Doctor with this email already exists' }, { status: 409 });
        }

        // Create new doctor
        const newDoctor = new User({
            name: data.name,
            email: data.email,
            password: data.password, // This should be hashed in the model pre-save hook
            role: 'doctor',
            doctorProfile: {
                specialization: data.specialization || 'General Practice',
                licenseNumber: data.licenseNumber,
                education: data.education || [],
                experience: data.experience || []
            }
        });

        await newDoctor.save();

        // Return doctor without sensitive information
        const doctorToReturn = newDoctor.toObject();
        delete doctorToReturn.password;
        delete doctorToReturn.resetPasswordToken;
        delete doctorToReturn.resetPasswordExpires;

        return NextResponse.json({
            message: 'Doctor created successfully',
            doctor: doctorToReturn
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating doctor:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/users/doctors
export async function PATCH(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const data = await req.json();
        const doctorId = data.id;

        // Check permissions - only admin or the doctor themselves can update
        if (user.role !== 'admin' && user.id !== doctorId) {
            return NextResponse.json({ error: 'Unauthorized - Insufficient permissions' }, { status: 403 });
        }

        // Find doctor
        const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
        if (!doctor) {
            return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }

        // Update allowed fields
        if (data.name) doctor.name = data.name;
        if (data.email) doctor.email = data.email;
        if (data.specialization) doctor.doctorProfile.specialization = data.specialization;
        if (data.licenseNumber) doctor.doctorProfile.licenseNumber = data.licenseNumber;
        if (data.education) doctor.doctorProfile.education = data.education;
        if (data.experience) doctor.doctorProfile.experience = data.experience;

        await doctor.save();

        // Return updated doctor without sensitive information
        const updatedDoctor = doctor.toObject();
        delete updatedDoctor.password;
        delete updatedDoctor.resetPasswordToken;
        delete updatedDoctor.resetPasswordExpires;

        return NextResponse.json({
            message: 'Doctor updated successfully',
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error('Error updating doctor:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 