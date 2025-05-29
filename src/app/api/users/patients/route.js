import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { jwtDecode } from 'jwt-decode';

// Helper function to get authenticated user from request
async function getAuthenticatedUser(req) {
    // Changed to only use Authorization header to avoid cookies usage
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];

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

// Export configuration to mark this route as dynamic
export const dynamic = 'force-dynamic';

// GET /api/users/patients
export async function GET(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only doctors, pharmacists, and admins can access patient list
        if (!['doctor', 'pharmacist', 'admin'].includes(user.role)) {
            return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
        }

        await connectDB();
        const url = new URL(req.url);

        // Parse query parameters
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const searchTerm = url.searchParams.get('search');

        // Build query - only fetch patients
        let query = { role: 'patient' };

        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with pagination
        const total = await User.countDocuments(query);
        const patients = await User.find(query)
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        // Optionally populate medical files if requested
        if (url.searchParams.get('includeFiles') === 'true') {
            await User.populate(patients, {
                path: 'medicalFile',
                select: 'bloodType conditions allergies lastUpdated'
            });
        }

        return NextResponse.json({
            patients,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 