// Use CommonJS imports for compatibility with Next.js 14.x
const { NextResponse } = require('next/server');
const { connectToDatabase } = require('@/lib/db/mongodb');
const Appointment = require('@/models/Appointment');
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
                query = { patientId, doctorId: user.id };
            }
        } else if (user.role === 'admin') {
            const patientId = url.searchParams.get('patientId');
            const doctorId = url.searchParams.get('doctorId');
            const status = url.searchParams.get('status');

            if (patientId) query.patientId = patientId;
            if (doctorId) query.doctorId = doctorId;
            if (status) query.status = status;
        }        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const total = await Appointment.countDocuments(query);

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name')
            .populate('doctorId', 'name')
            .sort({ date: 1, startTime: 1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            appointments,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
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

        if (!data.date || !data.startTime || !data.endTime || !data.type || !data.reasonForVisit) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: 'date, startTime, endTime, type, and reasonForVisit are required'
            }, { status: 400 });
        }

        let { patientId, doctorId } = data;

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
        } else if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized to create appointments' }, { status: 403 });
        } else {
            if (!patientId || !doctorId) {
                return NextResponse.json({
                    error: 'Missing required fields',
                    details: 'patientId and doctorId are required for admin'
                }, { status: 400 });
            }
        }

        const conflictQuery = {
            doctorId,
            date: new Date(data.date),
            $or: [
                {
                    startTime: { $lte: data.startTime },
                    endTime: { $gt: data.startTime }
                },
                {
                    startTime: { $lt: data.endTime },
                    endTime: { $gte: data.endTime }
                },
                {
                    startTime: { $gte: data.startTime },
                    endTime: { $lte: data.endTime }
                }
            ]
        };

        const conflictingAppointment = await Appointment.findOne(conflictQuery);

        if (conflictingAppointment) {
            return NextResponse.json({
                error: 'Appointment time conflict',
                details: 'The doctor already has an appointment during this time'
            }, { status: 409 });
        }

        const appointment = new Appointment({
            ...data,
            patientId,
            doctorId,
            date: new Date(data.date)
        });

        await appointment.save();

        return NextResponse.json(appointment, { status: 201 });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
        const appointmentId = paths[paths.length - 1];

        if (!appointmentId || appointmentId === 'appointments') {
            return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
        }

        await connectToDatabase();
        const data = await req.json();

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        if (user.role === 'patient') {
            if (appointment.patientId.toString() !== user.id) {
                return NextResponse.json({ error: 'Unauthorized to modify this appointment' }, { status: 403 });
            }

            if (data.status === 'Cancelled') {
                await appointment.cancel(data.notes?.patient || 'Cancelled by patient');
            } else {
                if (data.notes?.patient) appointment.notes.patient = data.notes.patient;
                if (data.reasonForVisit) appointment.reasonForVisit = data.reasonForVisit;
                await appointment.save();
            }
        } else if (user.role === 'doctor') {
            if (appointment.doctorId.toString() !== user.id) {
                return NextResponse.json({ error: 'Unauthorized to modify this appointment' }, { status: 403 });
            }

            if (data.status === 'Completed') {
                await appointment.complete(
                    data.diagnosis,
                    data.vitals,
                    data.followUp
                );
            } else if (data.status === 'Cancelled') {
                await appointment.cancel(data.notes?.doctor || 'Cancelled by doctor');
            } else {
                const { notes, ...restData } = data;
                Object.assign(appointment, restData);

                if (notes?.doctor) appointment.notes.doctor = notes.doctor;

                await appointment.save();
            }
        } else if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized to modify appointments' }, { status: 403 });
        } else {
            const { notes, diagnosis, vitals, followUp, ...restData } = data;

            Object.assign(appointment, restData);

            if (notes) {
                appointment.notes = { ...appointment.notes, ...notes };
            }

            if (diagnosis) {
                appointment.diagnosis = { ...appointment.diagnosis, ...diagnosis };
            }

            if (vitals) {
                appointment.vitals = { ...appointment.vitals, ...vitals };
            }

            if (followUp) {
                appointment.followUp = { ...appointment.followUp, ...followUp };
            }

            await appointment.save();
        }

        return NextResponse.json(appointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 