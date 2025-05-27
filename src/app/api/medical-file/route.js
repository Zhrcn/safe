import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import MedicalFile from '@/lib/models/MedicalFile';
import { jwtDecode } from 'jwt-decode';

// Helper function to get the authenticated user from the request
async function getAuthenticatedUser(req) {
    const token = req.cookies.get('safe_auth_token')?.value || req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
        return null;
    }

    try {
        // Verify JWT token
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

// Helper function to log access
async function logAccess(fileId, userId, action) {
    await MedicalFile.findByIdAndUpdate(fileId, {
        $push: {
            accessLog: {
                accessedBy: userId,
                action,
                accessDate: new Date()
            }
        },
        lastUpdated: new Date()
    });
}

// GET /api/medical-file
export async function GET(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Get patientId from query params or use the authenticated user's ID if they're a patient
        let patientId = user.role === 'patient' ? user.id : null;

        // If user is not a patient, check if they're authorized to access another patient's file
        if (!patientId) {
            const url = new URL(req.url);
            patientId = url.searchParams.get('patientId');

            if (!patientId) {
                return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
            }

            // Only doctors, pharmacists, and admins can access other patients' files
            if (!['doctor', 'pharmacist', 'admin'].includes(user.role)) {
                return NextResponse.json({ error: 'Unauthorized to access this medical file' }, { status: 403 });
            }
        }

        // Find medical file by patientId
        const medicalFile = await MedicalFile.findOne({ patientId })
            .populate('conditions.diagnosedBy', 'name')
            .populate('procedures.performedBy', 'name')
            .populate('immunizations.administeredBy', 'name');

        if (!medicalFile) {
            return NextResponse.json({ error: 'Medical file not found' }, { status: 404 });
        }

        // Log the access
        await logAccess(medicalFile._id, user.id, 'view');

        return NextResponse.json(medicalFile);
    } catch (error) {
        console.error('Error fetching medical file:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/medical-file
export async function POST(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const data = await req.json();

        // Determine patientId - either from request body or from the authenticated user if they're a patient
        const patientId = data.patientId || (user.role === 'patient' ? user.id : null);

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        // Check if user is authorized to create a medical file
        if (user.role !== 'admin' && user.role !== 'doctor' && user.id !== patientId) {
            return NextResponse.json({ error: 'Unauthorized to create this medical file' }, { status: 403 });
        }

        // Check if medical file already exists for this patient
        const existingFile = await MedicalFile.findOne({ patientId });
        if (existingFile) {
            return NextResponse.json({ error: 'Medical file already exists for this patient' }, { status: 409 });
        }

        // Create new medical file
        const medicalFile = new MedicalFile({
            patientId,
            ...data,
            accessLog: [{
                accessedBy: user.id,
                action: 'create',
                accessDate: new Date()
            }]
        });

        await medicalFile.save();

        return NextResponse.json(medicalFile, { status: 201 });
    } catch (error) {
        console.error('Error creating medical file:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/medical-file
export async function PATCH(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const data = await req.json();

        // Get patientId from query params or use the authenticated user's ID if they're a patient
        const url = new URL(req.url);
        let patientId = url.searchParams.get('patientId') || (user.role === 'patient' ? user.id : null);

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        // Check authorization for updating medical file
        if (user.role !== 'admin' && user.role !== 'doctor' && user.id !== patientId) {
            return NextResponse.json({ error: 'Unauthorized to update this medical file' }, { status: 403 });
        }

        // Find and update the medical file
        const medicalFile = await MedicalFile.findOneAndUpdate(
            { patientId },
            {
                $set: data,
                lastUpdated: new Date()
            },
            { new: true }
        );

        if (!medicalFile) {
            return NextResponse.json({ error: 'Medical file not found' }, { status: 404 });
        }

        // Log the update access
        await logAccess(medicalFile._id, user.id, 'update');

        return NextResponse.json(medicalFile);
    } catch (error) {
        console.error('Error updating medical file:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 