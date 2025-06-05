import { NextResponse } from 'next/server';
import { connect as dbConnect } from '@/lib/db';
import MedicalFile from '@/models/MedicalFile'; // Assuming you have a MedicalFile model
import jwt from 'jsonwebtoken';

// GET /api/medicalfiles/[medicalFileId]
export async function GET(request, { params }) {
  console.log("MEDICALFILE API - Checking for JWT_SECRET:", process.env.JWT_SECRET ? "Defined" : "UNDEFINED or empty");
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("MEDICALFILE API - JWT_SECRET is not set. Authentication will fail.");
    return NextResponse.json({ message: 'Authentication configuration error: JWT_SECRET missing' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("MEDICALFILE API - Authorization header missing or malformed.");
    return NextResponse.json({ message: 'Unauthorized - Missing or malformed token' }, { status: 401 });
  }

  const tokenString = authHeader.split(' ')[1];
  let token; // This will hold the decoded token payload
  try {
    token = jwt.verify(tokenString, jwtSecret);
    console.log("MEDICALFILE API - Decoded Token:", token);
  } catch (error) {
    console.error("MEDICALFILE API - Token verification failed:", error.message);
    // Differentiate between expired token and other verification errors if needed
    if (error.name === 'TokenExpiredError') {
        return NextResponse.json({ message: 'Unauthorized - Token expired' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Unauthorized - Invalid token' }, { status: 401 });
  }

  // Ensure token is not only decoded but also contains essential info like userId
  if (!token || !token.userId) {
    console.log("MEDICALFILE API - Token invalid or missing userId after decoding, returning 401");
    return NextResponse.json({ message: 'Unauthorized - Invalid token payload' }, { status: 401 });
  }

  const { medicalFileId } = params;

  if (!medicalFileId) {
    return NextResponse.json({ message: 'Medical File ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    // TODO: Add logic to verify if the authenticated user (token.sub or token.id based on your JWT structure)
    // has permission to access this medical file.
    // This might involve checking if the medicalFile.user matches the user's IDpdb
    // or if the user is a doctor with access permissions to this patient's file.

    const medicalFile = await MedicalFile.findById(medicalFileId);

    if (!medicalFile) {
      return NextResponse.json({ message: 'Medical File not found' }, { status: 404 });
    }

    // Basic authorization: Check if the requesting user is the owner of the medical file
    // or if the user is a doctor. You'll need to adapt token.sub or token.id based on your JWT payload.
    // And ensure medicalFile.user stores the ObjectId of the user it belongs to.
    if (medicalFile.patientId.toString() !== token.userId && token.role !== 'doctor') { 
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(medicalFile, { status: 200 });

  } catch (error) {
    console.error('Error fetching medical file:', error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return NextResponse.json({ message: 'Invalid Medical File ID format' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

// Placeholder for other methods if needed in the future
// export async function POST(request, { params }) { /* ... */ }
// export async function PUT(request, { params }) { /* ... */ }
// export async function DELETE(request, { params }) { /* ... */ }
