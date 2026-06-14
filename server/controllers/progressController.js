import Session from '../models/Session.js';
import Feedback from '../models/Feedback.js';
import Question from '../models/Question.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';

/**
 * Get progress overview for the current user
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const getProgressOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all completed sessions for the user
    const sessions = await Session.find({
      userId,
      status: 'completed'
    }).populate('questions').sort({ createdAt: -1 });

    // Get all feedback for the user
    const feedbacks = await Feedback.find({ userId }).populate('questionId');

    // Calculate overall statistics
    const totalSessions = sessions.length;
    const averageScore = totalSessions > 0
      ? sessions.reduce((sum, session) => sum + session.overallScore, 0) / totalSessions
      : 0;

    // Calculate scores by interview type
    const scoresByType = await Session.aggregate([
      { $match: { userId, status: 'completed' } },
      {
        $group: {
          _id: '$type',
          averageScore: { $avg: '$overallScore' },
          count: { $sum: 1 }
        }
      }
    ]);

    const typeScores = {
      hr: { averageScore: 0, count: 0 },
      technical: { averageScore: 0, count: 0 },
      dsa: { averageScore: 0, count: 0 },
      'company-specific': { averageScore: 0, count: 0 }
    };

    scoresByType.forEach(item => {
      if (typeScores[item._id]) {
        typeScores[item._id] = {
          averageScore: item.averageScore,
          count: item.count
        };
      }
    });

    // Calculate scores by domain (from questions)
    const domainScores = {};
    feedbacks.forEach(feedback => {
      if (feedback.questionId && feedback.questionId.domain) {
        const domain = feedback.questionId.domain;
        if (!domainScores[domain]) {
          domainScores[domain] = { totalScore: 0, count: 0 };
        }
        domainScores[domain].totalScore += feedback.finalScore;
        domainScores[domain].count += 1;
      }
    });

    const domainAverages = {};
    Object.keys(domainScores).forEach(domain => {
      domainAverages[domain] = domainScores[domain].totalScore / domainScores[domain].count;
    });

    // Find strongest and weakest skills
    let strongestSkill = null;
    let weakestSkill = null;
    let maxScore = -1;
    let minScore = 101;

    Object.keys(domainAverages).forEach(domain => {
      const score = domainAverages[domain];
      if (score > maxScore) {
        maxScore = score;
        strongestSkill = domain;
      }
      if (score < minScore) {
        minScore = score;
        weakestSkill = domain;
      }
    });

    // Prepare score over time data
    const scoreOverTime = sessions.map(session => ({
      date: session.createdAt,
      score: session.overallScore,
      type: session.type
    }));

    // Prepare session history
    const sessionHistory = sessions.map(session => ({
      id: session._id,
      date: session.createdAt,
      type: session.type,
      company: session.company,
      difficulty: session.difficulty,
      score: session.overallScore,
      duration: session.duration,
      numQuestions: session.numQuestions
    }));

    return apiSuccess(res, {
      totalSessions,
      averageScore,
      scoresByType: typeScores,
      domainScores: domainAverages,
      strongestSkill,
      weakestSkill,
      scoreOverTime,
      sessionHistory
    }, 'Progress overview retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detailed feedback for a specific session
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const getSessionFeedback = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await Session.findOne({
      _id: sessionId,
      userId
    }).populate('questions');

    if (!session) {
      return apiError(res, 'Session not found', 404);
    }

    const feedbacks = await Feedback.find({ sessionId }).populate('questionId');

    return apiSuccess(res, {
      session,
      feedbacks
    }, 'Session feedback retrieved successfully');
  } catch (error) {
    return next(error);
  }
};
