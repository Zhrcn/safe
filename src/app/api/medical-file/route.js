import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import MedicalFile from '@/models/MedicalFile';
import User from '@/models/User';
import { jwtDecode } from 'jwt-decode';

export const dynamic = 'force-dynamic';

async function getAuthenticatedUser(req) {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];

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

export async function GET(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        let patientId = user.role === 'patient' ? user.id : null;

        if (!patientId) {
            const url = new URL(req.url);
            patientId = url.searchParams.get('patientId');

            if (!patientId) {
                return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
            }

            if (!['doctor', 'pharmacist', 'admin'].includes(user.role)) {
                return NextResponse.json({ error: 'Unauthorized to access this medical file' }, { status: 403 });
            }
        }

        const medicalFile = await MedicalFile.findOne({ patientId })
            .populate('conditions.diagnosedBy', 'name')
            .populate('procedures.performedBy', 'name')
            .populate('immunizations.administeredBy', 'name');

        if (!medicalFile) {
            return NextResponse.json({ error: 'Medical file not found' }, { status: 404 });
        }

        await logAccess(medicalFile._id, user.id, 'view');

        return NextResponse.json(medicalFile);
    } catch (error) {
        console.error('Error fetching medical file:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const data = await req.json();

        const patientId = data.patientId || (user.role === 'patient' ? user.id : null);

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        if (user.role !== 'admin' && user.role !== 'doctor' && user.id !== patientId) {
            return NextResponse.json({ error: 'Unauthorized to create this medical file' }, { status: 403 });
        }

        const existingFile = await MedicalFile.findOne({ patientId });
        if (existingFile) {
            return NextResponse.json({ error: 'Medical file already exists for this patient' }, { status: 409 });
        }

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

export async function PATCH(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const data = await req.json();

        const url = new URL(req.url);
        let patientId = url.searchParams.get('patientId') || (user.role === 'patient' ? user.id : null);

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        if (user.role !== 'admin' && user.role !== 'doctor' && user.id !== patientId) {
            return NextResponse.json({ error: 'Unauthorized to update this medical file' }, { status: 403 });
        }

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

        await logAccess(medicalFile._id, user.id, 'update');

        return NextResponse.json(medicalFile);
    } catch (error) {
        console.error('Error updating medical file:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 