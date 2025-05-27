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