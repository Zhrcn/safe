import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing _id, email, and role
 * @param {String} expiresIn - Token expiration time (default: '7d')
 * @returns {String} JWT token
 */
export function generateToken(user, expiresIn = '7d') {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
export function verifyToken(token) {
  try {
    console.log('Verifying token with secret:', JWT_SECRET.substring(0, 5) + '...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully, payload:', JSON.stringify(decoded, null, 2));
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw new Error('Invalid token');
  }
}

/**
 * Extract token from authorization header
 * @param {String} authHeader - Authorization header
 * @returns {String|null} Extracted token or null if invalid
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
}

/**
 * Check if a user has the required role
 * @param {Object} decodedToken - Decoded JWT token
 * @param {String|Array} requiredRole - Required role(s)
 * @returns {Boolean} True if user has the required role
 */
export function hasRole(decodedToken, requiredRole) {
  if (!decodedToken || !decodedToken.role) {
    return false;
  }
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(decodedToken.role);
  }
  
  return decodedToken.role === requiredRole;
}
