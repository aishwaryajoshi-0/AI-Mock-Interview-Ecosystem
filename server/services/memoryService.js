// MODIFIED
import InterviewMemory from '../models/InterviewMemory.js';
import Question from '../models/Question.js';
import mongoose from 'mongoose';

const normalizeId = (value) => value?._id?.toString?.() || value?.toString?.();

/**
 * Gets an existing interview memory document or creates an empty one.
 * @param {string} userId - MongoDB user id.
 * @returns {Promise<object>} Interview memory document.
 */
const getOrCreateMemory = async (userId) => {
  try {
    let memory = await InterviewMemory.findOne({ userId });

    if (!memory) {
      memory = await InterviewMemory.create({
        userId,
        coveredTopics: [],
        weakTopics: [],
        strongTopics: [],
        askedQuestionIds: [],
        exposureHistory: [],
        learningProgress: [],
      });
    }

    return memory;
  } catch (error) {
    console.error('Error in getOrCreateMemory:', error);
    throw error;
  }
};

/**
 * Updates memory after a completed session.
 * @param {string} userId - MongoDB user id.
 * @param {{ questions: Array, answers: Array, scores: number[], domain: string }} sessionData - Session summary.
 * @returns {Promise<object>} Updated memory document.
 */
const updateAfterSession = async (userId, sessionData) => {
  try {
    const { questions = [], scores = [], domain } = sessionData;
    const memory = await getOrCreateMemory(userId);

    // NEW: Interview Memory System
    const existingIds = new Set(memory.askedQuestionIds.map((id) => id.toString()));
    const newQuestionIds = questions
      .map(normalizeId)
      .filter(Boolean)
      .filter((id) => mongoose.isValidObjectId(id))
      .filter((id) => !existingIds.has(id));
    memory.askedQuestionIds.push(...newQuestionIds);

    // NEW: Interview Memory System
    if (domain && !memory.coveredTopics.includes(domain)) {
      memory.coveredTopics.push(domain);
    }

    // NEW: Interview Memory System
    const validScores = scores.filter((score) => Number.isFinite(Number(score))).map(Number);
    const avgScore = validScores.length
      ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
      : 0;

    if (domain) {
      memory.weakTopics = memory.weakTopics.filter((topic) => topic !== domain);
      memory.strongTopics = memory.strongTopics.filter((topic) => topic !== domain);

      if (avgScore < 50) {
        memory.weakTopics.push(domain);
      } else if (avgScore > 75) {
        memory.strongTopics.push(domain);
      }
    }

    // NEW: Interview Memory System
    const exposure = memory.exposureHistory.find((item) => item.topic === domain);
    if (exposure) {
      exposure.count += 1;
      exposure.lastAsked = new Date();
    } else if (domain) {
      memory.exposureHistory.push({ topic: domain, count: 1, lastAsked: new Date() });
    }

    // NEW: Interview Memory System
    const progress = memory.learningProgress.find((item) => item.topic === domain);
    if (progress) {
      progress.scoreHistory.push(avgScore);
      if (progress.scoreHistory.length >= 3) {
        const last3 = progress.scoreHistory.slice(-3);
        if (last3[0] < last3[1] && last3[1] < last3[2]) {
          progress.trend = 'improving';
        } else if (last3[0] > last3[1] && last3[1] > last3[2]) {
          progress.trend = 'declining';
        } else {
          progress.trend = 'stable';
        }
      }
    } else if (domain) {
      memory.learningProgress.push({ topic: domain, scoreHistory: [avgScore], trend: 'stable' });
    }

    memory.updatedAt = new Date();
    await memory.save();

    return memory;
  } catch (error) {
    console.error('Error in updateAfterSession:', error);
    throw error;
  }
};

/**
 * Gets questions a user has not seen for a domain, falling back to repeats if needed.
 * @param {string} userId - MongoDB user id.
 * @param {string} domain - Question domain.
 * @param {number} count - Number of questions to return.
 * @returns {Promise<Array>} Matching Question documents.
 */
const getUnaskedQuestions = async (userId, domain, count) => {
  try {
    const memory = await getOrCreateMemory(userId);
    const askedIds = memory.askedQuestionIds.map((id) => id.toString());
    const unaskedQuestions = await Question.find({
      domain,
      _id: { $nin: askedIds },
    }).limit(count);

    if (unaskedQuestions.length < count) {
      console.warn(`Not enough unasked questions for domain ${domain}. Falling back to repeated questions.`);
      const repeatQuestions = await Question.find({
        domain,
        _id: { $nin: unaskedQuestions.map((question) => question._id) },
      }).limit(count - unaskedQuestions.length);

      return [...unaskedQuestions, ...repeatQuestions];
    }

    return unaskedQuestions;
  } catch (error) {
    console.error('Error in getUnaskedQuestions:', error);
    throw error;
  }
};

/**
 * Gets questions matching a user's weak topics.
 * @param {string} userId - MongoDB user id.
 * @param {string} domain - Question domain.
 * @returns {Promise<Array>} Weak-topic Question documents.
 */
const getWeakTopicQuestions = async (userId, domain) => {
  try {
    const memory = await getOrCreateMemory(userId);
    if (!memory.weakTopics.length) {
      return [];
    }

    return Question.find({
      domain,
      tags: { $in: memory.weakTopics },
    }).sort({ difficulty: 1 });
  } catch (error) {
    console.error('Error in getWeakTopicQuestions:', error);
    throw error;
  }
};

export { getOrCreateMemory, updateAfterSession, getUnaskedQuestions, getWeakTopicQuestions };
