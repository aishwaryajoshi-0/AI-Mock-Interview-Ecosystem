// MODIFIED
import { apiError, apiSuccess } from '../utils/apiResponse.js';
import * as recommendationService from '../services/recommendationService.js';

/**
 * Gets latest recommendations for a user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getLatestRecommendations = async (req, res, next) => {
  try {
    const recommendations = await recommendationService.getLatestRecommendations(req.params.userId);
    return apiSuccess(res, { recommendations }, 'Recommendations retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets recommendation history for a user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await recommendationService.getRecommendationHistory(req.params.userId);
    return apiSuccess(res, { history }, 'History retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Marks a resource completed.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const markResourceComplete = async (req, res, next) => {
  try {
    const recommendation = await recommendationService.markResourceComplete(
      req.user._id,
      req.params.recId,
      Number.parseInt(req.params.idx, 10)
    );
    if (!recommendation) {
      return apiError(res, 'Recommendation not found', 404);
    }
    return apiSuccess(res, recommendation, 'Resource marked as completed');
  } catch (error) {
    return next(error);
  }
};

/**
 * Marks a plan task completed.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const markPlanTaskComplete = async (req, res, next) => {
  try {
    const recommendation = await recommendationService.markPlanTaskComplete(
      req.user._id,
      req.params.recId,
      Number.parseInt(req.params.day, 10)
    );
    if (!recommendation) {
      return apiError(res, 'Recommendation not found', 404);
    }
    return apiSuccess(res, recommendation, 'Task marked as completed');
  } catch (error) {
    return next(error);
  }
};

export { getLatestRecommendations, getHistory, markResourceComplete, markPlanTaskComplete };
