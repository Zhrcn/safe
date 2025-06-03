const { NextResponse } = require('next/server');
const { connectToDatabase } = require('@/lib/db/mongodb');
const User = require('@/models/User');
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

    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('MongoDB Atlas connection error in doctors API:', dbError);

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

    // Find all active doctors
    const doctors = await User.find({
      role: 'doctor',
      isActive: true
    }).select('_id name avatar');

    // Format the doctors to include id field that matches MongoDB _id
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor._id.toString(),
      name: doctor.name,
      specialty: doctor.doctorProfile?.specialization || 'General Practice',
      avatar: doctor.avatar || '/images/default-avatar.png'
    }));

    console.log(`Found ${formattedDoctors.length} doctors`);
    return NextResponse.json(formattedDoctors);

  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
