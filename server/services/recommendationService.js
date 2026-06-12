// MODIFIED
import Recommendation from '../models/Recommendation.js';
import { callLLM } from './llmService.js';

const extractJson = (value) => {
  const text = String(value || '');
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1] : text);
};

const fallbackRecommendation = (weakTopic) => ({
  resources: [
    { title: `${weakTopic} overview`, url: 'https://www.geeksforgeeks.org/', type: 'article' },
    { title: `${weakTopic} video lessons`, url: 'https://www.youtube.com/', type: 'video' },
    { title: `${weakTopic} practice set`, url: 'https://leetcode.com/', type: 'practice' },
    { title: `${weakTopic} course`, url: 'https://www.coursera.org/', type: 'course' },
    { title: `${weakTopic} notes`, url: 'https://www.javatpoint.com/', type: 'article' },
  ],
  practiceQuestions: [
    `Explain the most important concepts in ${weakTopic}.`,
    `Solve one interview-style ${weakTopic} problem and explain your tradeoffs.`,
    `List common mistakes candidates make in ${weakTopic}.`,
  ],
  weeklyPlan: Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    task: `Spend 30 minutes improving ${weakTopic} fundamentals.`,
  })),
});

/**
 * Generates learning recommendations for up to three weak topics.
 * @param {string} userId - MongoDB user id.
 * @param {string} sessionId - MongoDB session id.
 * @param {string[]} weakTopics - Weak topic names.
 * @returns {Promise<Array>} Created recommendation documents.
 */
const generateRecommendations = async (userId, sessionId, weakTopics = []) => {
  try {
    const created = [];

    // NEW: Learning Recommendation Engine
    for (const weakTopic of weakTopics.slice(0, 3)) {
      let data = fallbackRecommendation(weakTopic);
      try {
        const prompt = `You are a learning advisor. Return ONLY valid JSON, no markdown.
Weak topic: ${weakTopic}
Return { "resources": [{ "title": "string", "url": "string", "type": "video|article|practice|course" }], "practiceQuestions": ["string"], "weeklyPlan": [{ "day": 1, "task": "string" }] }.
Use exactly 5 resources, 3 practiceQuestions, and 7 weeklyPlan tasks.`;
        const response = await callLLM({ transcript: prompt, question: `Learning plan for ${weakTopic}` });
        data = extractJson(response.feedbackText);
      } catch (error) {
        console.warn(`Using fallback recommendation for ${weakTopic}:`, error.message);
      }

      const recommendation = await Recommendation.create({
        userId,
        sessionId,
        weakTopic,
        resources: (data.resources || fallbackRecommendation(weakTopic).resources).slice(0, 5),
        practiceQuestions: (data.practiceQuestions || fallbackRecommendation(weakTopic).practiceQuestions).slice(0, 3),
        weeklyPlan: (data.weeklyPlan || fallbackRecommendation(weakTopic).weeklyPlan).slice(0, 7),
      });
      created.push(recommendation);
    }

    return created;
  } catch (error) {
    console.error('Error in generateRecommendations:', error);
    throw error;
  }
};

/**
 * Gets latest recommendations for a user.
 * @param {string} userId - MongoDB user id.
 * @returns {Promise<Array>} Latest recommendation documents.
 */
const getLatestRecommendations = async (userId) => {
  try {
    return Recommendation.find({ userId }).sort({ generatedAt: -1 }).limit(3);
  } catch (error) {
    console.error('Error in getLatestRecommendations:', error);
    throw error;
  }
};

/**
 * Gets recommendation history without heavy resource and plan arrays.
 * @param {string} userId - MongoDB user id.
 * @returns {Promise<Array>} Recommendation history.
 */
const getRecommendationHistory = async (userId) => {
  try {
    return Recommendation.find({ userId }).sort({ generatedAt: -1 }).select('-resources -weeklyPlan');
  } catch (error) {
    console.error('Error in getRecommendationHistory:', error);
    throw error;
  }
};

/**
 * Marks a recommendation resource complete for the owning user.
 * @param {string} userId - MongoDB user id.
 * @param {string} recommendationId - Recommendation id.
 * @param {number} resourceIndex - Resource index.
 * @returns {Promise<object|null>} Updated recommendation.
 */
const markResourceComplete = async (userId, recommendationId, resourceIndex) => {
  try {
    return Recommendation.findOneAndUpdate(
      { _id: recommendationId, userId },
      { $set: { [`resources.${resourceIndex}.isCompleted`]: true } },
      { new: true }
    );
  } catch (error) {
    console.error('Error in markResourceComplete:', error);
    throw error;
  }
};

/**
 * Marks a weekly plan task complete for the owning user.
 * @param {string} userId - MongoDB user id.
 * @param {string} recommendationId - Recommendation id.
 * @param {number} day - Day number.
 * @returns {Promise<object|null>} Updated recommendation.
 */
const markPlanTaskComplete = async (userId, recommendationId, day) => {
  try {
    return Recommendation.findOneAndUpdate(
      { _id: recommendationId, userId, 'weeklyPlan.day': day },
      { $set: { 'weeklyPlan.$.isCompleted': true } },
      { new: true }
    );
  } catch (error) {
    console.error('Error in markPlanTaskComplete:', error);
    throw error;
  }
};

export {
  generateRecommendations,
  getLatestRecommendations,
  getRecommendationHistory,
  markResourceComplete,
  markPlanTaskComplete,
};
