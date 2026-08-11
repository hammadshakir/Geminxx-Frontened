// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import AppError from '../utils/Error.js';

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('🔑 Auth Header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided');
      return next(new AppError('Please login to access this resource', 401));
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Token:', token.substring(0, 20) + '...');

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('🔑 Decoded token:', decoded);
    } catch (jwtError) {
      console.log('❌ JWT Error:', jwtError.message);
      if (jwtError.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token', 401));
      }
      if (jwtError.name === 'TokenExpiredError') {
        return next(new AppError('Token expired', 401));
      }
      return next(new AppError('Authentication failed', 401));
    }

    // Check if user exists
    const user = await User.findById(decoded.id || decoded._id || decoded.userId);
    console.log('👤 User found:', user ? user.email : 'Not found');

    if (!user) {
      return next(new AppError('User not found. Please login again.', 404));
    }

    // Check if user is verified
    if (!user.isVerified) {
      return next(new AppError('Please verify your email first', 403));
    }

    // Check if user is active
    if (user.status === 'suspended') {
      return next(new AppError('Account suspended', 403));
    }

    // Check token version (for logout all)
    if (user.tokenVersion !== undefined && user.tokenVersion !== decoded.tokenVersion) {
      return next(new AppError('Session expired. Please login again.', 401));
    }

    // Attach user to request
    req.user = user;
    req.token = token;
    
    console.log(`✅ Auth successful: ${user.email} (${user.role})`);
    next();
  } catch (error) {
    console.error('❌ Auth error:', error);
    return next(new AppError('Authentication failed', 401));
  }
};