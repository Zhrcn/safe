import { NextResponse } from 'next/server';
import { verifyToken, connectToDatabase, getCorsHeaders } from '../utils/db';
import { ObjectId } from 'mongodb';

// Standard headers for all responses
const headers = {
  ...getCorsHeaders(),
  'X-API-Source': 'api/medical-providers',
};

/**
 * GET handler for medical providers
 * Fetches medical providers that can be used for referrals and appointments
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

    // Connect to database
    let client;
    try {
      client = await connectToDatabase();
      console.log('Connected to database for medical providers fetch');
    } catch (dbError) {
      console.error('Database connection error in medical-providers API:', dbError.message);
      
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
      const url = new URL(request.url);
      
      // Get query parameters
      const specialty = url.searchParams.get('specialty');
      const name = url.searchParams.get('name');
      const location = url.searchParams.get('location');
      const page = parseInt(url.searchParams.get('page')) || 1;
      const limit = parseInt(url.searchParams.get('limit')) || 10;
      const skip = (page - 1) * limit;
      
      // Build query
      let query = {};
      if (specialty) query.specialty = new RegExp(specialty, 'i');
      if (name) query.name = new RegExp(name, 'i');
      if (location) query.location = new RegExp(location, 'i');
      
      // First try to get medical providers from the dedicated collection
      let providersCollection = db.collection('medicalProviders');
      let total = await providersCollection.countDocuments(query);
      
      // If no dedicated collection or no providers, fall back to users with doctor role
      if (total === 0) {
        providersCollection = db.collection('users');
        query.role = 'doctor';
        total = await providersCollection.countDocuments(query);
      }
      
      // Fetch providers with pagination
      const providersCursor = providersCollection.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);
      
      const providers = await providersCursor.toArray();
      
      // Transform providers data
      const transformedProviders = providers.map(provider => {
        // Convert MongoDB ObjectId to string
        const providerWithStringId = {
          ...provider,
          _id: provider._id.toString()
        };
        
        // Remove sensitive fields
        delete providerWithStringId.password;
        delete providerWithStringId.tokens;
        
        // Ensure consistent data structure
        if (!providerWithStringId.yearsExperience) {
          providerWithStringId.yearsExperience = Math.floor(Math.random() * 15) + 5;
        }
        
        // Ensure address is properly formatted
        if (typeof providerWithStringId.address === 'object' && providerWithStringId.address !== null) {
          providerWithStringId.formattedAddress = `${providerWithStringId.address.street || ''}, ${providerWithStringId.address.city || ''}`;
        } else if (typeof providerWithStringId.address === 'string') {
          providerWithStringId.formattedAddress = providerWithStringId.address;
        } else {
          providerWithStringId.formattedAddress = providerWithStringId.location || 'Unknown';
        }
        
        // Return the provider with all required fields
        return {
          ...provider,
          specialty: provider.specialty || 'General Medicine',
          location: provider.location || provider.address?.city || 'Unknown Location',
          address: provider.address || {
            street: 'Unknown',
            city: 'Unknown',
            state: 'Unknown',
            zipCode: 'Unknown'
          },
          contact: provider.contact || {
            phone: provider.phone || 'Unknown',
            email: provider.email || 'Unknown'
          },
          availability: provider.availability || {
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: '9:00 AM - 5:00 PM'
          },
          acceptingNewPatients: provider.acceptingNewPatients !== false,
          insuranceAccepted: provider.insuranceAccepted || ['Medicare', 'Medicaid', 'Private Insurance'],
          rating: provider.rating || 4.5,
          reviewCount: provider.reviewCount || 0
        };
      });
      
      // Calculate pagination info
      const hasMore = total > page * limit;
      
      // Separate providers into doctors and pharmacists
      const doctors = [];
      const pharmacists = [];
      
      transformedProviders.forEach(provider => {
        // Check if provider is a pharmacist based on specialty or other indicators
        if (provider.specialty && (
            provider.specialty.toLowerCase().includes('pharm') ||
            (provider.pharmacy && provider.pharmacy.length > 0)
        )) {
          // Format as pharmacist
          pharmacists.push({
            id: provider._id.toString(),
            name: provider.name,
            pharmacy: provider.pharmacy || provider.location || 'Local Pharmacy',
            address: typeof provider.address === 'string' ? provider.address : 
                    (provider.address ? `${provider.address.street}, ${provider.address.city}` : provider.location || 'Unknown'),
            phone: provider.contact?.phone || provider.phone || '(555) 000-0000',
            email: provider.contact?.email || provider.email || 'unknown@example.com',
            rating: provider.rating || 4.5,
            reviewCount: provider.reviewCount || 0,
            yearsExperience: provider.yearsExperience || Math.floor(Math.random() * 10) + 3,
            availability: provider.availability ? 
              Object.entries(provider.availability).map(([day, hours]) => ({
                day: day.charAt(0).toUpperCase() + day.slice(1),
                hours: typeof hours === 'string' ? hours : '9:00 AM - 6:00 PM'
              })) : [
                { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
                { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
                { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
                { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
                { day: 'Friday', hours: '9:00 AM - 6:00 PM' }
              ],
            avatar: provider.avatar || '/images/pharmacists/default.jpg'
          });
        } else {
          // Format as doctor
          doctors.push({
            id: provider._id.toString(),
            name: provider.name,
            specialty: provider.specialty || 'General Practice',
            hospital: provider.hospital || provider.location || 'Local Medical Center',
            address: typeof provider.address === 'string' ? provider.address : 
                    (provider.address ? `${provider.address.street}, ${provider.address.city}` : provider.location || 'Unknown'),
            phone: provider.contact?.phone || provider.phone || '(555) 000-0000',
            email: provider.contact?.email || provider.email || 'unknown@example.com',
            rating: provider.rating || 4.5,
            reviewCount: provider.reviewCount || 0,
            isPrimary: provider.isPrimary || false,
            hasAccess: provider.hasAccess !== false,
            yearsExperience: provider.yearsExperience || Math.floor(Math.random() * 15) + 5,
            availability: provider.availability ? 
              Object.entries(provider.availability).map(([day, hours]) => {
                // Convert hours string to slots array if needed
                let slots = [];
                if (typeof hours === 'string') {
                  // Parse hours like "9:00 AM - 5:00 PM" into slots
                  const [start, end] = hours.split(' - ');
                  if (start && end) {
                    // Create 3 sample slots
                    slots = [start, '12:00 PM', end];
                  }
                } else if (Array.isArray(hours)) {
                  slots = hours;
                } else {
                  // Default slots
                  slots = ['9:00 AM', '12:00 PM', '3:00 PM'];
                }
                
                return {
                  day: day.charAt(0).toUpperCase() + day.slice(1),
                  slots
                };
              }) : [
                { day: 'Monday', slots: ['9:00 AM', '12:00 PM', '3:00 PM'] },
                { day: 'Wednesday', slots: ['10:00 AM', '1:00 PM', '4:00 PM'] },
                { day: 'Friday', slots: ['9:00 AM', '12:00 PM', '3:00 PM'] }
              ],
            avatar: provider.avatar || '/images/doctors/default.jpg',
            nextAvailable: provider.nextAvailable || new Date(Date.now() + 86400000 * 2).toISOString() // 2 days from now
          });
        }
      });
      
      // Close database connection
      await client.close();
      
      return NextResponse.json({
        doctors,
        pharmacists,
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
      console.error('Error fetching medical providers:', error);
      
      // Close database connection if it was opened
      if (client) await client.close();
      
      return NextResponse.json(
        { error: 'Database error', message: 'Error fetching medical providers' },
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
    console.error('Unexpected error in medical-providers API:', error);
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
 * POST handler for medical providers
 * Adds a new medical provider (admin only)
 */
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

    // Only admins can add medical providers
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only administrators can add medical providers' },
        { status: 403, headers: responseHeaders }
      );
    }

    // Connect to database
    let client;
    try {
      client = await connectToDatabase();
      console.log('Connected to database for adding medical provider');
    } catch (dbError) {
      console.error('Database connection error in medical-providers API:', dbError.message);
      
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
      const providersCollection = db.collection('medicalProviders');
      
      // Validate required fields
      if (!data.name || !data.specialty) {
        await client.close();
        return NextResponse.json(
          { error: 'Bad Request', message: 'Name and specialty are required fields' },
          { status: 400, headers: responseHeaders }
        );
      }
      
      // Create new provider document
      const provider = {
        name: data.name,
        specialty: data.specialty,
        location: data.location || data.address?.city || 'Unknown',
        address: data.address || {
          street: 'Unknown',
          city: data.location || 'Unknown',
          state: 'Unknown',
          zipCode: 'Unknown'
        },
        contact: data.contact || {
          phone: data.phone || 'Unknown',
          email: data.email || 'Unknown'
        },
        availability: data.availability || {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM'
        },
        acceptingNewPatients: data.acceptingNewPatients !== false,
        insuranceAccepted: data.insuranceAccepted || ['Medicare', 'Medicaid', 'Private Insurance'],
        rating: data.rating || 4.5,
        reviewCount: data.reviewCount || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Insert provider into database
      const result = await providersCollection.insertOne(provider);
      
      // Close database connection
      await client.close();
      
      console.log('Medical provider added successfully');
      return NextResponse.json(
        { ...provider, _id: result.insertedId },
        { status: 201, headers: responseHeaders }
      );
    } catch (error) {
      console.error('Error adding medical provider:', error);
      
      // Close database connection if it was opened
      if (client) await client.close();
      
      let statusCode = 500;
      let errorMessage = 'Internal server error';

      if (error.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = error.message;
      } else if (error.code === 11000) {
        statusCode = 409;
        errorMessage = 'Duplicate medical provider';
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
    console.error('Unexpected error in medical-providers API:', error);
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
