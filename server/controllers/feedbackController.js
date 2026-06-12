// MODIFIED
import Feedback from '../models/Feedback.js';
import Session from '../models/Session.js';
import Question from '../models/Question.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';
import { calculateFinalScore } from '../utils/scoreCalculator.js';
import { callNLP } from '../services/nlpService.js';
import { callEmotion } from '../services/emotionService.js';
import { callLLM } from '../services/llmService.js';
import * as skillProfileService from '../services/skillProfileService.js';
import * as recommendationService from '../services/recommendationService.js';

/**
 * Generates feedback for an answer and updates skill/recommendation side effects.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
export const generateFeedback = async (req, res, next) => {
  try {
    const { sessionId, transcript, questionId, frameData } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) {
      return apiError(res, 'Session not found', 404);
    }

    const question = questionId ? await Question.findById(questionId) : null;
    const nlpResult = await callNLP(transcript);
    const emotionResult = await callEmotion({ frameData });
    const llmResult = await callLLM({ transcript, question: question?.text || 'Interview response' });

    const contentScore = 80;
    const keywordScore = nlpResult.keywordsMatched.length * 10;
    const finalScore = calculateFinalScore({
      contentScore,
      sentimentScore: nlpResult.sentimentScore,
      keywordScore,
      confidenceScore: emotionResult.confidenceScore,
    });

    const feedback = await Feedback.create({
      sessionId,
      userId: req.user._id,
      questionId,
      transcript,
      sentimentScore: nlpResult.sentimentScore,
      fillerWordCount: nlpResult.fillerWordCount,
      keywordsMatched: nlpResult.keywordsMatched,
      contentScore,
      finalScore,
      suggestions: [llmResult.feedbackText],
    });

    if (session.status === 'ongoing') {
      session.scores.push(finalScore);
      await session.save();
    }

    // NEW: User Skill Profile
    await skillProfileService.updateSkills(req.user._id.toString(), session.domain, finalScore, sessionId);

    // NEW: Learning Recommendation Engine
    const weakTopics = await skillProfileService.getWeakestTopics(req.user._id.toString(), 3);
    recommendationService
      .generateRecommendations(req.user._id, sessionId, weakTopics)
      .catch((err) => console.error('Recommendation generation failed silently:', err));

    return apiSuccess(res, { feedback, idealAnswer: llmResult.idealAnswer }, 'Feedback generated successfully', 201);
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets all feedback for a session.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
export const getFeedbackBySession = async (req, res, next) => {
  try {
    const feedbackList = await Feedback.find({ sessionId: req.params.sessionId }).sort({ createdAt: -1 });
    return apiSuccess(res, feedbackList, 'Feedback list retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets one feedback document.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
export const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return apiError(res, 'Feedback not found', 404);
    }
    return apiSuccess(res, feedback, 'Feedback retrieved successfully');
  } catch (error) {
    return next(error);
  }
};
