import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Appointment from '@/lib/models/Appointment';
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

// GET /api/appointments
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
            // Patients can only see their own appointments
            query.patientId = user.id;
        } else if (user.role === 'doctor') {
            // Doctors can see appointments where they are the doctor
            query.doctorId = user.id;

            // Or appointments for a specific patient if patientId is provided
            const patientId = url.searchParams.get('patientId');
            if (patientId) {
                query = { patientId, doctorId: user.id };
            }
        } else if (user.role === 'admin') {
            // Admins can see all appointments or filter by various parameters
            const patientId = url.searchParams.get('patientId');
            const doctorId = url.searchParams.get('doctorId');
            const status = url.searchParams.get('status');

            if (patientId) query.patientId = patientId;
            if (doctorId) query.doctorId = doctorId;
            if (status) query.status = status;
        }

        // Date range filtering
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Handle pagination
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Get total count
        const total = await Appointment.countDocuments(query);

        // Execute query with pagination
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

// POST /api/appointments
export async function POST(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const data = await req.json();

        // Validate required fields
        if (!data.date || !data.startTime || !data.endTime || !data.type || !data.reasonForVisit) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: 'date, startTime, endTime, type, and reasonForVisit are required'
            }, { status: 400 });
        }

        // Determine patientId and doctorId based on role
        let { patientId, doctorId } = data;

        if (user.role === 'patient') {
            // Patients can create appointments for themselves with any doctor
            patientId = user.id;
            if (!doctorId) {
                return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
            }
        } else if (user.role === 'doctor') {
            // Doctors can create appointments for any patient with themselves
            doctorId = user.id;
            if (!patientId) {
                return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
            }
        } else if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized to create appointments' }, { status: 403 });
        } else {
            // Admins need to specify both patientId and doctorId
            if (!patientId || !doctorId) {
                return NextResponse.json({
                    error: 'Missing required fields',
                    details: 'patientId and doctorId are required for admin'
                }, { status: 400 });
            }
        }

        // Check for appointment conflicts
        const conflictQuery = {
            doctorId,
            date: new Date(data.date),
            $or: [
                // New appointment starts during an existing appointment
                {
                    startTime: { $lte: data.startTime },
                    endTime: { $gt: data.startTime }
                },
                // New appointment ends during an existing appointment
                {
                    startTime: { $lt: data.endTime },
                    endTime: { $gte: data.endTime }
                },
                // New appointment contains an existing appointment
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

        // Create appointment
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

// PATCH /api/appointments/{id}
export async function PATCH(req) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get appointment ID from URL
        const url = new URL(req.url);
        const paths = url.pathname.split('/');
        const appointmentId = paths[paths.length - 1];

        if (!appointmentId || appointmentId === 'appointments') {
            return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
        }

        await connectDB();
        const data = await req.json();

        // Find appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        // Check authorization
        if (user.role === 'patient') {
            // Patients can only update their own appointments and only certain fields
            if (appointment.patientId.toString() !== user.id) {
                return NextResponse.json({ error: 'Unauthorized to modify this appointment' }, { status: 403 });
            }

            // Patients can cancel appointments or update notes
            if (data.status === 'Cancelled') {
                await appointment.cancel(data.notes?.patient || 'Cancelled by patient');
            } else {
                // Patients can only update their notes and reason for visit
                if (data.notes?.patient) appointment.notes.patient = data.notes.patient;
                if (data.reasonForVisit) appointment.reasonForVisit = data.reasonForVisit;
                await appointment.save();
            }
        } else if (user.role === 'doctor') {
            // Doctors can only update appointments where they are the doctor
            if (appointment.doctorId.toString() !== user.id) {
                return NextResponse.json({ error: 'Unauthorized to modify this appointment' }, { status: 403 });
            }

            // Handle status changes
            if (data.status === 'Completed') {
                await appointment.complete(
                    data.diagnosis,
                    data.vitals,
                    data.followUp
                );
            } else if (data.status === 'Cancelled') {
                await appointment.cancel(data.notes?.doctor || 'Cancelled by doctor');
            } else {
                // Doctors can update most fields except patient notes
                const { notes, ...restData } = data;
                Object.assign(appointment, restData);

                // Update doctor notes separately to avoid overwriting patient notes
                if (notes?.doctor) appointment.notes.doctor = notes.doctor;

                await appointment.save();
            }
        } else if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized to modify appointments' }, { status: 403 });
        } else {
            // Admins can update any field
            // But we need to handle nested fields properly
            const { notes, diagnosis, vitals, followUp, ...restData } = data;

            Object.assign(appointment, restData);

            // Handle nested objects
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