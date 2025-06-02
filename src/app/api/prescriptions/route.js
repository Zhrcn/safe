// Use CommonJS imports for compatibility with Next.js 14.x
const { NextResponse } = require('next/server');
const { connectToDatabase } = require('@/lib/db/mongodb');
const Prescription = require('@/models/Prescription');
const User = require('@/models/User');
const { jwtDecode } = require('jwt-decode');

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

        await connectToDatabase();
        const url = new URL(req.url);

        let query = {};

        if (user.role === 'patient') {
            query.patientId = user.id;
        } else if (user.role === 'doctor') {
            query.doctorId = user.id;

            const patientId = url.searchParams.get('patientId');
            if (patientId) {
                query = { patientId };
            }
        } else if (user.role === 'pharmacist') {
            const patientId = url.searchParams.get('patientId');
            if (patientId) {
                query.patientId = patientId;
            }

            const status = url.searchParams.get('status');
            if (status) {
                query.status = status;
            }
        } else if (user.role === 'admin') {
            const patientId = url.searchParams.get('patientId');
            const doctorId = url.searchParams.get('doctorId');
            const status = url.searchParams.get('status');

            if (patientId) query.patientId = patientId;
            if (doctorId) query.doctorId = doctorId;
            if (status) query.status = status;
        }

        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const total = await Prescription.countDocuments(query);

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

export async function POST(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'doctor') {
            return NextResponse.json({ error: 'Only doctors can create prescriptions' }, { status: 403 });
        }

        await connectToDatabase();
        const data = await req.json();

        if (!data.patientId || !data.medications || !data.expiryDate) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: 'patientId, medications, and expiryDate are required'
            }, { status: 400 });
        }

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

export async function PATCH(req, { params }) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const paths = url.pathname.split('/');
        const prescriptionId = paths[paths.length - 1];

        if (!prescriptionId || prescriptionId === 'prescriptions') {
            return NextResponse.json({ error: 'Prescription ID is required' }, { status: 400 });
        }

        await connectToDatabase();
        const data = await req.json();

        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) {
            return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
        }

        if (user.role === 'doctor') {
            if (prescription.doctorId.toString() !== user.id) {
                return NextResponse.json({ error: 'Unauthorized to modify this prescription' }, { status: 403 });
            }

            delete data.filledBy;
            delete data.refillsUsed;
            delete data.refillHistory;

            Object.assign(prescription, data);
            await prescription.save();
        } else if (user.role === 'pharmacist') {
            if (data.status === 'Filled' || data.status === 'Cancelled') {
                if (data.status === 'Filled' && !prescription.canBeFilled()) {
                    return NextResponse.json({
                        error: 'Prescription cannot be filled',
                        details: 'It may be expired, already filled, or have no refills remaining'
                    }, { status: 400 });
                }

                if (data.status === 'Filled') {
                } else {
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
            Object.assign(prescription, data);
            await prescription.save();
        }

        return NextResponse.json(prescription);
    } catch (error) {
        console.error('Error updating prescription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 