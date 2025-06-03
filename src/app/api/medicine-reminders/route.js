import { NextResponse } from 'next/server';
import { verifyToken, connectToDatabase, getCorsHeaders } from '../utils/db';
import { ObjectId } from 'mongodb';

// Standard headers for all responses
const headers = {
  ...getCorsHeaders(),
  'X-API-Source': 'api/medicine-reminders',
};

/**
 * GET handler for medicine reminders
 * Fetches medicine reminders for the authenticated patient
 */
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

    // Only patients can access their medicine reminders
    if (decoded.role !== 'patient' && decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only patients can access their medicine reminders' },
        { status: 403, headers: responseHeaders }
      );
    }

    // Connect to database
    let client;
    try {
      client = await connectToDatabase();
      console.log('Connected to database for medicine reminders fetch');
    } catch (dbError) {
      console.error('Database connection error in medicine-reminders API:', dbError.message);
      
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
      const db = client.db();
      const userId = decoded.role === 'patient' ? decoded.userId : request.nextUrl.searchParams.get('patientId');
      
      if (!userId) {
        await client.close();
        return NextResponse.json(
          { error: 'Bad Request', message: 'Patient ID is required' },
          { status: 400, headers: responseHeaders }
        );
      }

      // Query the prescriptions collection to get active medications
      const prescriptionsCollection = db.collection('prescriptions');
      const userObjectId = new ObjectId(userId);
      
      const prescriptions = await prescriptionsCollection.find({
        patientId: userObjectId,
        status: 'active'
      }).toArray();

      // Extract medication details and create reminders
      const medicineReminders = [];
      const now = new Date();
      
      for (const prescription of prescriptions) {
        if (!prescription.medications || !Array.isArray(prescription.medications)) {
          continue;
        }
        
        for (const medication of prescription.medications) {
          if (!medication.name || !medication.dosage || !medication.frequency) {
            continue;
          }
          
          // Create reminders based on frequency
          const reminderTimes = [];
          if (medication.frequency.toLowerCase().includes('daily')) {
            // For daily medications, create morning, afternoon, and evening reminders
            reminderTimes.push('08:00 AM', '02:00 PM', '08:00 PM');
          } else if (medication.frequency.toLowerCase().includes('twice')) {
            // For twice daily medications, create morning and evening reminders
            reminderTimes.push('08:00 AM', '08:00 PM');
          } else if (medication.frequency.toLowerCase().includes('once')) {
            // For once daily medications, create morning reminder
            reminderTimes.push('08:00 AM');
          } else if (medication.frequency.toLowerCase().includes('every')) {
            // For medications taken every X hours
            const hoursMatch = medication.frequency.match(/every\s+(\d+)\s+hours?/i);
            if (hoursMatch && hoursMatch[1]) {
              const hours = parseInt(hoursMatch[1]);
              for (let i = 8; i < 24; i += hours) {
                const hour = i % 12 || 12;
                const ampm = i < 12 || i === 24 ? 'AM' : 'PM';
                reminderTimes.push(`${hour}:00 ${ampm}`);
              }
            } else {
              // Default reminder time
              reminderTimes.push('08:00 AM');
            }
          } else {
            // Default reminder time for unknown frequencies
            reminderTimes.push('08:00 AM');
          }
          
          // Create a reminder for each time
          reminderTimes.forEach((time, index) => {
            medicineReminders.push({
              _id: `${prescription._id}-${medication.name}-${index}`,
              medicationId: medication._id || `med-${prescription._id}-${index}`,
              prescriptionId: prescription._id,
              name: medication.name,
              dosage: medication.dosage,
              instructions: medication.instructions || '',
              time,
              status: 'pending',
              createdAt: prescription.createdAt || now,
              updatedAt: now
            });
          });
        }
      }
      
      // Sort reminders by time
      medicineReminders.sort((a, b) => {
        const timeA = a.time;
        const timeB = b.time;
        return timeA.localeCompare(timeB);
      });
      
      // Close database connection
      await client.close();
      
      return NextResponse.json({
        reminders: medicineReminders
      }, { 
        status: 200, 
        headers: { 
          ...responseHeaders, 
          'X-Records-Count': medicineReminders.length,
          'X-Data-Source': 'database'
        } 
      });
    } catch (error) {
      console.error('Error fetching medicine reminders:', error);
      
      // Close database connection if it was opened
      if (client) await client.close();
      
      return NextResponse.json(
        { error: 'Database error', message: 'Error fetching medicine reminders' },
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
    console.error('Unexpected error in medicine-reminders API:', error);
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

/**
 * PATCH handler for medicine reminders
 * Updates the status of a medicine reminder (taken, skipped, etc.)
 */
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

    // Only patients can update their medicine reminders
    if (decoded.role !== 'patient') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only patients can update their medicine reminders' },
        { status: 403, headers: responseHeaders }
      );
    }

    // Connect to database
    let client;
    try {
      client = await connectToDatabase();
      console.log('Connected to database for medicine reminder update');
    } catch (dbError) {
      console.error('Database connection error in medicine-reminders API:', dbError.message);
      
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
      
      // Extract reminder ID and new status
      const { reminderId, status, notes } = data;
      
      if (!reminderId || !status) {
        await client.close();
        return NextResponse.json(
          { error: 'Bad Request', message: 'Reminder ID and status are required' },
          { status: 400, headers: responseHeaders }
        );
      }
      
      // Parse the reminder ID to get the prescription ID
      const prescriptionIdMatch = reminderId.match(/^([^-]+)/);
      if (!prescriptionIdMatch) {
        await client.close();
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid reminder ID format' },
          { status: 400, headers: responseHeaders }
        );
      }
      
      const prescriptionId = prescriptionIdMatch[1];
      
      // Verify the prescription belongs to the patient
      const prescriptionsCollection = db.collection('prescriptions');
      const prescription = await prescriptionsCollection.findOne({
        _id: new ObjectId(prescriptionId),
        patientId: new ObjectId(decoded.userId)
      });
      
      if (!prescription) {
        await client.close();
        return NextResponse.json(
          { error: 'Forbidden', message: 'You do not have permission to update this reminder' },
          { status: 403, headers: responseHeaders }
        );
      }
      
      // Create or update the medication log
      const medicationLogsCollection = db.collection('medicationLogs');
      
      const now = new Date();
      const log = {
        prescriptionId: new ObjectId(prescriptionId),
        patientId: new ObjectId(decoded.userId),
        reminderId,
        status,
        notes: notes || '',
        timestamp: now,
        createdAt: now,
        updatedAt: now
      };
      
      await medicationLogsCollection.insertOne(log);
      
      // Close database connection
      await client.close();
      
      return NextResponse.json({
        success: true,
        message: 'Medication reminder updated successfully',
        log
      }, { 
        status: 200, 
        headers: responseHeaders
      });
    } catch (error) {
      console.error('Error updating medicine reminder:', error);
      
      // Close database connection if it was opened
      if (client) await client.close();
      
      return NextResponse.json(
        { error: 'Database error', message: 'Error updating medicine reminder' },
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
    console.error('Unexpected error in medicine-reminders API:', error);
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
