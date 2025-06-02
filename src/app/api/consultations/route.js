// Use CommonJS imports for compatibility with Next.js 14.x
const { NextResponse } = require('next/server');
const { connectToDatabase } = require('@/lib/db/mongodb');
const Consultation = require('@/models/Consultation');
const { jwtDecode } = require('jwt-decode');
const { withTimeout } = require('@/lib/db/mongodb');

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
                query = { patientId, doctorId: user.id };
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

        const total = await withTimeout(
            Consultation.countDocuments(query),
            5000,
            'Database query timeout while counting consultations'
        );

        const consultations = await withTimeout(
            Consultation.find(query)
                .populate('patientId', 'name')
                .populate('doctorId', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            5000,
            'Database query timeout while fetching consultations'
        );

        return NextResponse.json({
            consultations,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        }, {
            headers: {
                'X-Data-Source': 'mongodb',
                'X-Response-Time': new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching consultations:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        }, { 
            status: 500,
            headers: {
                'X-Error-Type': error.code || 'UNKNOWN_ERROR',
                'X-Error-Time': new Date().toISOString()
            }
        });
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

        if (!data.reason || !data.preferredResponseTime) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: 'reason and preferredResponseTime are required'
            }, { status: 400 });
        }

        let { patientId, doctorId, attachments = [] } = data;

        // Set patient ID based on authenticated user if patient
        if (user.role === 'patient') {
            patientId = user.id;
            if (!doctorId) {
                return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
            }
        } else if (user.role === 'doctor') {
            doctorId = user.id;
            if (!patientId) {
                return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
            }
        } else if (!patientId || !doctorId) {
            return NextResponse.json({ 
                error: 'Missing required fields',
                details: 'patientId and doctorId are required'
            }, { status: 400 });
        }

        // Create initial message if provided
        const messages = [];
        if (data.initialMessage) {
            messages.push({
                sender: user.role === 'patient' ? patientId : doctorId,
                content: data.initialMessage,
                timestamp: new Date(),
                attachments: []
            });
        }

        const consultation = new Consultation({
            patientId,
            doctorId,
            reason: data.reason,
            preferredResponseTime: data.preferredResponseTime,
            status: 'pending',
            attachments,
            messages
        });

        await consultation.save();

        return NextResponse.json(consultation, { 
            status: 201,
            headers: {
                'X-Data-Source': 'mongodb',
                'X-Response-Time': new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error creating consultation:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        }, { 
            status: 500,
            headers: {
                'X-Error-Type': error.code || 'UNKNOWN_ERROR',
                'X-Error-Time': new Date().toISOString()
            }
        });
    }
}

export async function PATCH(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const paths = url.pathname.split('/');
        const consultationId = paths[paths.length - 1];

        if (!consultationId || consultationId === 'consultations') {
            return NextResponse.json({ error: 'Consultation ID is required' }, { status: 400 });
        }

        await connectToDatabase();
        const data = await req.json();

        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
            return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
        }

        // Check authorization based on role
        if (user.role === 'patient' && consultation.patientId.toString() !== user.id) {
            return NextResponse.json({ error: 'Unauthorized to modify this consultation' }, { status: 403 });
        } else if (user.role === 'doctor' && consultation.doctorId.toString() !== user.id) {
            return NextResponse.json({ error: 'Unauthorized to modify this consultation' }, { status: 403 });
        }

        // Handle status updates
        if (data.status) {
            consultation.status = data.status;
        }

        // Handle new messages
        if (data.newMessage) {
            consultation.messages.push({
                sender: user.id,
                content: data.newMessage,
                timestamp: new Date(),
                attachments: data.attachments || []
            });
        }

        // Add new attachments to the consultation
        if (data.attachments && data.attachments.length > 0) {
            consultation.attachments = [
                ...consultation.attachments,
                ...data.attachments
            ];
        }

        await consultation.save();

        return NextResponse.json(consultation, {
            headers: {
                'X-Data-Source': 'mongodb',
                'X-Response-Time': new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error updating consultation:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        }, { 
            status: 500,
            headers: {
                'X-Error-Type': error.code || 'UNKNOWN_ERROR',
                'X-Error-Time': new Date().toISOString()
            }
        });
    }
}
