import User from '../models/User.js';
import Session from '../models/Session.js';
import Question from '../models/Question.js';
import Feedback from '../models/Feedback.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    return apiSuccess(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return apiError(res, 'User not found', 404);
    }
    return apiSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return apiError(res, 'User not found', 404);
    }
    await user.remove();
    return apiSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const [userCount, sessionCount, questionCount, feedbackCount] = await Promise.all([
      User.countDocuments(),
      Session.countDocuments(),
      Question.countDocuments(),
      Feedback.countDocuments(),
    ]);

    return apiSuccess(res, { userCount, sessionCount, questionCount, feedbackCount }, 'Stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDashboardData = async (req, res, next) => {
  try {
    const recentSessions = await Session.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');
    const recentQuestions = await Question.find().sort({ createdAt: -1 }).limit(5);
    return apiSuccess(res, { recentSessions, recentQuestions }, 'Dashboard data retrieved successfully');
  } catch (error) {
    next(error);
  }
};
