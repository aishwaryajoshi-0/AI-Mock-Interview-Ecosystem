import { apiError } from '../utils/apiResponse.js';
import { verifyToken } from '../utils/generateToken.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return apiError(res, 'Authorization token missing', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return apiError(res, 'User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return apiError(res, 'Token expired', 401);
    }
    return apiError(res, 'Invalid authorization token', 401);
  }
};
