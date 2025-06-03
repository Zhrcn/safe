const { NextResponse } = require('next/server');
const { connectToDatabase, withTimeout } = require('@/lib/db');
const Appointment = require('@/models/Appointment');
<<<<<<< HEAD
const User = require('@/models/User'); 
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 

const JWT_SECRET = process.env.JWT_SECRET || 'safe-medical-app-secret-key-for-development';
=======
const User = require('@/models/User');
const { jwtDecode } = require('jwt-decode');
const mongoose = require('mongoose');
>>>>>>> 74f7c7b293c98eceffe8125840281c637782687e

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

        try {
            await connectToDatabase();
            console.log('Connected to database for appointments fetch');
        } catch (dbError) {
            console.error('MongoDB Atlas connection error in appointments API:', dbError);


            if (dbError.message.includes('IP address is not whitelisted') ||
                dbError.message.includes('Could not connect to any servers')) {
                return NextResponse.json({
                    error: 'MongoDB Atlas IP whitelist error',
                    details: 'Your IP address is not whitelisted in MongoDB Atlas',
                    solution: 'Go to MongoDB Atlas dashboard > Network Access and add your current IP address'
                }, { status: 503 });
            }

            return NextResponse.json({
                error: 'Database connection failed',
                details: dbError.message,
                solution: 'Please check your MongoDB Atlas connection string in .env.local file'
            }, { status: 503 });
        }

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
        }

        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        try {
            console.log('Querying appointments with:', JSON.stringify(query));
            const total = await Appointment.countDocuments(query);
            console.log(`Found ${total} appointments matching query`);

            const appointments = await Appointment.find(query)
                .populate('patientId', 'name')
                .populate('doctorId', 'name')
                .sort({ date: 1, startTime: 1 })
                .skip(skip)
                .limit(limit);

            console.log(`Retrieved ${appointments.length} appointments`);

            return NextResponse.json({
                appointments,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (queryError) {
            console.error('Error querying appointments:', queryError);
            return NextResponse.json({
                error: 'Failed to query appointments',
                details: queryError.message
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
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

        // Get patient ID from authenticated user
        const patientId = user._id || user.id;
        console.log('Patient ID from token:', patientId);

        // For debugging: log the patient ID from request body if provided
        if (data.patientId) {
            console.log('Patient ID from request body:', data.patientId);
        }

        let doctorId;
<<<<<<< HEAD
        
        if (mongoose.Types.ObjectId.isValid(requestedDoctorId)) {
            doctorId = new mongoose.Types.ObjectId(requestedDoctorId);
        } 
        else if (!isNaN(requestedDoctorId)) {
            const doctor = await User.findOne({ 
=======

        // Log the received doctor ID for debugging
        console.log('Requested doctor ID:', requestedDoctorId, 'Type:', typeof requestedDoctorId);

        // If it's already a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(requestedDoctorId)) {
            doctorId = new mongoose.Types.ObjectId(requestedDoctorId);
            console.log('Using valid ObjectId:', doctorId);
        }
        // If it's a string that might be convertible to ObjectId
        else if (typeof requestedDoctorId === 'string') {
            try {
                // Find doctor by their ID
                console.log('Searching for doctor with string ID:', requestedDoctorId);
                const doctor = await User.findOne({
                    role: 'doctor',
                    $or: [
                        { _id: requestedDoctorId },
                        { 'doctorProfile.doctorId': requestedDoctorId }
                    ]
                }).select('_id');

                if (!doctor) {
                    console.log('Doctor not found with string ID');
                    return NextResponse.json({
                        error: 'Invalid doctor',
                        details: 'Doctor not found with the provided ID'
                    }, { status: 400 });
                }
                doctorId = doctor._id;
                console.log('Found doctor with ID:', doctorId);
            } catch (idError) {
                console.error('Error processing doctor ID:', idError);
                return NextResponse.json({
                    error: 'Invalid doctor ID format',
                    details: 'The provided doctor ID is in an invalid format'
                }, { status: 400 });
            }
        }
        // If it's a numeric ID (like from frontend)
        else if (!isNaN(requestedDoctorId)) {
            // Find doctor by their numeric ID (assuming it's stored in a field)
            console.log('Searching for doctor with numeric ID:', requestedDoctorId);
            const doctor = await User.findOne({
>>>>>>> 74f7c7b293c98eceffe8125840281c637782687e
                role: 'doctor',
                $or: [
                    { 'doctorProfile.doctorId': parseInt(requestedDoctorId) },
                    { _id: requestedDoctorId }
                ]
            }).select('_id');

            if (!doctor) {
                console.log('Doctor not found with numeric ID');
                return NextResponse.json({
                    error: 'Invalid doctor',
                    details: 'Doctor not found or inactive'
                }, { status: 400 });
            }
            doctorId = doctor._id;
            console.log('Found doctor with numeric ID:', doctorId);
        }

        if (!doctorId) {
            console.log('Could not resolve doctor ID');
            return NextResponse.json({
                error: 'Invalid doctor',
                details: 'Could not find doctor with the provided ID'
            }, { status: 400 });
        }
<<<<<<< HEAD
        const doctor = await User.findOne({ 
            _id: doctorId, 
            role: 'doctor', 
            status: 'active' 
=======

        // Check if doctor exists and is active
        const doctor = await User.findOne({
            _id: doctorId,
            role: 'doctor',
            isActive: true
>>>>>>> 74f7c7b293c98eceffe8125840281c637782687e
        });

        if (!doctor) {
            console.log('Doctor not found or not active:', doctorId);
            return NextResponse.json({
                error: 'Invalid doctor',
                details: 'Doctor not found or inactive'
            }, { status: 400 });
        }

<<<<<<< HEAD
=======
        console.log('Doctor found and validated:', doctor._id, doctor.name);

        // Check if patient has any existing appointments with this doctor
>>>>>>> 74f7c7b293c98eceffe8125840281c637782687e
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
            patientId: new mongoose.Types.ObjectId(patientId),
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