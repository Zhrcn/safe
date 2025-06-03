import { NextResponse } from 'next/server';
import { connectToDatabase, withTimeout } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import Patient from '@/models/Patient';

function createApiResponse(data, status = 200, headers = {}) {
  const responseHeaders = {
    'x-api-version': '1.0',
    'x-data-source': 'mongodb',
    ...headers
  };
  
  return NextResponse.json(data, { 
    status, 
    headers: responseHeaders 
  });
}

async function getPatientProfile(token) {
  try {
    let decodedToken;
    try {
      decodedToken = await verifyToken(token);
    } catch (error) {
      return {
        success: false,
        error: 'Unauthorized - Invalid token',
        status: 401,
        headers: { 'x-error-type': 'auth_error' }
      };
    }

    if (decodedToken.role !== 'patient') {
      return {
        success: false,
        error: 'Forbidden - Only patients can access this endpoint',
        status: 403,
        headers: { 'x-error-type': 'permission_error' }
      };
    }

    await connectToDatabase();

    // Handle both id and userId in token payload for backward compatibility
    const userId = decodedToken.userId || decodedToken.id;
    if (!userId) {
      return {
        success: false,
        error: 'Invalid token - missing user ID',
        status: 401,
        headers: { 'x-error-type': 'auth_error' }
      };
    }

    const user = await withTimeout(
      User.findById(userId).select('-password'),
      5000,
      'User lookup timed out'
    );

    if (!user) {
      return {
        success: false,
        error: 'User not found',
        status: 404,
        headers: { 'x-error-type': 'not_found' }
      };
    }

    const patientProfile = await withTimeout(
      Patient.findOne({ user: userId }),
      5000,
      'Patient profile lookup timed out'
    );

    if (!patientProfile) {
      return {
        success: false,
        error: 'Patient profile not found',
        status: 404,
        headers: { 'x-error-type': 'not_found' }
      };
    }

    const profileData = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        address: user.address,
        profileImage: user.profileImage,
        dateOfBirth: user.dateOfBirth
      },
      medicalInfo: {
        medicalHistory: patientProfile.medicalHistory || [],
        allergies: patientProfile.allergies || [],
        bloodType: patientProfile.bloodType,
        height: patientProfile.height,
        weight: patientProfile.weight,
        emergencyContact: patientProfile.emergencyContact
      }
    };

    return {
      success: true,
      profile: profileData,
      status: 200,
      headers: { 'x-data-completeness': 'full' }
    };

  } catch (error) {
    console.error('Error retrieving patient profile:', error);
    
    return {
      success: false,
      error: 'Internal server error',
      message: error.message,
      status: 500,
      headers: { 'x-error-type': 'server_error' }
    };
  }
}

async function updatePatientProfile(token, requestData) {
  try {
    let decodedToken;
    try {
      decodedToken = await verifyToken(token);
    } catch (error) {
      return {
        success: false,
        error: 'Unauthorized - Invalid token',
        status: 401,
        headers: { 'x-error-type': 'auth_error' }
      };
    }

    if (decodedToken.role !== 'patient') {
      return {
        success: false,
        error: 'Forbidden - Only patients can update their profile',
        status: 403,
        headers: { 'x-error-type': 'permission_error' }
      };
    }

    await connectToDatabase();

    if (requestData.user) {
      const allowedUserFields = [
        'firstName', 
        'lastName', 
        'phoneNumber', 
        'gender', 
        'address', 
        'profileImage',
        'dateOfBirth'
      ];
      
      const userUpdateData = {};
      
      for (const field of allowedUserFields) {
        if (requestData.user[field] !== undefined) {
          userUpdateData[field] = requestData.user[field];
        }
      }
      
      if (Object.keys(userUpdateData).length > 0) {
        await withTimeout(
          User.findByIdAndUpdate(decodedToken.userId, userUpdateData),
          5000,
          'User update timed out'
        );
      }
    }

    if (requestData.medicalInfo) {
      const patientProfile = await withTimeout(
        Patient.findOne({ user: decodedToken.userId }),
        5000,
        'Patient profile lookup timed out'
      );

      if (!patientProfile) {
        return {
          success: false,
          error: 'Patient profile not found',
          status: 404,
          headers: { 'x-error-type': 'not_found' }
        };
      }

      const allowedMedicalFields = [
        'medicalHistory',
        'allergies',
        'bloodType',
        'height',
        'weight',
        'emergencyContact'
      ];
      
      const medicalUpdateData = {};
      
      for (const field of allowedMedicalFields) {
        if (requestData.medicalInfo[field] !== undefined) {
          medicalUpdateData[field] = requestData.medicalInfo[field];
        }
      }
      
      if (Object.keys(medicalUpdateData).length > 0) {
        await withTimeout(
          Patient.findByIdAndUpdate(patientProfile._id, medicalUpdateData),
          5000,
          'Patient profile update timed out'
        );
      }
    }

    // Handle both id and userId in token payload for backward compatibility
    const userId = decodedToken.userId || decodedToken.id;
    if (!userId) {
      return {
        success: false,
        error: 'Invalid token - missing user ID',
        status: 401,
        headers: { 'x-error-type': 'auth_error' }
      };
    }

    const updatedUser = await withTimeout(
      User.findById(userId).select('-password'),
      5000,
      'User lookup timed out'
    );

    const updatedPatientProfile = await withTimeout(
      Patient.findOne({ user: userId }),
      5000,
      'Patient profile lookup timed out'
    );

    const updatedProfileData = {
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: `${updatedUser.firstName} ${updatedUser.lastName}`,
        phoneNumber: updatedUser.phoneNumber,
        gender: updatedUser.gender,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        dateOfBirth: updatedUser.dateOfBirth
      },
      medicalInfo: {
        medicalHistory: updatedPatientProfile.medicalHistory || [],
        allergies: updatedPatientProfile.allergies || [],
        bloodType: updatedPatientProfile.bloodType,
        height: updatedPatientProfile.height,
        weight: updatedPatientProfile.weight,
        emergencyContact: updatedPatientProfile.emergencyContact
      }
    };

    return {
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfileData,
      status: 200,
      headers: { 'x-data-completeness': 'full' }
    };

  } catch (error) {
    console.error('Error updating patient profile:', error);
    
    return {
      success: false,
      error: 'Internal server error',
      message: error.message,
      status: 500,
      headers: { 'x-error-type': 'server_error' }
    };
  }
}

export {
  getPatientProfile,
  updatePatientProfile,
  createApiResponse
};
