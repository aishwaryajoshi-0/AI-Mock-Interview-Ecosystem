import Question from '../models/Question.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';

export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    return apiSuccess(res, questions, 'Questions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return apiError(res, 'Question not found', 404);
    }
    return apiSuccess(res, question, 'Question retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getQuestionsByDomain = async (req, res, next) => {
  try {
    const questions = await Question.find({ domain: req.params.domain }).sort({ createdAt: -1 });
    return apiSuccess(res, questions, 'Questions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    const { text, domain, difficulty, type, tags = [] } = req.body;
    const question = await Question.create({
      text,
      domain,
      difficulty,
      type,
      tags,
      createdBy: req.user._id,
    });
    return apiSuccess(res, question, 'Question created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return apiError(res, 'Question not found', 404);
    }

    if (req.user.role !== 'admin' && question.createdBy.toString() !== req.user._id.toString()) {
      return apiError(res, 'Unauthorized access', 403);
    }

    const updates = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, updates, { new: true });

    return apiSuccess(res, updatedQuestion, 'Question updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return apiError(res, 'Question not found', 404);
    }

    if (req.user.role !== 'admin' && question.createdBy.toString() !== req.user._id.toString()) {
      return apiError(res, 'Unauthorized access', 403);
    }

    await question.remove();
    return apiSuccess(res, null, 'Question deleted successfully');
  } catch (error) {
    next(error);
  }
};
