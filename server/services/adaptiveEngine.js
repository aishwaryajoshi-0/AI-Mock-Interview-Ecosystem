// MODIFIED
import { callLLM } from './llmService.js';

const extractJson = (value) => {
  if (typeof value === 'object' && value !== null) {
    return value;
  }

  const text = String(value || '');
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1] : text);
};

/**
 * Evaluates answer quality with an LLM and returns normalized scoring metadata.
 * @param {string} transcript - User answer transcript.
 * @param {string} questionText - Interview question text.
 * @returns {Promise<{qualityScore: number, depth: string, missingConcepts: string[]}>}
 */
const evaluateAnswerQuality = async (transcript, questionText) => {
  try {
    // NEW: Adaptive Difficulty + Follow-Up Question Engine
    const prompt = `You are an interview evaluator. Return ONLY valid JSON.
Question: ${questionText}
Answer: ${transcript}
Return JSON: { "qualityScore": 0-100, "depth": "shallow|adequate|deep", "missingConcepts": ["string"] }`;
    const response = await callLLM({ transcript: prompt, question: questionText });
    const parsed = extractJson(response.feedbackText);

    return {
      qualityScore: Number(parsed.qualityScore) || 50,
      depth: ['shallow', 'adequate', 'deep'].includes(parsed.depth) ? parsed.depth : 'adequate',
      missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
    };
  } catch (error) {
    console.error('Error in evaluateAnswerQuality:', error);
    return { qualityScore: 50, depth: 'adequate', missingConcepts: [] };
  }
};

/**
 * Computes the next difficulty level from the current level and answer quality.
 * @param {string} currentDifficulty - Current difficulty.
 * @param {number} qualityScore - Answer quality score.
 * @returns {string} Next difficulty.
 */
const getNextDifficulty = (currentDifficulty, qualityScore) => {
  try {
    // NEW: Adaptive Difficulty + Follow-Up Question Engine
    if (qualityScore > 75 && currentDifficulty !== 'hard') {
      return currentDifficulty === 'easy' ? 'medium' : 'hard';
    }

    if (qualityScore < 40 && currentDifficulty !== 'easy') {
      return currentDifficulty === 'hard' ? 'medium' : 'easy';
    }

    return currentDifficulty;
  } catch (error) {
    console.error('Error in getNextDifficulty:', error);
    return currentDifficulty;
  }
};

/**
 * Generates a follow-up question focused on missing concepts.
 * @param {object|string} originalQuestion - Original question document or text.
 * @param {string} transcript - User answer transcript.
 * @param {string[]} missingConcepts - Missing concepts from the evaluator.
 * @returns {Promise<object>} Follow-up question payload.
 */
const generateFollowUpQuestion = async (originalQuestion, transcript, missingConcepts) => {
  try {
    // NEW: Adaptive Difficulty + Follow-Up Question Engine
    const questionText = originalQuestion?.text || String(originalQuestion || '');
    const prompt = `Generate one concise interview follow-up question.
Original question: ${questionText}
Candidate answer: ${transcript}
Target these missing concepts: ${missingConcepts.join(', ')}
Return only the question text.`;
    const response = await callLLM({ transcript: prompt, question: questionText });

    return {
      text: response.feedbackText || 'Can you expand on the missing concepts in your answer?',
      isFollowUp: true,
      domain: originalQuestion?.domain || null,
      difficulty: originalQuestion?.difficulty || 'medium',
    };
  } catch (error) {
    console.error('Error in generateFollowUpQuestion:', error);
    return {
      text: 'Can you expand on the most important concept you did not cover?',
      isFollowUp: true,
      domain: originalQuestion?.domain || null,
      difficulty: originalQuestion?.difficulty || 'medium',
    };
  }
};

export { evaluateAnswerQuality, getNextDifficulty, generateFollowUpQuestion };
