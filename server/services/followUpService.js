import Session from '../models/Session.js';
import { evaluateAnswerQuality, generateFollowUpQuestion, getNextDifficulty } from './adaptiveEngine.js';

/**
 * Decides whether a follow-up should be asked.
 * @param {string} depth - Evaluated answer depth.
 * @param {string[]} missingConcepts - Missing concept names.
 * @returns {boolean} Whether a follow-up should be asked.
 */
const shouldAskFollowUp = (depth, missingConcepts = []) => {
  return depth === 'shallow' || missingConcepts.length > 0;
};

/**
 * Evaluates the last answer and optionally generates a follow-up question.
 * @param {string} sessionId - Session id.
 * @param {string} lastAnswer - Latest submitted answer.
 * @param {object|string} lastQuestion - Latest question document or text.
 * @returns {Promise<object>} Follow-up decision payload.
 */
const getFollowUp = async (sessionId, lastAnswer, lastQuestion) => {
  try {
    // NEW: Adaptive Difficulty + Follow-Up Question Engine
    const session = await Session.findById(sessionId);
    const questionText = lastQuestion?.text || String(lastQuestion || '');
    const evaluation = await evaluateAnswerQuality(lastAnswer, questionText);
    const currentDifficulty = session?.currentDifficulty || lastQuestion?.difficulty || 'medium';
    const nextDifficulty = getNextDifficulty(currentDifficulty, evaluation.qualityScore);

    let followUpQuestion = null;
    if (shouldAskFollowUp(evaluation.depth, evaluation.missingConcepts)) {
      followUpQuestion = await generateFollowUpQuestion(lastQuestion, lastAnswer, evaluation.missingConcepts);
      if (session) {
        session.followUpHistory.push({
          questionText: followUpQuestion.text,
          userAnswer: lastAnswer,
          answeredAt: new Date(),
        });
        await session.save();
      }
    }

    return {
      hasFollowUp: Boolean(followUpQuestion),
      followUpQuestion,
      nextDifficulty,
      qualityScore: evaluation.qualityScore,
    };
  } catch (error) {
    console.error('Error in getFollowUp:', error);
    return {
      hasFollowUp: false,
      followUpQuestion: null,
      nextDifficulty: 'medium',
      qualityScore: 50,
    };
  }
};

export { shouldAskFollowUp, getFollowUp };
