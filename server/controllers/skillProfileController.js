// MODIFIED
import { apiSuccess } from '../utils/apiResponse.js';
import * as skillProfileService from '../services/skillProfileService.js';

/**
 * Gets the user's skill profile.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await skillProfileService.getOrCreateProfile(req.params.userId);
    return apiSuccess(res, profile, 'Skill profile retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets the user's weakest topics.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getWeakest = async (req, res, next) => {
  try {
    const count = Number.parseInt(req.query.count || '3', 10);
    const weakTopics = await skillProfileService.getWeakestTopics(req.params.userId, count);
    return apiSuccess(res, { weakTopics }, 'Weakest topics retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets historical scores for one topic.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await skillProfileService.getSkillHistory(req.params.userId, req.params.topic);
    return apiSuccess(res, history, 'Skill history retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

export { getProfile, getWeakest, getHistory };
