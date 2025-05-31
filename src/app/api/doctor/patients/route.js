import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/models/User';
import { jwtDecode } from 'jwt-decode';

export const dynamic = 'force-dynamic';

async function getAuthenticatedUser(req) {
    const token = req.cookies.get('safe_auth_token')?.value || req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);

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

export async function GET(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'doctor') {
            return NextResponse.json({ error: 'Forbidden: Doctor access only' }, { status: 403 });
        }

        await connectToDatabase();
        const url = new URL(req.url);

        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const searchTerm = url.searchParams.get('search');

        let query = {
            role: 'patient',
            'patientProfile.doctors': user.id
        };

        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const total = await User.countDocuments(query);
        const patients = await User.find(query)
            .select('name email patientProfile')
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        // Format patient data for the response
        const formattedPatients = patients.map(patient => ({
            id: patient._id,
            name: patient.name,
            email: patient.email,
            age: patient.patientProfile?.age || 'N/A',
            gender: patient.patientProfile?.gender || 'N/A',
            condition: patient.patientProfile?.condition || 'N/A',
            status: patient.patientProfile?.status || 'Active',
            lastAppointment: patient.patientProfile?.lastAppointment || 'N/A',
            medicalId: patient.patientProfile?.medicalId || `MID${patient._id.toString().slice(-5)}`
        }));

        return NextResponse.json({
            patients: formattedPatients,
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