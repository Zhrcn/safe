import { connectToDatabase } from '@/lib/db/mongodb';
import { NextResponse } from 'next/server';

/**
 * GET handler for testing MongoDB connection
 */
export async function GET() {
  try {
    // Connect to the database
    const mongoose = await connectToDatabase();
    
    // Return connection status
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB Atlas',
      dbName: mongoose.connection.db.databaseName,
      connectionState: mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to MongoDB Atlas',
        message: error.message
      },
      { status: 500 }
    );
  }
} 