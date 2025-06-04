import { connectToDatabase, withTimeout } from '@/lib/db/mongodb';
import { logger } from '@/lib/logger';
import { ObjectId } from 'mongodb';

const log = logger('MedicineReminderService');

export async function getMedicineReminders(patientId) {
  log.debug('Getting medicine reminders', { patientId });
  log.time('db-medicine-reminders-lookup');
  
  try {
    await connectToDatabase();
    const client = await connectToDatabase();
    const db = client.db();
    
    if (!patientId) {
      return {
        success: false,
        error: 'Bad Request',
        message: 'Patient ID is required',
        status: 400
      };
    }

    try {
      const userObjectId = new ObjectId(patientId);
      
      // Query the prescriptions collection to get active medications
      const prescriptionsCollection = db.collection('prescriptions');
      const prescriptions = await withTimeout(
        prescriptionsCollection.find({
          patientId: userObjectId,
          status: 'active'
        }).toArray(),
        5000,
        'Database query timeout while fetching prescriptions'
      );

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
          const reminderTimes = generateReminderTimes(medication.frequency);
          
          // Get medication logs for today
          const medicationLogsCollection = db.collection('medicationLogs');
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const reminderId = `${prescription._id}-${medication.name.replace(/\s+/g, '-').toLowerCase()}`;
          
          const logs = await withTimeout(
            medicationLogsCollection.find({
              reminderId: { $regex: new RegExp(`^${reminderId}`) },
              timestamp: { $gte: today, $lt: tomorrow }
            }).toArray(),
            5000,
            'Database query timeout while fetching medication logs'
          );
          
          // Create reminders for each time
          for (let i = 0; i < reminderTimes.length; i++) {
            const time = reminderTimes[i];
            const timeId = `${i + 1}`;
            const fullReminderId = `${reminderId}-${timeId}`;
            
            // Check if there's a log for this reminder
            const log = logs.find(l => l.reminderId === fullReminderId);
            
            medicineReminders.push({
              id: fullReminderId,
              prescriptionId: prescription._id,
              medicationName: medication.name,
              dosage: medication.dosage,
              frequency: medication.frequency,
              instructions: medication.instructions || '',
              time,
              status: log ? log.status : 'pending',
              notes: log ? log.notes : '',
              taken: log ? (log.status === 'taken') : false,
              skipped: log ? (log.status === 'skipped') : false
            });
          }
        }
      }
      
      // Sort reminders by time
      medicineReminders.sort((a, b) => {
        const timeA = parseTime(a.time);
        const timeB = parseTime(b.time);
        return timeA - timeB;
      });
      
      // Close database connection
      await client.close();
      
      log.timeEnd('db-medicine-reminders-lookup');
      log.info(`Found ${medicineReminders.length} medicine reminders`);
      
      return {
        success: true,
        reminders: medicineReminders,
        status: 200,
        headers: {
          'x-data-source': 'mongodb',
          'x-response-time': new Date().toISOString()
        }
      };
    } catch (error) {
      // Close database connection if it was opened
      if (client) await client.close();
      
      log.error(`Error retrieving medicine reminders: ${error.message}`, error);
      log.timeEnd('db-medicine-reminders-lookup');
      
      return {
        success: false,
        error: 'Failed to retrieve medicine reminders',
        message: error.message,
        status: 500,
        headers: {
          'x-error-type': error.name || 'UNKNOWN_ERROR',
          'x-error-time': new Date().toISOString()
        }
      };
    }
  } catch (error) {
    log.error(`Database connection error: ${error.message}`, error);
    log.timeEnd('db-medicine-reminders-lookup');
    
    return {
      success: false,
      error: 'Database connection failed',
      message: 'Unable to connect to the database. Please try again later.',
      status: 503,
      headers: {
        'x-error-type': error.name || 'CONNECTION_ERROR',
        'x-error-time': new Date().toISOString()
      }
    };
  }
}

export async function updateMedicineReminder(patientId, data) {
  log.debug('Updating medicine reminder', { patientId });
  log.time('db-medicine-reminder-update');
  
  try {
    await connectToDatabase();
    const client = await connectToDatabase();
    const db = client.db();
    
    // Extract reminder ID and new status
    const { reminderId, status, notes } = data;
    
    if (!reminderId || !status) {
      return {
        success: false,
        error: 'Bad Request',
        message: 'Reminder ID and status are required',
        status: 400
      };
    }
    
    try {
      // Parse the reminder ID to get the prescription ID
      const prescriptionIdMatch = reminderId.match(/^([^-]+)/);
      if (!prescriptionIdMatch) {
        await client.close();
        return {
          success: false,
          error: 'Bad Request',
          message: 'Invalid reminder ID format',
          status: 400
        };
      }
      
      const prescriptionId = prescriptionIdMatch[1];
      
      // Verify the prescription belongs to the patient
      const prescriptionsCollection = db.collection('prescriptions');
      const prescription = await withTimeout(
        prescriptionsCollection.findOne({
          _id: new ObjectId(prescriptionId),
          patientId: new ObjectId(patientId)
        }),
        5000,
        'Database query timeout while verifying prescription'
      );
      
      if (!prescription) {
        await client.close();
        return {
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to update this reminder',
          status: 403
        };
      }
      
      // Create or update the medication log
      const medicationLogsCollection = db.collection('medicationLogs');
      
      const now = new Date();
      const log = {
        prescriptionId: new ObjectId(prescriptionId),
        patientId: new ObjectId(patientId),
        reminderId,
        status,
        notes: notes || '',
        timestamp: now,
        createdAt: now,
        updatedAt: now
      };
      
      await withTimeout(
        medicationLogsCollection.insertOne(log),
        5000,
        'Database query timeout while updating medication log'
      );
      
      // Close database connection
      await client.close();
      
      log.timeEnd('db-medicine-reminder-update');
      log.info('Medicine reminder updated successfully', { reminderId, status });
      
      return {
        success: true,
        message: 'Medication reminder updated successfully',
        log,
        status: 200,
        headers: {
          'x-data-source': 'mongodb',
          'x-response-time': new Date().toISOString()
        }
      };
    } catch (error) {
      // Close database connection if it was opened
      if (client) await client.close();
      
      log.error(`Error updating medicine reminder: ${error.message}`, error);
      log.timeEnd('db-medicine-reminder-update');
      
      return {
        success: false,
        error: 'Failed to update medicine reminder',
        message: error.message,
        status: 500,
        headers: {
          'x-error-type': error.name || 'UNKNOWN_ERROR',
          'x-error-time': new Date().toISOString()
        }
      };
    }
  } catch (error) {
    log.error(`Database connection error: ${error.message}`, error);
    log.timeEnd('db-medicine-reminder-update');
    
    return {
      success: false,
      error: 'Database connection failed',
      message: 'Unable to connect to the database. Please try again later.',
      status: 503,
      headers: {
        'x-error-type': error.name || 'CONNECTION_ERROR',
        'x-error-time': new Date().toISOString()
      }
    };
  }
}

export function getMockMedicineReminders(patientId) {
  log.info('Generating mock medicine reminders', { patientId });
  
  const mockReminders = [];
  const now = new Date();
  const medications = [
    { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', instructions: 'Take with food' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', instructions: 'Take in the morning' },
    { name: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', instructions: 'Take with meals' },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', instructions: 'Take in the evening' }
  ];
  
  // Generate mock reminders for each medication
  medications.forEach((medication, index) => {
    const reminderTimes = generateReminderTimes(medication.frequency);
    const mockPrescriptionId = `mock_prescription_${index + 1}`;
    const reminderId = `${mockPrescriptionId}-${medication.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Create reminders for each time
    for (let i = 0; i < reminderTimes.length; i++) {
      const time = reminderTimes[i];
      const timeId = `${i + 1}`;
      const fullReminderId = `${reminderId}-${timeId}`;
      
      // Randomly determine if the reminder is taken or skipped
      const hourNow = now.getHours();
      const timeHour = parseTime(time) / 60;
      let status = 'pending';
      let taken = false;
      let skipped = false;
      
      if (timeHour < hourNow) {
        // Past reminders have a 70% chance of being taken
        if (Math.random() < 0.7) {
          status = 'taken';
          taken = true;
        } else {
          status = 'skipped';
          skipped = true;
        }
      }
      
      mockReminders.push({
        id: fullReminderId,
        prescriptionId: mockPrescriptionId,
        medicationName: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        instructions: medication.instructions,
        time,
        status,
        notes: '',
        taken,
        skipped
      });
    }
  });
  
  // Sort reminders by time
  mockReminders.sort((a, b) => {
    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);
    return timeA - timeB;
  });
  
  return {
    success: true,
    reminders: mockReminders,
    status: 200,
    headers: {
      'x-data-source': 'mock',
      'x-response-time': new Date().toISOString()
    }
  };
}

function generateReminderTimes(frequency) {
  const reminderTimes = [];
  
  if (frequency.toLowerCase().includes('daily') && frequency.toLowerCase().includes('three')) {
    // For three times daily medications, create morning, afternoon, and evening reminders
    reminderTimes.push('08:00 AM', '02:00 PM', '08:00 PM');
  } else if (frequency.toLowerCase().includes('twice') || frequency.toLowerCase().includes('two times')) {
    // For twice daily medications, create morning and evening reminders
    reminderTimes.push('08:00 AM', '08:00 PM');
  } else if (frequency.toLowerCase().includes('once') || frequency.toLowerCase().includes('one time')) {
    // For once daily medications, create morning reminder
    reminderTimes.push('08:00 AM');
  } else if (frequency.toLowerCase().includes('every')) {
    // For medications taken every X hours
    const match = frequency.match(/every\s+(\d+)\s+hours?/i);
    if (match) {
      const hours = parseInt(match[1]);
      const startHour = 8; // 8 AM
      
      for (let hour = startHour; hour < 24; hour += hours) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        reminderTimes.push(`${displayHour}:00 ${ampm}`);
      }
    } else {
      // Default to once daily if we can't parse the frequency
      reminderTimes.push('08:00 AM');
    }
  } else {
    // Default to once daily for unknown frequencies
    reminderTimes.push('08:00 AM');
  }
  
  return reminderTimes;
}

function parseTime(timeStr) {
  const [time, ampm] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}
