const { NextResponse } = require('next/server');
const { connectToDatabase, withTimeout } = require('@/lib/db');
const Appointment = require('@/models/Appointment');
const User = require('@/models/User'); 
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 

const JWT_SECRET = process.env.JWT_SECRET || 'safe-medical-app-secret-key-for-development';

async function getAuthenticatedUser(req) {
    const token = req.cookies.get('safe_auth_token')?.value || req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
        console.log('No token found in request');
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token verified successfully in appointments API:', JSON.stringify(decoded, null, 2));
        return decoded;
    } catch (error) {
        console.error('Authentication error in appointments API:', error.message);
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

        const userId = user.userId || user.id;
        if (!userId) {
            console.error('User ID not found in token');
            return NextResponse.json({ error: 'Invalid token - missing user ID' }, { status: 401 });
        }
        
        if (user.role === 'patient') {
            query.patientId = userId;
        } else if (user.role === 'doctor') {
            query.doctorId = userId;

            const patientId = url.searchParams.get('patientId');
            if (patientId) {
                query = { patientId, doctorId: userId };
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
        console.log('Starting appointment creation...');
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log('User authenticated:', user);

        await connectToDatabase();
        const data = await req.json();
        console.log('Received appointment data:', data);

        const requestedDoctorId = data.doctorId || data.doctor_id;
        const reason = data.reason;

        if (!requestedDoctorId || !reason) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: 'doctorId and reason are required'
            }, { status: 400 });
        }

        if (user.role !== 'patient') {
            return NextResponse.json({
                error: 'Unauthorized',
                details: 'Only patients can create appointments'
            }, { status: 403 });
        }

        const patientId = user._id;

        let doctorId;
        
        if (mongoose.Types.ObjectId.isValid(requestedDoctorId)) {
            doctorId = new mongoose.Types.ObjectId(requestedDoctorId);
        } 
        else if (!isNaN(requestedDoctorId)) {
            const doctor = await User.findOne({ 
                role: 'doctor',
                $or: [
                    { doctorId: parseInt(requestedDoctorId) },
                    { _id: requestedDoctorId }
                ]
            }).select('_id');
            
            if (!doctor) {
                return NextResponse.json({
                    error: 'Invalid doctor',
                    details: 'Doctor not found or inactive'
                }, { status: 400 });
            }
            doctorId = doctor._id;
        }
        
        if (!doctorId) {
            return NextResponse.json({
                error: 'Invalid doctor',
                details: 'Could not find doctor with the provided ID'
            }, { status: 400 });
        }
        const doctor = await User.findOne({ 
            _id: doctorId, 
            role: 'doctor', 
            status: 'active' 
        });

        if (!doctor) {
            console.log('Doctor not found:', requestedDoctorId);
            return NextResponse.json({
                error: 'Invalid doctor',
                details: 'Doctor not found or inactive'
            }, { status: 400 });
        }

        const existingAppointment = await Appointment.findOne({
            patientId,
            doctorId: doctorId,
            status: { $in: ['pending', 'scheduled'] }
        });

        if (existingAppointment) {
            console.log('Existing appointment found:', existingAppointment);
            return NextResponse.json({
                error: 'Appointment exists',
                details: 'You already have a pending or scheduled appointment with this doctor'
            }, { status: 409 });
        }

        const appointment = new Appointment({
            patientId,
            doctorId: doctorId,
            reason: reason,
            preferredTimeSlot: data.time_slot || data.timeSlot || 'any',
            status: 'pending',
            notes: data.notes || '',
            followUp: data.followUp || false
        });

        console.log('Created appointment object:', appointment);
        
        await appointment.save();
        console.log('Appointment saved successfully');
        return NextResponse.json(appointment, { status: 201 });
    } catch (error) {
        console.error('Error creating appointment:', error);
        let statusCode = 500;
        let errorMessage = 'Internal server error';
        
        if (error.name === 'ValidationError') {
            statusCode = 400;
            errorMessage = error.message;
        } else if (error.code === 11000) {
            statusCode = 409;
            errorMessage = 'Duplicate appointment request';
        }
        
        return NextResponse.json({ 
            error: errorMessage,
            details: error.message 
        }, { status: statusCode });
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