import { connectToDatabase, withTimeout } from '@/lib/db';
import { createApiResponse } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';
import User from '@/models/User';
import Patient from '@/models/Patient';

const log = logger('PatientProfileController');

/**
 * Get patient profile by user ID
 * @param {string} userId - The user ID of the patient
 * @returns {Object} Result object with success flag, profile data or error, status code, and headers
 */
async function getPatientProfile(userId) {
  try {
    log.debug(`Getting profile for patient with ID: ${userId}`);
    log.time('db-profile-lookup');
    
    await connectToDatabase();
    
    if (!userId) {
      log.warn('Missing user ID in request');
      return {
        success: false,
        error: 'Invalid request - missing user ID',
        status: 400,
        headers: { 'x-error-type': 'validation_error' }
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
      // Add contact field structure that the frontend expects
      contact: {
        email: user.email,
        phone: user.phoneNumber,
        address: user.address
      },
      medicalInfo: {
        medicalHistory: patientProfile.medicalHistory || [],
        allergies: patientProfile.allergies || [],
        bloodType: patientProfile.bloodType,
        height: patientProfile.height,
        weight: patientProfile.weight,
        emergencyContact: patientProfile.emergencyContact
      },
      // Add other expected fields that might be missing
      insurance: patientProfile.insurance || {
        provider: 'Unknown',
        policyNumber: 'Unknown',
        expiryDate: null
      },
      chronicConditions: patientProfile.chronicConditions || []
    };

    return {
      success: true,
      profile: profileData,
      status: 200,
      headers: { 'x-data-completeness': 'full' }
    };

  } catch (error) {
    log.error(`Error retrieving patient profile: ${error.message}`, error);
    log.timeEnd('db-profile-lookup');
    
    return {
      success: false,
      error: 'Internal server error',
      message: error.message,
      status: 500,
      headers: { 'x-error-type': 'server_error' }
    };
  }
}

/**
 * Update patient profile by user ID
 * @param {string} userId - The user ID of the patient
 * @param {Object} requestData - The profile data to update
 * @returns {Object} Result object with success flag, updated profile data or error, status code, and headers
 */
async function updatePatientProfile(userId, requestData) {
  try {
    log.debug(`Updating profile for patient with ID: ${userId}`);
    log.time('db-profile-update');
    
    await connectToDatabase();
    
    if (!userId) {
      log.warn('Missing user ID in request');
      return {
        success: false,
        error: 'Invalid request - missing user ID',
        status: 400,
        headers: { 'x-error-type': 'validation_error' }
      };
    }
    
    if (!requestData || Object.keys(requestData).length === 0) {
      log.warn('Empty update data received');
      return {
        success: false,
        error: 'Invalid request - no data provided',
        status: 400,
        headers: { 'x-error-type': 'validation_error' }
      };
    }

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
    
    // Check if user data exists in the request
    if (requestData.user && typeof requestData.user === 'object') {
      for (const field of allowedUserFields) {
        if (requestData.user[field] !== undefined) {
          userUpdateData[field] = requestData.user[field];
        }
      }
    }
    
    if (Object.keys(userUpdateData).length > 0) {
      await withTimeout(
        User.findByIdAndUpdate(userId, userUpdateData),
        5000,
        'User update timed out'
      );
    }

    if (requestData.medicalInfo) {
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
          Patient.findOneAndUpdate(
            { user: userId }, 
            { $set: medicalUpdateData }
          ),
          5000,
          'Patient medical info update timed out'
        );
      }
    }

    if (requestData.insurance) {
      await withTimeout(
        Patient.findOneAndUpdate(
          { user: userId }, 
          { $set: { insurance: requestData.insurance } }
        ),
        5000,
        'Patient insurance update timed out'
      );
    }

    // Get updated profile data

    const updatedUser = await withTimeout(
      User.findById(userId).select('-password'),
      5000,
      'User lookup timed out'
    );

    const updatedPatient = await withTimeout(
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
      // Add contact field structure that the frontend expects
      contact: {
        email: updatedUser.email,
        phone: updatedUser.phoneNumber,
        address: updatedUser.address
      },
      medicalInfo: {
        medicalHistory: updatedPatient.medicalHistory || [],
        allergies: updatedPatient.allergies || [],
        bloodType: updatedPatient.bloodType,
        height: updatedPatient.height,
        weight: updatedPatient.weight,
        emergencyContact: updatedPatient.emergencyContact
      },
      // Add other expected fields that might be missing
      insurance: updatedPatient.insurance || {
        provider: 'Unknown',
        policyNumber: 'Unknown',
        expiryDate: null
      },
      chronicConditions: updatedPatient.chronicConditions || []
    };

    return {
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfileData,
      status: 200,
      headers: { 'x-data-completeness': 'full' }
    };

  } catch (error) {
    log.error(`Error updating patient profile: ${error.message}`, error);
    log.timeEnd('db-profile-update');
    
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
  updatePatientProfile
};
