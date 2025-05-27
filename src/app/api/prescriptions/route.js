import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Prescription from '@/lib/models/Prescription';
import { jwtDecode } from 'jwt-decode';

// Helper function to get the authenticated user from the request
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

// GET /api/prescriptions
export async function GET(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const url = new URL(req.url);

        // Handle different roles
        let query = {};

        if (user.role === 'patient') {
            // Patients can only see their own prescriptions
            query.patientId = user.id;
        } else if (user.role === 'doctor') {
            // Doctors can see prescriptions they created
            query.doctorId = user.id;

            // Or prescriptions for a specific patient if patientId is provided
            const patientId = url.searchParams.get('patientId');
            if (patientId) {
                query = { patientId };
            }
        } else if (user.role === 'pharmacist') {
            // Pharmacists can see all prescriptions or filter by patient
            const patientId = url.searchParams.get('patientId');
            if (patientId) {
                query.patientId = patientId;
            }

            // Or by status
            const status = url.searchParams.get('status');
            if (status) {
                query.status = status;
            }
        } else if (user.role === 'admin') {
            // Admins can see all prescriptions or filter by various parameters
            const patientId = url.searchParams.get('patientId');
            const doctorId = url.searchParams.get('doctorId');
            const status = url.searchParams.get('status');

            if (patientId) query.patientId = patientId;
            if (doctorId) query.doctorId = doctorId;
            if (status) query.status = status;
        }

        // Handle pagination
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Get total count
        const total = await Prescription.countDocuments(query);

        // Execute query with pagination
        const prescriptions = await Prescription.find(query)
            .populate('patientId', 'name')
            .populate('doctorId', 'name')
            .populate('filledBy.pharmacistId', 'name')
            .sort({ issueDate: -1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            prescriptions,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/prescriptions
export async function POST(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only doctors can create prescriptions
        if (user.role !== 'doctor') {
            return NextResponse.json({ error: 'Only doctors can create prescriptions' }, { status: 403 });
        }

        await connectDB();
        const data = await req.json();

        // Validate required fields
        if (!data.patientId || !data.medications || !data.expiryDate) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: 'patientId, medications, and expiryDate are required'
            }, { status: 400 });
        }

        // Create prescription
        const prescription = new Prescription({
            ...data,
            doctorId: user.id,
            issueDate: new Date(),
        });

        await prescription.save();

        return NextResponse.json(prescription, { status: 201 });
    } catch (error) {
        console.error('Error creating prescription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/prescriptions/{id}
export async function PATCH(req, { params }) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get prescription ID from URL
        const url = new URL(req.url);
        const paths = url.pathname.split('/');
        const prescriptionId = paths[paths.length - 1];

        if (!prescriptionId || prescriptionId === 'prescriptions') {
            return NextResponse.json({ error: 'Prescription ID is required' }, { status: 400 });
        }

        await connectDB();
        const data = await req.json();

        // Find prescription
        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) {
            return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
        }

        // Check authorization
        if (user.role === 'doctor') {
            // Doctors can only update their own prescriptions
            if (prescription.doctorId.toString() !== user.id) {
                return NextResponse.json({ error: 'Unauthorized to modify this prescription' }, { status: 403 });
            }

            // Doctors can update most fields except filling information
            delete data.filledBy;
            delete data.refillsUsed;
            delete data.refillHistory;

            // Update prescription
            Object.assign(prescription, data);
            await prescription.save();
        } else if (user.role === 'pharmacist') {
            // Pharmacists can only update filling information
            if (data.status === 'Filled' || data.status === 'Cancelled') {
                // Check if prescription can be filled
                if (data.status === 'Filled' && !prescription.canBeFilled()) {
                    return NextResponse.json({
                        error: 'Prescription cannot be filled',
                        details: 'It may be expired, already filled, or have no refills remaining'
                    }, { status: 400 });
                }

                if (data.status === 'Filled') {
                    // Fill prescription
                    await prescription.fill(user.id, data.notes || '');
                } else {
                    // Cancel prescription
                    prescription.status = 'Cancelled';
                    await prescription.save();
                }
            } else {
                return NextResponse.json({
                    error: 'Pharmacists can only fill or cancel prescriptions'
                }, { status: 403 });
            }
        } else if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized to modify prescriptions' }, { status: 403 });
        } else {
            // Admins can update any field
            Object.assign(prescription, data);
            await prescription.save();
        }

        return NextResponse.json(prescription);
    } catch (error) {
        console.error('Error updating prescription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 