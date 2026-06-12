// MODIFIED
import InterviewMemory from '../models/InterviewMemory.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';
import * as memoryService from '../services/memoryService.js';

/**
 * Returns a user's interview memory, creating it if needed.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getMemory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return apiError(res, 'Unauthorized access', 403);
    }

    const memory = await memoryService.getOrCreateMemory(userId);
    return apiSuccess(res, memory, 'Memory retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Deletes a user's interview memory document.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const resetMemory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await InterviewMemory.findOneAndDelete({ userId });
    return apiSuccess(res, null, 'Memory reset successfully');
  } catch (error) {
    return next(error);
  }
};

export { getMemory, resetMemory };
