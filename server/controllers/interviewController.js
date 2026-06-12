// MODIFIED
import Session from '../models/Session.js';
import Question from '../models/Question.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';
import { callLLM } from '../services/llmService.js';
import * as memoryService from '../services/memoryService.js';
import * as companyService from '../services/companyService.js';
import * as followUpService from '../services/followUpService.js';

const uniqueQuestions = (questions) => {
  const seen = new Set();
  return questions.filter((question) => {
    const id = question?._id?.toString?.() || question?.toString?.();
    if (!id || seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });
};

const pickByDifficulty = async (domain, difficulty, limit, topicWeights = {}) => {
  const favoriteTopics = Object.keys(topicWeights);
  const query = { domain, difficulty };
  if (favoriteTopics.length) {
    query.tags = { $in: favoriteTopics };
  }

  let questions = await Question.find(query).limit(limit);
  if (questions.length < limit && favoriteTopics.length) {
    const fallback = await Question.find({ domain, difficulty }).limit(limit - questions.length);
    questions = uniqueQuestions([...questions, ...fallback]);
  }
  return questions;
};

/**
 * Starts an interview session with memory-aware and optional company-aware question selection.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
export const startSession = async (req, res, next) => {
  try {
    const { domain, questions = [], totalCount = 5, company, role } = req.body;
    const userId = req.user._id;
    const requestedCount = Number.parseInt(totalCount || questions.length || 5, 10);

    // NEW: Interview Memory System
    await memoryService.getOrCreateMemory(userId);
    const unaskedQuestions = await memoryService.getUnaskedQuestions(userId, domain, requestedCount);
    const weakFirst = await memoryService.getWeakTopicQuestions(userId, domain);
    let selectedQuestions = uniqueQuestions([...weakFirst, ...unaskedQuestions]).slice(0, requestedCount);

    // NEW: Company Intelligence
    let companyProfile = null;
    let companyConfig = null;
    if (company && role) {
      companyProfile = await companyService.getCompanyProfile(company, role);
      companyConfig = companyService.buildSessionConfig(companyProfile, requestedCount);
      const easyQuestions = await pickByDifficulty(domain, 'easy', companyConfig.easyCount, companyConfig.topicWeights);
      const mediumQuestions = await pickByDifficulty(domain, 'medium', companyConfig.mediumCount, companyConfig.topicWeights);
      const hardQuestions = await pickByDifficulty(domain, 'hard', companyConfig.hardCount, companyConfig.topicWeights);
      const companyQuestions = uniqueQuestions([...easyQuestions, ...mediumQuestions, ...hardQuestions]);
      selectedQuestions = uniqueQuestions([...weakFirst, ...companyQuestions, ...unaskedQuestions]).slice(0, requestedCount);
    }

    if (!selectedQuestions.length && questions.length) {
      selectedQuestions = questions;
    }

    const session = await Session.create({
      userId,
      domain,
      questions: selectedQuestions.map((question) => question?._id?.toString?.() || question?.toString?.()),
      status: 'ongoing',
      targetCompany: company || null,
      targetRole: role || null,
      currentDifficulty: 'medium',
    });

    return apiSuccess(
      res,
      { session, questions: selectedQuestions, companyProfile, companyConfig },
      'Session started successfully',
      201
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Submits an answer and returns adaptive follow-up metadata.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
export const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, answer, questionId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session || session.status !== 'ongoing') {
      return apiError(res, 'Session not found or already completed', 404);
    }

    const currentQuestionId = questionId || session.questions[session.answers.length] || session.questions[session.questions.length - 1];
    const currentQuestion = currentQuestionId ? await Question.findById(currentQuestionId) : null;
    const questionText = currentQuestion?.text || currentQuestionId || 'Interview answer';
    const llmResponse = await callLLM({ transcript: answer, question: questionText });

    session.answers.push(answer);
    session.scores.push(0);
    await session.save();

    // NEW: Adaptive Difficulty + Follow-Up Question Engine
    const followUp = await followUpService.getFollowUp(sessionId, answer, currentQuestion || questionText);
    await Session.findByIdAndUpdate(sessionId, { currentDifficulty: followUp.nextDifficulty });

    return apiSuccess(res, { answer, session, llmResponse, followUp }, 'Answer submitted successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Ends a session and updates interview memory.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
export const endSession = async (req, res, next) => {
  try {
    const { sessionId, duration = 0 } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) {
      return apiError(res, 'Session not found', 404);
    }

    const overallScore = session.scores.length > 0
      ? session.scores.reduce((sum, value) => sum + value, 0) / session.scores.length
      : 0;
    session.overallScore = overallScore;
    session.duration = duration;
    session.status = 'completed';
    await session.save();

    // NEW: Interview Memory System
    await memoryService.updateAfterSession(session.userId, {
      questions: session.questions,
      answers: session.answers,
      scores: session.scores,
      domain: session.domain,
    });

    return apiSuccess(res, session, 'Session ended successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Generates a follow-up for an explicit question and transcript.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
export const getFollowUp = async (req, res, next) => {
  try {
    const { sessionId, lastQuestionId, transcript } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) {
      return apiError(res, 'Session not found', 404);
    }

    const question = lastQuestionId ? await Question.findById(lastQuestionId) : null;
    const followUp = await followUpService.getFollowUp(sessionId, transcript, question || lastQuestionId);
    await Session.findByIdAndUpdate(sessionId, { currentDifficulty: followUp.nextDifficulty });

    return apiSuccess(res, followUp, 'Follow-up generated successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets one session by id.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
export const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id).populate('userId', 'name email');
    if (!session) {
      return apiError(res, 'Session not found', 404);
    }

    if (req.user.role !== 'admin' && session.userId._id.toString() !== req.user._id.toString()) {
      return apiError(res, 'Unauthorized access', 403);
    }

    return apiSuccess(res, session, 'Session retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets all sessions visible to the current user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
export const getAllSessions = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const sessions = await Session.find(filter).sort({ createdAt: -1 });
    return apiSuccess(res, sessions, 'Sessions retrieved successfully');
  } catch (error) {
    return next(error);
  }
};
