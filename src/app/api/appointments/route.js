import { NextResponse } from 'next/server';
import { verifyToken, connectToDatabase, getCorsHeaders } from '../utils/db';
import { ObjectId } from 'mongodb';

// Standard headers for all responses
const headers = {
  ...getCorsHeaders(),
  'X-API-Source': 'api/appointments',
};

export async function GET(request) {
    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
        return NextResponse.json({}, { status: 200, headers });
    }
    
    try {
        // Verify authentication token
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Invalid or missing authentication token' },
                { status: 401, headers: { ...headers, 'X-Auth-Status': 'invalid-token' } }
            );
        }
        
        // Add auth info to headers for debugging
        const responseHeaders = {
            ...headers,
            'X-Auth-User-Id': decoded.userId,
            'X-Auth-Role': decoded.role
        };

        // Connect to database
        let client;
        try {
            client = await connectToDatabase();
            console.log('Connected to database for appointments fetch');
        } catch (dbError) {
            console.error('Database connection error in appointments API:', dbError.message);
            
            return NextResponse.json({
                error: 'Database connection failed',
                message: 'Unable to connect to the database. Please try again later.'
            }, { 
                status: 503, 
                headers: { 
                    ...responseHeaders, 
                    'X-Error-Type': dbError.name,
                    'X-Error-Message': dbError.message.substring(0, 100)
                } 
            });
        }

        const url = new URL(request.url);
        const db = client.db();
        const appointmentsCollection = db.collection('appointments');

        let query = {};

        const userId = decoded.userId;
        if (!userId) {
            await client.close();
            return NextResponse.json(
                { error: 'Invalid token', message: 'Missing user ID in token' },
                { status: 401, headers: responseHeaders }
            );
        }
        
        if (decoded.role === 'patient') {
            query.patientId = new ObjectId(userId);
        } else if (decoded.role === 'doctor') {
            query.doctorId = new ObjectId(userId);

            const patientId = url.searchParams.get('patientId');
            if (patientId) {
                query = { 
                    patientId: new ObjectId(patientId), 
                    doctorId: new ObjectId(userId) 
                };
            }
        } else if (decoded.role === 'admin') {
            const patientId = url.searchParams.get('patientId');
            const doctorId = url.searchParams.get('doctorId');
            const status = url.searchParams.get('status');

            if (patientId) query.patientId = new ObjectId(patientId);
            if (doctorId) query.doctorId = new ObjectId(doctorId);
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
            
            // Get total count of matching appointments
            const total = await appointmentsCollection.countDocuments(query);
            console.log(`Found ${total} appointments matching query`);

            // Get appointments with pagination
            const appointmentsCursor = appointmentsCollection.find(query)
                .sort({ date: 1, startTime: 1 })
                .skip(skip)
                .limit(limit);
                
            const appointments = await appointmentsCursor.toArray();
            
            // Populate patient and doctor names
            const usersCollection = db.collection('users');
            const populatedAppointments = await Promise.all(appointments.map(async (appointment) => {
                let patientName = 'Unknown Patient';
                let doctorName = 'Unknown Doctor';
                
                if (appointment.patientId) {
                    const patient = await usersCollection.findOne({ _id: appointment.patientId });
                    if (patient) patientName = patient.name;
                }
                
                if (appointment.doctorId) {
                    const doctor = await usersCollection.findOne({ _id: appointment.doctorId });
                    if (doctor) doctorName = doctor.name;
                }
                
                return {
                    ...appointment,
                    patientName,
                    doctorName
                };
            }));

            const hasMore = total > page * limit;
            
            // Close database connection
            await client.close();

            return NextResponse.json({
                appointments: populatedAppointments,
                pagination: {
                    total,
                    page,
                    limit,
                    hasMore
                }
            }, { 
                status: 200, 
                headers: { 
                    ...responseHeaders, 
                    'X-Records-Count': total,
                    'X-Data-Source': 'database'
                } 
            });
        } catch (error) {
            console.error('Error fetching appointments:', error);
            await client.close();
            
            return NextResponse.json(
                { error: 'Database error', message: 'Error fetching appointments' },
                { 
                    status: 500, 
                    headers: { 
                        ...responseHeaders, 
                        'X-Error-Type': error.name,
                        'X-Error-Message': error.message.substring(0, 100)
                    } 
                }
            );
        }
    } catch (error) {
        console.error('Unexpected error in appointments API:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'An unexpected error occurred' },
            { 
                status: 500, 
                headers: { 
                    ...headers, 
                    'X-Error-Type': error.name,
                    'X-Error-Message': error.message.substring(0, 100)
                } 
            }
        );
    }
}

export async function POST(request) {
    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
        return NextResponse.json({}, { status: 200, headers });
    }
    
    try {
        // Verify authentication token
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Invalid or missing authentication token' },
                { status: 401, headers: { ...headers, 'X-Auth-Status': 'invalid-token' } }
            );
        }
        
        // Add auth info to headers for debugging
        const responseHeaders = {
            ...headers,
            'X-Auth-User-Id': decoded.userId,
            'X-Auth-Role': decoded.role
        };

        // Connect to database
        let client;
        try {
            client = await connectToDatabase();
            console.log('Connected to database for appointment creation');
        } catch (dbError) {
            console.error('Database connection error in appointments API:', dbError.message);
            
            return NextResponse.json({
                error: 'Database connection failed',
                message: 'Unable to connect to the database. Please try again later.'
            }, { 
                status: 503, 
                headers: { 
                    ...responseHeaders, 
                    'X-Error-Type': dbError.name,
                    'X-Error-Message': dbError.message.substring(0, 100)
                } 
            });
        }
        
        try {
            const data = await request.json();
            const db = client.db();
            const appointmentsCollection = db.collection('appointments');
            
            // Create new appointment document
            const appointment = {
                patientId: new ObjectId(data.patientId || decoded.userId),
                doctorId: new ObjectId(data.doctorId),
                date: new Date(data.date),
                startTime: data.startTime,
                endTime: data.endTime,
                status: 'Scheduled',
                reasonForVisit: data.reasonForVisit,
                notes: {
                    patient: data.notes?.patient || ''
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Insert appointment into database
            const result = await appointmentsCollection.insertOne(appointment);
            
            // Close database connection
            await client.close();
            
            console.log('Appointment saved successfully');
            return NextResponse.json(
                { ...appointment, _id: result.insertedId },
                { status: 201, headers: responseHeaders }
            );
        } catch (error) {
            console.error('Error creating appointment:', error);
            
            // Close database connection if it was opened
            if (client) await client.close();
            
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
                message: error.message
            }, { 
                status: statusCode, 
                headers: { 
                    ...responseHeaders, 
                    'X-Error-Type': error.name,
                    'X-Error-Message': error.message.substring(0, 100)
                } 
            });
        }
    } catch (error) {
        console.error('Unexpected error in appointments API:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'An unexpected error occurred' },
            { 
                status: 500, 
                headers: { 
                    ...headers, 
                    'X-Error-Type': error.name,
                    'X-Error-Message': error.message.substring(0, 100)
                } 
            }
        );
    }
}

export async function PATCH(request) {
    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
        return NextResponse.json({}, { status: 200, headers });
    }
    
    try {
        // Verify authentication token
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Invalid or missing authentication token' },
                { status: 401, headers: { ...headers, 'X-Auth-Status': 'invalid-token' } }
            );
        }
        
        // Add auth info to headers for debugging
        const responseHeaders = {
            ...headers,
            'X-Auth-User-Id': decoded.userId,
            'X-Auth-Role': decoded.role
        };

        const url = new URL(request.url);
        const paths = url.pathname.split('/');
        const appointmentId = paths[paths.length - 1];

        if (!appointmentId || appointmentId === 'appointments') {
            return NextResponse.json(
                { error: 'Bad Request', message: 'Appointment ID is required' },
                { status: 400, headers: responseHeaders }
            );
        }
        
        // Connect to database
        let client;
        try {
            client = await connectToDatabase();
            console.log('Connected to database for appointment update');
        } catch (dbError) {
            console.error('Database connection error in appointments API:', dbError.message);
            
            return NextResponse.json({
                error: 'Database connection failed',
                message: 'Unable to connect to the database. Please try again later.'
            }, { 
                status: 503, 
                headers: { 
                    ...responseHeaders, 
                    'X-Error-Type': dbError.name,
                    'X-Error-Message': dbError.message.substring(0, 100)
                } 
            });
        }
        
        try {
            const data = await request.json();
            const db = client.db();
            const appointmentsCollection = db.collection('appointments');
            
            // Convert appointmentId string to ObjectId
            let appointmentObjectId;
            try {
                appointmentObjectId = new ObjectId(appointmentId);
            } catch (error) {
                await client.close();
                return NextResponse.json(
                    { error: 'Invalid ID', message: 'The appointment ID format is invalid' },
                    { status: 400, headers: responseHeaders }
                );
            }
            
            // Find the appointment
            const appointment = await appointmentsCollection.findOne({ _id: appointmentObjectId });
            if (!appointment) {
                await client.close();
                return NextResponse.json(
                    { error: 'Not Found', message: 'Appointment not found' },
                    { status: 404, headers: responseHeaders }
                );
            }

            // Check authorization
            if (decoded.role === 'patient') {
                if (appointment.patientId.toString() !== decoded.userId) {
                    await client.close();
                    return NextResponse.json(
                        { error: 'Forbidden', message: 'You are not authorized to modify this appointment' },
                        { status: 403, headers: responseHeaders }
                    );
                }
                
                // Handle patient updates
                let updateData = {};
                
                if (data.status === 'Cancelled') {
                    updateData = {
                        status: 'Cancelled',
                        'notes.patient': data.notes?.patient || 'Cancelled by patient',
                        updatedAt: new Date()
                    };
                } else {
                    updateData = { updatedAt: new Date() };
                    
                    if (data.notes?.patient) updateData['notes.patient'] = data.notes.patient;
                    if (data.reasonForVisit) updateData.reasonForVisit = data.reasonForVisit;
                }
                
                // Update the appointment
                await appointmentsCollection.updateOne(
                    { _id: appointmentObjectId },
                    { $set: updateData }
                );
            } else if (decoded.role === 'doctor') {
                if (appointment.doctorId.toString() !== decoded.userId) {
                    await client.close();
                    return NextResponse.json(
                        { error: 'Forbidden', message: 'You are not authorized to modify this appointment' },
                        { status: 403, headers: responseHeaders }
                    );
                }
                
                // Handle doctor updates
                let updateData = { updatedAt: new Date() };
                
                if (data.status === 'Completed') {
                    updateData = {
                        status: 'Completed',
                        diagnosis: data.diagnosis || {},
                        vitals: data.vitals || {},
                        followUp: data.followUp || {},
                        updatedAt: new Date()
                    };
                } else if (data.status === 'Cancelled') {
                    updateData = {
                        status: 'Cancelled',
                        'notes.doctor': data.notes?.doctor || 'Cancelled by doctor',
                        updatedAt: new Date()
                    };
                } else {
                    const { notes, ...restData } = data;
                    Object.assign(updateData, restData);
                    
                    if (notes?.doctor) updateData['notes.doctor'] = notes.doctor;
                }
                
                // Update the appointment
                await appointmentsCollection.updateOne(
                    { _id: appointmentObjectId },
                    { $set: updateData }
                );
            } else if (decoded.role !== 'admin') {
                await client.close();
                return NextResponse.json(
                    { error: 'Forbidden', message: 'You are not authorized to modify appointments' },
                    { status: 403, headers: responseHeaders }
                );
            } else {
                // Handle admin updates
                const { notes, diagnosis, vitals, followUp, ...restData } = data;
                let updateData = { ...restData, updatedAt: new Date() };
                
                if (notes) {
                    Object.keys(notes).forEach(key => {
                        updateData[`notes.${key}`] = notes[key];
                    });
                }
                
                if (diagnosis) {
                    Object.keys(diagnosis).forEach(key => {
                        updateData[`diagnosis.${key}`] = diagnosis[key];
                    });
                }
                
                if (vitals) {
                    Object.keys(vitals).forEach(key => {
                        updateData[`vitals.${key}`] = vitals[key];
                    });
                }
                
                if (followUp) {
                    Object.keys(followUp).forEach(key => {
                        updateData[`followUp.${key}`] = followUp[key];
                    });
                }
                
                // Update the appointment
                await appointmentsCollection.updateOne(
                    { _id: appointmentObjectId },
                    { $set: updateData }
                );
            }
            
            // Get the updated appointment
            const updatedAppointment = await appointmentsCollection.findOne({ _id: appointmentObjectId });
            
            // Close database connection
            await client.close();
            
            return NextResponse.json(updatedAppointment, { 
                status: 200, 
                headers: responseHeaders 
            });
        } catch (error) {
            console.error('Error updating appointment:', error);
            
            // Close database connection if it was opened
            if (client) await client.close();
            
            return NextResponse.json(
                { error: 'Database error', message: 'Error updating appointment' },
                { 
                    status: 500, 
                    headers: { 
                        ...responseHeaders, 
                        'X-Error-Type': error.name,
                        'X-Error-Message': error.message.substring(0, 100)
                    } 
                }
            );
        }
    } catch (error) {
        console.error('Unexpected error in appointments API:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'An unexpected error occurred' },
            { 
                status: 500, 
                headers: { 
                    ...headers, 
                    'X-Error-Type': error.name,
                    'X-Error-Message': error.message.substring(0, 100)
                } 
            }
        );
    }
}
