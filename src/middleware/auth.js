import { verifyToken } from '@/lib/auth';
import { createApiResponse } from '@/lib/apiResponse';

/**
 * Authentication middleware for patient endpoints
 * Verifies JWT token and ensures the user is a patient
 * 
 * @param {Request} request - Next.js request object
 * @returns {Object} Authentication result with isAuthenticated flag and userId if successful
 */
export async function authenticatePatient(request) {
  try {
    // Check for token in Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { 
        isAuthenticated: false, 
        response: createApiResponse(
          { error: 'Unauthorized - Missing or invalid token' },
          401,
          { 'x-error-type': 'auth_error' }
        )
      };
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await verifyToken(token);
    
    if (!decodedToken || decodedToken.role !== 'patient') {
      return { 
        isAuthenticated: false, 
        response: createApiResponse(
          { error: 'Forbidden - Only patients can access this endpoint' },
          403,
          { 'x-error-type': 'permission_error' }
        )
      };
    }
    
    // Handle both id and userId in token payload for backward compatibility
    const userId = decodedToken.userId || decodedToken.id;
    if (!userId) {
      return { 
        isAuthenticated: false, 
        response: createApiResponse(
          { error: 'Invalid token - missing user ID' },
          401,
          { 'x-error-type': 'auth_error' }
        )
      };
    }
    
    return { 
      isAuthenticated: true, 
      userId, 
      role: decodedToken.role,
      email: decodedToken.email
    };
  } catch (error) {
    return { 
      isAuthenticated: false, 
      response: createApiResponse(
        { error: 'Authentication error', message: error.message },
        401,
        { 'x-error-type': 'auth_error' }
      )
    };
  }
}

/**
 * Authentication middleware for doctor endpoints
 * Verifies JWT token and ensures the user is a doctor
 * 
 * @param {Request} request - Next.js request object
 * @returns {Object} Authentication result with isAuthenticated flag and userId if successful
 */
export async function authenticateDoctor(request) {
  try {
    // Check for token in Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { 
        isAuthenticated: false, 
        response: createApiResponse(
          { error: 'Unauthorized - Missing or invalid token' },
          401,
          { 'x-error-type': 'auth_error' }
        )
      };
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await verifyToken(token);
    
    if (!decodedToken || decodedToken.role !== 'doctor') {
      return { 
        isAuthenticated: false, 
        response: createApiResponse(
          { error: 'Forbidden - Only doctors can access this endpoint' },
          403,
          { 'x-error-type': 'permission_error' }
        )
      };
    }
    
    // Handle both id and userId in token payload for backward compatibility
    const userId = decodedToken.userId || decodedToken.id;
    if (!userId) {
      return { 
        isAuthenticated: false, 
        response: createApiResponse(
          { error: 'Invalid token - missing user ID' },
          401,
          { 'x-error-type': 'auth_error' }
        )
      };
    }
    
    return { 
      isAuthenticated: true, 
      userId, 
      role: decodedToken.role,
      email: decodedToken.email
    };
  } catch (error) {
    return { 
      isAuthenticated: false, 
      response: createApiResponse(
        { error: 'Authentication error', message: error.message },
        401,
        { 'x-error-type': 'auth_error' }
      )
    };
  }
}
